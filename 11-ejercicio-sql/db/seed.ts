/* Aquí irá tu código del segundo ejercicio */
import { db } from "./database.js"
import jobsData from '../jobs.json'

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
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Added autoincrement since content does not have a unique identifier in the JSON
        job_id TEXT NOT NULL UNIQUE, -- Added UNIQUE constraint to ensure one-to-one relationship with jobs
        description TEXT NOT NULL,
        responsibilities TEXT NOT NULL,
        requirements TEXT NOT NULL,
        about TEXT NOT NULL,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );
`)

const insertJob = db.prepare(`
    INSERT OR IGNORE INTO jobs (id, title, company, location, description, modality, level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertTechnology = db.prepare(`
    INSERT OR IGNORE INTO job_technologies (job_id, technology)
    VALUES (?, ?)
`)

const insertContent = db.prepare(`
    INSERT OR IGNORE INTO job_content (job_id, description, responsibilities, requirements, about)
    VALUES (?, ?, ?, ?, ?)
`)

const jobs = jobsData
const seed = db.transaction(() => {
    for (const job of jobs) {
        insertJob.run(job.id, job.title, job.company, job.location, job.description, job.modality, job.level)

        for (const tech of job.technologies) {
            if(tech){
                insertTechnology.run(job.id, tech)
            }   
        }

        if (job.content) {
            insertContent.run(job.id, job.content.description, job.content.responsibilities, job.content.requirements, job.content.about)
        }
    }
})

seed()
console.log('Database seeded successfully.')
