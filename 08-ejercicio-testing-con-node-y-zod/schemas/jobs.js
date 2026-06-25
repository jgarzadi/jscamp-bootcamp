/*
 * Aquí debes crear el schema de validación con Zod para los jobs
 *
 * Recuerda:
 * - Importar zod
 * - Crear un schema que valide la estructura de un job
 * - Exportar funciones validateJob() y validatePartialJob()
 * - Usar safeParse() para validar sin lanzar excepciones
 * - Definir reglas de validación (min, max, required, optional, etc.)
 */

import { z } from "zod";

export const jobSchema = z.object({
    titulo: z
        .string()
        .min(3, { message: "El título debe tener al menos 3 caracteres" })
        .max(100, { message: "El título no puede tener más de 100 caracteres" }),
    empresa: z
        .string(),
    ubicacion: z
        .string(),
    descripcion: z
        .string()
        .optional(),
    content: z.object({
        description: z.string().optional(),
        responsibilities: z.string().optional(),
        requirements: z.string().optional(),
        about: z.string().optional(),
    }).optional(),
    data: z.object({
        technology: z.array(z.string()).optional(),
        modalidad: z.string().optional(),
        nivel: z.string().optional(),
    }).optional()
})

export const validateJob = (job) => {
    return jobSchema.safeParse(job)
}

export const validatePartialJob = (job) => {
    return jobSchema.partial().safeParse(job)
}