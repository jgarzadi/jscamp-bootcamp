/* En este ejercicio deberás tipar las tuplas con los tipos ya creados, y usando `number` para la tupla de `SalaryRange` y `Coordinates` */
import type { Job } from './objects.ts'

// Tupla para coordenadas de ubicación
export type Coordinates = [latitude: number, longitude: number] // [latitud, longitud]

// Podemos dar un poco más de detalle en las tuplas definiendo el nombre de la posición a la que refiere la tupla (min, max, latitude, longitude)

// Tupla para rango de salario
export type SalaryRange = [min: number, max: number] // [mínimo, máximo]

// Función que devuelve el rango de salarios
export function getSalaryRange(jobs: Job[]): SalaryRange {
  const salaries = jobs
  .filter((job): job is Job & { salary: number } => job.salary !== undefined)
  .map((job) => job.salary)
  // .filter((job) => job.salary !== undefined)
  // .map((job) => job.salary) // <- Como ya sabemos que job.salary es number o undefined, y evaluamos que tiene que ser distinto de undefined, entonces la única alternativa que nos queda es `number`

  if (salaries.length === 0) {
    return [0, 0]
  }

  const min = Math.min(...salaries)
  const max = Math.max(...salaries)

  return [min, max]
}
