/* Aquí irá tu código del segundo ejercicio */
import jobsData from '../jobs.json'
import { db } from "./database.js"

// Hicimos unos cambios para ir más allá de lo dado, no significa que lo que hayas hecho este mal, sino que queremos mostrarte una manera diferente de hacer las cosas:
// 1. Cambiamos `job_id` para que sea primary key de la tabla `job_content`
// 2. Agregamos índices a las columnas que se filtran seguido, así SQLite no tiene que recorrer toda la tabla
// 3. Hicimos el seed idempotente: si lo corrés de nuevo no se duplican datos, se actualizan los que ya existen
// Creamos las tres tablas con `IF NOT EXISTS` para que no falle si ya existen.
// Si ves `job_content` usa `job_id` como primary key porque cada job tiene un solo contenido.
db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        modality TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
        level TEXT NOT NULL CHECK (level IN ('senior', 'junior', 'mid'))
    );

    CREATE TABLE IF NOT EXISTS job_technologies (
        job_id TEXT NOT NULL,
        technology TEXT NOT NULL,
        PRIMARY KEY (job_id, technology),
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS job_content (
        job_id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        responsibilities TEXT NOT NULL,
        requirements TEXT NOT NULL,
        about TEXT NOT NULL,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_modality
        ON jobs(modality);

    CREATE INDEX IF NOT EXISTS idx_jobs_level
        ON jobs(level);

    CREATE INDEX IF NOT EXISTS idx_job_technologies_technology
        ON job_technologies(technology);
`)

// Preparamos las sentencias una sola vez y las reutilizamos adentro de la transacción. Es más eficiente que prepararlas de nuevo en cada vuelta del for.
// Insertamos el job, pero si el id ya existe, lo actualizamos. Así el seed se puede correr las veces que quieras sin romper nada.
const insertJob = db.prepare(`
    INSERT INTO jobs (id, title, company, location, description, modality, level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        company = excluded.company,
        location = excluded.location,
        description = excluded.description,
        modality = excluded.modality,
        level = excluded.level
`)

// Borramos las tecnologías del job antes de reinsertarlas. Si no, al correr el seed de nuevo quedarían tecnologías viejas mezcladas.
const deleteTechnologies = db.prepare(`
    DELETE FROM job_technologies
    WHERE job_id = ?
`)

// Recién ahí insertamos las tecnologías nuevas. Si el job no tiene tecnologías, este for directamente no se ejecuta.
const insertTechnology = db.prepare(`
    INSERT INTO job_technologies (job_id, technology)
    VALUES (?, ?)
`)

// Hacemos lo mismo con el contenido: lo insertamos o lo actualizamos si ya existía. Solo corre si el job tiene `content`.
const insertContent = db.prepare(`
    INSERT INTO job_content (job_id, description, responsibilities, requirements, about)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(job_id) DO UPDATE SET
        description = excluded.description,
        responsibilities = excluded.responsibilities,
        requirements = excluded.requirements,
        about = excluded.about
`)

// Envolvemos todo en una transacción: si algo falla en el medio, se revierte todo y la base queda como estaba. Esto se usa mucho en modificaciones a varias tablas y procesos importantes, por ejemplo, un pago en nuestro sitio web.
const seed = db.transaction(() => {
    for (const job of jobsData) {
        insertJob.run(job.id, job.title, job.company, job.location, job.description, job.modality, job.level)

        deleteTechnologies.run(job.id)

        for (const tech of job.technologies) {
            insertTechnology.run(job.id, tech)
        }

        if (job.content) {
            insertContent.run(job.id, job.content.description, job.content.responsibilities, job.content.requirements, job.content.about)
        }
    }
})

seed()
console.log('Database seeded successfully.')
