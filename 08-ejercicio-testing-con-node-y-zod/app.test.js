/*
 * Aquí debes escribir tus tests para la API de jobs
 *
 * Recuerda:
 * - Usar node:test y node:assert (sin dependencias externas)
 * - Levantar el servidor con before() y cerrarlo con after()
 * - Testear todos los endpoints: GET, POST, PUT, PATCH, DELETE
 * - Verificar validaciones con Zod
 * - Comprobar códigos de estado HTTP correctos
 */

import assert from 'node:assert'
import { after, before, describe, test } from 'node:test'
import app from './app.js'

let server
const PORT = 3456
const BASE_URL = `http://localhost:${PORT}`

before(async () => {
    return new Promise((resolve, reject) => {
        server = app.listen(PORT, () => resolve())
        server.on('error', reject)
    })
})

after(async () => {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) reject(err)
            else resolve()
        })
    })
})

describe('Get /jobs', () => {
    test('Debe responder con un 200 y un arreglo de trabajos', async () => {
        const response = await fetch(`${BASE_URL}/jobs`)
        assert.strictEqual(response.status, 200)

        const json = await response.json()
        assert.ok(Array.isArray(json.data), 'Se esperaba que la propiedad data fuera un arreglo')
    }),

    test('Debe filtrar trabajos por tecnología', async () => {
        const tech = 'react'
        const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`)
        assert.strictEqual(response.status, 200)

        const json = await response.json()
        assert.ok(json.data.every(job => job.data.technology.includes(tech)), `Se esperaba que todos los trabajos contuvieran la tecnología ${tech}`)
    }),

    test('Debe respetar el limite de resultados', async () => {
        const limit = 2
        const response = await fetch(`${BASE_URL}/jobs?limit=${limit}`)
        assert.strictEqual(response.status, 200)

        const json = await response.json()
        assert.strictEqual(json.data.length, limit)
        assert.strictEqual(json.limit, limit)
    }),

    test('Debe aplicar offset correctamente', async () => {
        const offset = 4 // <- Cambiamos a 4 para que se pueda ver que realmente funciona el test con los nuevos cambios
        const response = await fetch(`${BASE_URL}/jobs?offset=${offset}`)
        assert.strictEqual(response.status, 200)

        const json = await response.json()
        assert.ok(json.data.length > 0, 'No se recibieron resultados después de aplicar offset')
        /* assert.strictEqual(json.data[0].id, 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57') */

        /* El test está genial! Una cosa que podríamos hacer para llevar esto a un siguiente nivel es usar datos reales y no hardcodeados */

        /* 1. Obtenemos la lista de todos los jobs */
        const allJobsRes = await fetch(`${BASE_URL}/jobs`)
        const allJobs = await allJobsRes.json()

        /* 2. Seleccionamos el job de la posición offset */
        const selectedJobIdFromAllJobs = allJobs.data[offset].id

        /* 3. Verificamos que el primer resultado con el offset sea igual al que seleccionamos de la lista completa */
        assert.strictEqual(json.data[0].id, selectedJobIdFromAllJobs)
    })

})

describe('POST /jobs', () => {
    test('El nuevo trabajo se añade correctamente con buen formato', async () => {
        const newJob = {
            titulo: 'Backend Developer',
            empresa: 'Tech Company',
            ubicacion: 'Remoto',
            descripcion: 'Desarrollador backend con experiencia en Node.js',
            data: {
                technology: ['Node.js', 'Express', 'MongoDB'],
                modalidad: 'Remoto',
                nivel: 'Senior'
            }
        }

        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newJob)
        })

        assert.strictEqual(response.status, 201, `Se esperaba un status 201, pero se recibió ${response.status}`)

        const json = await response.json()
        assert.ok(json.id, 'El objeto de respuesta no contiene un id generado')

        const {id, ...rest} = json
        assert.deepStrictEqual(rest, newJob, 'El trabajo enviado no coincide con el trabajo creado')
    }),

    test('Debe devolver 400 si titulo tiene menos de 3 caracteres', async () => {
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: 'Ba',
                empresa: 'Tech Company',
                ubicacion: 'Remoto',
                descripcion: 'Desarrollador backend con experiencia en Node.js',
                data: {
                    technology: ['Node.js', 'Express', 'MongoDB'],
                    modalidad: 'Remoto',
                    nivel: 'Senior'
                }
            })
        })
        assert.strictEqual(response.status, 400)
    }),

    test('Debe devolver 400 si titulo tiene mas de 100 caracteres', async () => {
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: 'Titulo con mas de cien caracteres para testing, el titulo debe contener menos de cien caracteres para validar el schema correctamente',
                empresa: 'Tech Company',
                ubicacion: 'Remoto',
                descripcion: 'Desarrollador backend con experiencia en Node.js',
                data: {
                    technology: ['Node.js', 'Express', 'MongoDB'],
                    modalidad: 'Remoto',
                    nivel: 'Senior'
                }
            })
        })
        assert.strictEqual(response.status, 400)
    }),

    test('Debe devolver 400 si falta el campo titulo', async () => {
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                empresa: 'Tech Company',
                ubicacion: 'Remoto'
            })
        })
        assert.strictEqual(response.status, 400)
    }),

    test('Debe devolver 400 si titulo no es string', async () => {
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: 12345,
                empresa: 'Tech Company',
                ubicacion: 'Remoto'
            })
        })
        assert.strictEqual(response.status, 400)
    }),

    test('Debe devolver 201 si falta descripcion (es opcional)', async () => {
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: 'Backend Developer',
                empresa: 'Tech Company',
                ubicacion: 'Remoto'
            })
        })
        assert.strictEqual(response.status, 201)
    })
})

describe('GET /jobs/:id', () => {
    test('Debe devolver el trabajo con el ID especificado', async () => {
        /* Aquí podemos hacer algo distinto, podemos obtener todos los jobs, obtener uno random y hacer la petición de ese */
        /* Lo que está hecho no está mal, es para que tengas una alternativa distinta y dinámica */

        /* 1. Obtenemos todos los jobs */
        const allJobsRes = await fetch(`${BASE_URL}/jobs`)
        const allJobsJson = await allJobsRes.json()
        const allJobs = allJobsJson.data

        /* 2. Seleccionamos uno de manera aleatoria */
        const randomJobId = allJobs[Math.floor(Math.random() * allJobs.length)].id

        /* 3. Hacemos la validación consultando por su ID */
        const jobByIdRes = await fetch(`${BASE_URL}/jobs/${randomJobId}`)
        assert.strictEqual(jobByIdRes.status, 200)

        const jobById = await jobByIdRes.json()
        assert.strictEqual(jobById.id, randomJobId)


        /* Test anterior */
        const id = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'
        const response = await fetch(`${BASE_URL}/jobs/${id}`)
        assert.strictEqual(response.status, 200)

        const json = await response.json()
        assert.strictEqual(json.id, id)
    }),

    test('Debe devolver 404 cuando el ID no existe', async () => {
        const response = await fetch(`${BASE_URL}/jobs/id-inexistente`)
        assert.strictEqual(response.status, 404)

        const json = await response.json()
        assert.ok(json.error, 'La respuesta deberia contener un campo error')
    })
})

describe('PUT /jobs/:id', () => {
    test('Debe recibir 204 y actualizar el trabajo', async () => {
        const id = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'
        const updatedJob = {
            titulo: 'Analista de Datos Actualizado',
            empresa: 'Data Driven Co.',
            ubicacion: 'Guadalajara',
            descripcion: 'Descripcion actualizada',
            data: {
                technology: ['python', 'sql'],
                modalidad: 'hibrido',
                nivel: 'mid-level'
            }
        }

        const putResponse = await fetch(`${BASE_URL}/jobs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedJob)
        })
        assert.strictEqual(putResponse.status, 204)

        const getResponse = await fetch(`${BASE_URL}/jobs/${id}`)
        assert.strictEqual(getResponse.status, 200)
        const job = await getResponse.json()
        assert.strictEqual(job.titulo, updatedJob.titulo)
        assert.strictEqual(job.ubicacion, updatedJob.ubicacion)
    }),

    test('Debe devolver 404 cuando el ID no existe', async () => {
        const response = await fetch(`${BASE_URL}/jobs/id-inexistente`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: 'Test',
                empresa: 'Test',
                ubicacion: 'Test'
            })
        })
        assert.strictEqual(response.status, 404)
    })
})

