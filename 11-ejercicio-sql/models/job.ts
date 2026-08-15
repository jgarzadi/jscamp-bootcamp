import crypto from 'node:crypto'
import { db } from '../db/database.js'
import type { CreateJobDTO, Job, JobFilters, UpdateJobDTO } from '../types'

// Como estos valores los vamos a usar en diferentes sitios, los pasamos a variables
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100
const DEFAULT_OFFSET = 0

// Creamos un hanlder para poder parsear los valores numericos, evitando que sean: NaN, Infinity, -Infinity, y que si sean números enteros.
function parseInteger(value?: string): number | undefined {
  if (value === undefined || value.trim() === '') return undefined

  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : undefined
}

// Con esto, parseamos completamente los valores de limite y offset, evitando también que sean números negativos.
function parseLimit(value?: string): number {
  const parsed = parseInteger(value)
  if (parsed === undefined || parsed <= 0) return DEFAULT_LIMIT

  return Math.min(parsed, MAX_LIMIT)
}

// Para el offset el 0 sí es válido, así que acá solo rechazamos los negativos o los que no son números.
function parseOffset(value?: string): number {
  const parsed = parseInteger(value)
  if (parsed === undefined || parsed < 0) return DEFAULT_OFFSET

  return parsed
}

// Convertimos la fila que nos devuelve SQLite a la forma de objeto que usa nuestra app.
// Las tecnologías llegan como un string separado por comas, y el `content` solo se agrega si el job realmente lo tiene.
function mapRowToJob(row: any): Job {
  const job: Job = {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    data: {
      technology: row.technologies ? row.technologies.split(',') : [],
      modality: row.modality,
      level: row.level,
    }
  }

  if (row.content_description !== null && row.content_description !== undefined) {
    job.content = {
      description: row.content_description,
      responsibilities: row.responsibilities,
      requirements: row.requirements,
      about: row.about,
    }
  }

  return job
}

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    let query = `
      SELECT
        j.id,
        j.title,
        j.company,
        j.location,
        j.description,
        j.modality,
        j.level,
        GROUP_CONCAT(DISTINCT jt.technology) AS technologies
      FROM
        jobs j
      LEFT JOIN
        job_technologies jt ON j.id = jt.job_id
    `

    const conditions: string[] = []
    const params: Array<string | number> = []

    // Para filtrar por tecnología usamos `EXISTS` en vez de un `WHERE` sobre el join.
    // Así el job se filtra, pero seguimos trayendo todas sus tecnologías, no solo la que filtramos.
    if (filters?.tech) {
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM job_technologies filter_technology
          WHERE filter_technology.job_id = j.id
            AND filter_technology.technology = ?
        )
      `)
      params.push(filters.tech)
    }

    if (filters?.modality) {
      conditions.push('j.modality = ?')
      params.push(filters.modality)
    }

    if (filters?.level) {
      conditions.push('j.level = ?')
      params.push(filters.level)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    // El `ORDER BY` mantiene un orden estable entre páginas, y `LIMIT`/`OFFSET` van siempre juntos con los valores ya validados por `parseLimit` y `parseOffset`.
    query += `
      GROUP BY j.id
      ORDER BY j.id
      LIMIT ?
      OFFSET ?
    `

    params.push(parseLimit(filters?.limit), parseOffset(filters?.offset))

    const rows = db.prepare(query).all(...params) as any[]

    return rows.map(mapRowToJob)
  }

  // Obtener un job por ID
  // Traemos el job con sus tecnologías y su contenido en una sola consulta.
  // Usamos `LEFT JOIN` porque un job puede no tener tecnologías ni contenido, y no lo queremos perder por eso.
  static async getById(id: string): Promise<Job | undefined> {
    const query = `
      SELECT
        j.id,
        j.title,
        j.company,
        j.location,
        j.description,
        j.modality,
        j.level,
        GROUP_CONCAT(DISTINCT jt.technology) AS technologies,
        jc.description AS content_description,
        jc.responsibilities,
        jc.requirements,
        jc.about
      FROM
        jobs j
      LEFT JOIN
        job_technologies jt ON j.id = jt.job_id
      LEFT JOIN
        job_content jc ON j.id = jc.job_id
      WHERE
        j.id = ?
      GROUP BY
        j.id
    `

    const row = db.prepare(query).get(id) as any

    if (!row) {
      return undefined
    }

    return mapRowToJob(row)
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    // TODO: Debemos insertar el job en la base de datos
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }

    // Preparamos las sentencias y las corremos dentro de una transacción: si algo falla, el job no queda creado a medias.
    const insertJob = db.prepare(`
      INSERT INTO jobs (id, title, company, location, description, modality, level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const insertTechnology = db.prepare(`
      INSERT INTO job_technologies (job_id, technology)
      VALUES (?, ?)
    `)

    const insertContent = db.prepare(`
      INSERT INTO job_content (job_id, description, responsibilities, requirements, about)
      VALUES (?, ?, ?, ?, ?)
    `)

    const transaction = db.transaction(() => {
      insertJob.run(
        newJob.id,
        newJob.title,
        newJob.company,
        newJob.location,
        newJob.description,
        newJob.data.modality,
        newJob.data.level
      )

      for (const technology of newJob.data.technology) {
        insertTechnology.run(newJob.id, technology)
      }

      if (newJob.content) {
        insertContent.run(
          newJob.id,
          newJob.content.description,
          newJob.content.responsibilities,
          newJob.content.requirements,
          newJob.content.about
        )
      }
    })

    transaction()

    // Volvemos a leer el job recién creado para devolver el estado real que quedó guardado en la base.
    return (await this.getById(newJob.id)) as Job
  }

  // Eliminar un job
  // Con `PRAGMA foreign_keys = ON` y `ON DELETE CASCADE`, borrar el job también borra sus tecnologías y su contenido.
  static async delete(id: string): Promise<boolean> {
    const result = db.prepare(`DELETE FROM jobs WHERE id = ?`).run(id)
    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    // Primero buscamos el job actual: si no existe devolvemos `null` y el controlador responde 404.
    // Además lo usamos para no pisar con `undefined` los campos que no vienen en el body.
    const existingJob = await this.getById(id)

    if (!existingJob) {
      return null
    }

    // Envolvemos todo en una transacción, igual que en el seed: si falla algo, se revierte y el job queda como estaba.
    const transaction = db.transaction(() => {
      db.prepare(`
        UPDATE jobs
        SET title = ?, company = ?, location = ?, description = ?, modality = ?, level = ?
        WHERE id = ?
      `).run(
        input.title ?? existingJob.title,
        input.company ?? existingJob.company,
        input.location ?? existingJob.location,
        input.description ?? existingJob.description,
        input.data?.modality ?? existingJob.data.modality,
        input.data?.level ?? existingJob.data.level,
        id
      )

      // Para las tecnologías hacemos un reemplazo: borramos las viejas e insertamos la lista nueva.
      if (input.data?.technology !== undefined) {
        db.prepare(`DELETE FROM job_technologies WHERE job_id = ?`).run(id)

        const insertTechnology = db.prepare(`
          INSERT INTO job_technologies (job_id, technology)
          VALUES (?, ?)
        `)

        for (const technology of input.data.technology) {
          insertTechnology.run(id, technology)
        }
      }

      // Acá usamos `ON CONFLICT(job_id) DO UPDATE`: si el job no tenía contenido lo crea, y si ya tenía lo actualiza.
      if (input.content !== undefined) {
        db.prepare(`
          INSERT INTO job_content (job_id, description, responsibilities, requirements, about)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(job_id) DO UPDATE SET
            description = excluded.description,
            responsibilities = excluded.responsibilities,
            requirements = excluded.requirements,
            about = excluded.about
        `).run(
          id,
          input.content.description,
          input.content.responsibilities,
          input.content.requirements,
          input.content.about
        )
      }
    })

    transaction()
    return (await this.getById(id)) ?? null
  }
}
