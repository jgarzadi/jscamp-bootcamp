/* Aquí deberás usar los tipos creados en los ejercicios anteriores para definir los tipos de los parámetros y el valor de retorno de las funciones */
import type { Job } from './objects.ts'
import type { ExperienceLevel, Technology } from './types.ts'

export function filterByExperience(jobs: Job[], level: ExperienceLevel): Job[] {
  return jobs.filter((job) => job.experienceLevel === level)
}

// Función para filtrar por tecnología
export function filterByTechnology(jobs: Job[], tech: Technology): Job[] {
  return jobs.filter((job) => job.technologies.includes(tech.toLowerCase() as Technology)) // <- Esta es la mejor solución de cara al código. Queremos si o si que `filterByTechnology` reciba como segundo parámetro una tecnología (no un string), esto además nos va a ayudar con el autocompletado en la función. Y `toLowerCase()` por defecto devuelve `string`. Como tenemos control de la aplicación y sabemos que tech va a ser siempre una `Technology`, entonces podemos asumir que `.toLowerCase()` es una Technology.
  // En este caso podemos hacer esto porque todas las `Technology` son en minúscula, el `toLowerCase` es redundante.
}

// Función para filtrar por salario mínimo
export function filterByMinSalary(jobs: Job[], minSalary: number): Job[] {
  return jobs.filter((job) => job.salary !== undefined && job.salary >= minSalary)
}

// Función para buscar por texto
export function searchJobs(jobs: Job[], searchTerm: string): Job[] {
  const term = searchTerm.toLowerCase()
  return jobs.filter(
    (job) => job.title.toLowerCase().includes(term) || job.description.toLowerCase().includes(term)
  )
}
