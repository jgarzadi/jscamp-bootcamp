import jobs from '../jobs.json' with { type: 'json' }
import { randomUUID } from 'crypto'

/* Aquí deberá ir la lógica de tu modelo */
/* Recuerda que el modelo SOLO debe manejar la lógica de los datos, en este caso nuestro JSON */
export class JobModel {
    static async getAllJobs({ text, title, level, technology, limit, offset }) {
        let filteredJobs = jobs

        if (text) {
            this.validateText(text)
            filteredJobs = filteredJobs.filter(job => 
                job.titulo.toLowerCase().includes(text.toLowerCase()) ||
                job.descripcion.toLowerCase().includes(text.toLowerCase())
            )
        }

        if (title) {
            this.validateTitle(title)
            filteredJobs = filteredJobs.filter(job => job.titulo.toLowerCase().includes(title.toLowerCase()))
        }

        if (level) {
            this.validateLevel(level)
            filteredJobs = filteredJobs.filter(job => job.data.nivel.toLowerCase() === level.toLowerCase())
        }

        if (technology) {
            this.validateTechnology(technology)
            technology = technology.split(',').map(tech => tech.trim())
            filteredJobs = filteredJobs.filter(job => job.data.technology.some(tech => technology.includes(tech.toLowerCase())))
        }

        if (limit) {
            this.validateLimit(limit)
            limit = parseInt(limit), 0
        }

        if (offset) {
            this.validateOffset(offset)
            offset = parseInt(offset), 0
        }

        const paginatedJobs = filteredJobs.slice(offset, offset + limit)

        return paginatedJobs
    }

    static async getJobById(id) {
        const job = jobs.find(job => job.id === id)
        return job
    }

    static async createJob(jobData) {
        const newJob = {
            id: randomUUID(),
            ...jobData
        }
        jobs.push(newJob)
        return newJob
    }

    static async updateJobById(id, jobData) {

    }

    static async patchJobById(id, jobData) {

    }

    static async deleteJobById(id) {

    }

    static validateText(text) {
        if (typeof text !== 'string' || text.trim() === '') {
            throw new Error('El texto debe ser una cadena de texto no vacía.');
        }
    }

    static validateTitle(title) {
        if (typeof title !== 'string' || title.trim() === '') {
            throw new Error('El título debe ser una cadena de texto no vacía.');
        }
    }

    static validateLevel(level) {
        if (typeof level !== 'string' || level.trim() === '') {
            throw new Error('El nivel debe ser una cadena de texto no vacía.');
        }
    }

    static validateTechnology(technology) {
        if (typeof technology !== 'string' || technology.trim() === '') {
            throw new Error('La tecnología debe ser una cadena de texto no vacía.');
        }
    }

    static validateLimit(limit) {
        if (Number.isNaN(limit) || limit < 0) {
            throw new Error('El límite debe ser un número positivo.');
        }
    }

    static validateOffset(offset) {
        if (Number.isNaN(offset) || offset < 0) {
            throw new Error('El offset debe ser un número no negativo.');
        }
    }
}