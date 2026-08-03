import crypto from 'node:crypto'
import type { Job, CreateJobDTO, UpdateJobDTO, JobFilters, JobData, JobContent } from '../types'
import { db } from '../db/database.js'

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    // TODO: Debemos hacer la consulta a la base de datos para obtener todos los resultados, y por cada filtro,
    // debemos agregarlo a la consulta
    let query = `
      SELECT
        j.*,
        GROUP_CONCAT(jt.technology) AS technologies
      FROM
        jobs j
      JOIN
        job_technologies jt ON j.id = jt.job_id
    `

    const conditions: string[] = []
    const params: unknown[] = []

    if (filters?.tech) {
      conditions.push('jt.technology IN (?)')
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

    if(conditions.length > 0) {
      query += ' WHERE '  + conditions.join(' AND ')
    }

    query += ' GROUP BY j.id '

    if (filters?.limit) {
      query += ' LIMIT ?'
      params.push(filters.limit)
    }

    if (filters?.offset) {
      query += ' OFFSET ?'
      params.push(filters.offset)
    }

    console.log('Query:', query)
    const rows: any[] = db.prepare(query).all(...params)

    const jobs: Job[] = rows.map(row => {
      const jobData: JobData = {
        technology: row.technologies ? row.technologies.split(',') : [],
        modality: row.modality,
        level: row.level,
      }

      const job: Job = {
        id: row.id,
        title: row.title,
        company: row.company,
        location: row.location,
        description: row.description,
        data: jobData,
      }
      return job
    })
    return jobs
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
    // TODO: Debemos hacer la consulta a la base de datos para obtener el job por ID
    const query = `
      SELECT 
        j.id
        ,j.title
        ,j.company
        ,j.location
        ,j.description
        ,j.modality
        ,j.level
        ,GROUP_CONCAT(jt.technology) AS technology --Typescript is complaining if I use technologies due to the type definition
        ,jc.description AS content_description
        ,jc.responsibilities
        ,jc.requirements
        ,jc.about
      FROM 
        jobs j
      JOIN 
        job_technologies jt ON j.id = jt.job_id
      LEFT JOIN
        job_content jc ON j.id = jc.job_id
      WHERE 
        j.id = ?
      GROUP BY
        j.id
    `

    const row: any = db.prepare(query).get(id)

    if (!row) {
      return undefined
    }

    const jobData: JobData = {
      technology: row.technology ? row.technology.split(',') : [],
      modality: row.modality,
      level: row.level,
    }

    const jobContent: JobContent = {
      description: row.content_description,
      responsibilities: row.responsibilities,
      requirements: row.requirements,
      about: row.about,
    }

    const job: Job = {
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: jobData,
      content: jobContent,
    }
    
    return job
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    // TODO: Debemos insertar el job en la base de datos
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }
    
    db.transaction(() => {

      db.prepare(`
        INSERT INTO jobs (id, title, company, location, description, modality, level)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(newJob.id, newJob.title, newJob.company, newJob.location, newJob.description, newJob.data.modality, newJob.data.level)

      if(newJob.data.technology.length > 0) {
        for (const tech of newJob.data.technology) {
          db.prepare(`
            INSERT INTO job_technologies (job_id, technology)
            VALUES (?, ?)
          `).run(newJob.id, tech)
        }
      }

      if (newJob.content) {
        db.prepare(`
          INSERT INTO job_content (job_id, description, responsibilities, requirements, about)
          VALUES (?, ?, ?, ?, ?)
        `).run(newJob.id, newJob.content.description, newJob.content.responsibilities, newJob.content.requirements, newJob.content.about)
      }
    })()

    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    // TODO: Debemos eliminar el job de la base de datos
    const result = db.prepare(`DELETE FROM jobs WHERE id = ?`).run(id)
    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    const existingJob = await this.getById(id)

    if (!existingJob) {
      return null
    }

    db.transaction(() => {
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

      if (input.data?.technology !== undefined) {
        db.prepare(`DELETE FROM job_technologies WHERE job_id = ?`).run(id)
        for (const tech of input.data.technology) {
          db.prepare(`INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)`).run(id, tech)
        }
      }

      if (input.content !== undefined) {
        db.prepare(`
          UPDATE job_content
          SET description = ?, responsibilities = ?, requirements = ?, about = ?
          WHERE job_id = ?
        `).run(
          input.content.description  ?? existingJob.content?.description,
          input.content.responsibilities ?? existingJob.content?.responsibilities,
          input.content.requirements ?? existingJob.content?.requirements,
          input.content.about ?? existingJob.content?.about,
          id
        )
      }
    })()

    return await this.getById(id) ?? null
  }
}
