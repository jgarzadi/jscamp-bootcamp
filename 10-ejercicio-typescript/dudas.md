<!-- Aquí puedes poner tus dudas sobre el ejercicio -->
hola Mateo, en el ejercició 4, el método filterByTechnology se queja al esperar un valor de tipo technology, no estoy seguro de cual sería la implementación correcta, si definir el parametro como technology o castearlo como lo agregué para mantener la normalización a lower case.

No estoy seguro si esto es similar a mi duda anterior, ahora en tuplas opencode (MiniMax-M3) me sugirió implementar la siguiente sintaxis para asegurar que salary es de tipo número ya que se usa posteriormente y al ser opcional puede ser también undefined, opencode me sugiere que no use cast, ya que podría resolver el compilado pero no el runtime, agradezc si me puedes ya sea confirmar o aclarar este punto:
```filter((job): job is Job & { salary: number } => job.salary !== undefined)```

**Respuesta:**
Hola! Gracias por escribir, te comento:

1. `filterByTechnology` se queja porque `toLowerCase()` siempre devuelve un string y esperamos un `Technology`. Tiene todo el sentido del mundo, porque si `job.technologies` es un array de `Technology[]`, si modificamos cada texto de formato entonces ya no serán iguales a su forma original (`Technology` != `Technology`.loLowerVase()).

Cual es el matiz aquí? Que `job.technologies` siempre está en minúscula, entonces (`Technology` === `Technology`.loLowerVase()). Esto NO siempre va a pasar, de hecho es por como hicimos la lista que dio de esta manera.
Hay tres opciones:
  a. Sacar el `toLowerCase()`, con eso la función
  b. Decir que `tech.toLowerCase() as Technology`
  ```js
  export function filterByTechnology(jobs: Job[], tech: Technology): Job[] {
    return jobs.filter((job) => job.technologies.includes(tech.toLowerCase() as Technology))
  }
  ```
  c. Cambiar el type de retorno, que ya no sea `Job[]`

Lo que realmente tuvimos que hacer es no usar `toLowerCase()`, fue error del ejercicio, así que te dejo la opción `b` que cuadra más con los types (aunque no es la más correcta).

2. MiniMax tiene toda la razón, a ver, aquí pasan dos cosas: podemos hacer types que si funcionen realmente en producción con mucha complejidad, o podemos hacer types que sean de nivel fácil-intermedio que nos ayuden en el día a día para entenderlos/mantenerlos y llevar un código llevadero, pero que tenga una pequeña cuota de desconfianza si los datos no son como realmente pensamos que sean (que con validaciones lo podemos pulir).

La alternativa que te da MiniMax es la más robusta y si evita que se pasen datos que no esperamos, porque hace una validación explicita de eso, no solo una aserción de tipos.

Una forma más básica es:

```js
import type { Job } from './objects'

export type Coordinates = [latitude: number, longitude: number]

export type SalaryRange = [min: number, max: number]

export function getSalaryRange(jobs: Job[]): SalaryRange {
  const salaries = jobs
    .filter((job) => job.salary !== undefined)
    .map((job) => job.salary as number)

  if (salaries.length === 0) {
    return [0, 0]
  }

  const min = Math.min(...salaries)
  const max = Math.max(...salaries)

  return [min, max]
}
```

Con `.filter((job) => job.salary !== undefined)` ya sabemos que no van a pasar elementos que sean `undefined`, por lo tanto van a pasar solo números.
Si pasan solo números, podemos definir que `.map((job) => job.salary as number)`.

Si entiendes y puedes replicar el caso de MiniMax en otros ejemplos, adelante! Es mejor alternativa que "confiar" en que job.salary va a ser un number.