describe('PATCH /jobs/:id', () => {
    test('Debe recibir 204 y actualizar solo los campos enviados', async () => {
        const id = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'
        const partialUpdate = {
            titulo: 'DevOps Engineer Senior',
            ubicacion: 'Monterrey'
        }

        const getBefore = await fetch(`${BASE_URL}/jobs/${id}`)
        const beforeJob = await getBefore.json()

        const patchResponse = await fetch(`${BASE_URL}/jobs/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partialUpdate)
        })
        assert.strictEqual(patchResponse.status, 204)

        const getAfter = await fetch(`${BASE_URL}/jobs/${id}`)
        const afterJob = await getAfter.json()
        assert.strictEqual(afterJob.titulo, partialUpdate.titulo)
        assert.strictEqual(afterJob.ubicacion, partialUpdate.ubicacion)
        assert.strictEqual(afterJob.empresa, beforeJob.empresa)
    }),

    test('Debe devolver 404 cuando el ID no existe', async () => {
        const response = await fetch(`${BASE_URL}/jobs/id-inexistente`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: 'Test' })
        })
        assert.strictEqual(response.status, 404)
    })
})

describe('DELETE /jobs/:id', () => {
    test('Debe recibir 204 y eliminar el trabajo', async () => {
        /* Una cosa que podemos hacer aquí es comprobar antes de eliminar que existe */
        const id = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'
        const deleteResponse = await fetch(`${BASE_URL}/jobs/${id}`, {
            method: 'DELETE'
        })
        assert.strictEqual(deleteResponse.status, 204)

        const getResponse = await fetch(`${BASE_URL}/jobs/${id}`)
        assert.strictEqual(getResponse.status, 404)
    }),

    test('Debe devolver 404 cuando el ID no existe', async () => {
        const response = await fetch(`${BASE_URL}/jobs/id-inexistente`, {
            method: 'DELETE'
        })
        assert.strictEqual(response.status, 404)
    })
})
