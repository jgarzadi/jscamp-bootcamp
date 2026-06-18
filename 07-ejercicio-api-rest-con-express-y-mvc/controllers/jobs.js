import { JobModel } from '../models/jobs.js'
import { DEFAULTS } from '../config.js'
/* Aquí debe ir la lógica de tu controlador */
export class JobController {
    static async getAllJobs(req, res) {
        try {
            const {text, title, level, technology, limit = DEFAULTS.LIMIT_PAGINATION, offset = DEFAULTS.LIMIT_OFFSET} = req.query

            const paginatedJobs = await JobModel.getAllJobs({ text, title, level, technology, limit, offset })
            console.log('paginatedJobs:', paginatedJobs)

            return res.json({ data: paginatedJobs, total: paginatedJobs.length, limit: limit, offset: offset })
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los trabajos', error: error.message });
        }
    }

    static async getJobById(req, res) {
        try {
            const { id } = req.params
            const job = await JobModel.getJobById(id)

            if (!job) {
                return res.status(404).json({ message: 'Trabajo no encontrado' })
            }

            return res.status(200).json({ data: job })

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el trabajo', error: error.message });
        }

    }

    static async createJob(req, res) {
    }

    static async updateJobById(req, res) {
    }

    static async patchJobById(req, res) {
    }

    static async deleteJobById(req, res) {
    }
}