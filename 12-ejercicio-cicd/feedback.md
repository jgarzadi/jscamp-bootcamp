<!-- Aquí irá tu feedback -->
Hola! Muy buen trabajo!
Hicimos algunos cambios en las actions y te dejamos la respuesta de tus dudas en el archivo `dudas.md`.

Algunas cosas que hicimos fue:
- En `04-events.yml` pasamos los datos del evento a variables de entorno, para evitar romper el shell.
- En `05-ci.yml` habían dos jobs que apuntaban al Linting, modificamos eso y ejecutamos el build de frontend y backend.
- En la composite action `setup-pnpm-ci-cd` agregamos `pnpm install --frozen-lockfile` y generamos el `pnpm-lock.yaml` para que las instalaciones sean reproducibles.

Si te quedó alguna duda, nos puedes escribir y te ayudamos si?
A seguir trabajando!