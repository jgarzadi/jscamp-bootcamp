<!-- Escribe aquí tus dudas -->
hola Mateo, tuve algunos problemas
- No me fue posible usar cache 
- pnpm install --frozen-lockfile falla explicando que pnpm-lock.yaml no existe
- parece que esta instruccion se queda colgada en la acción de github pnpm start:backend, es normal este comportamiento?

**Respuesta:**

Hola! Bien, no hay problema, te comento:

Seguramente por los errores dejaste el código comentado, lo que hicimos ahora fue des comentar el código y apuntar a `12-ejercicio-cicd/pnpm-lock.yaml`. Este archivo no existía así que probablemente sea por eso que no funcionaba.

Por otro lado, `pnpm install --frozen-lockfile` también fallaba porque no existía el archivo `pnpm-lock.yaml`. Ya existe.

Y para `pnpm start:backend` tiene un comportamiento normal. El servidor queda ejecutándose para atender peticiones y no termina solo.

Vamos a probar ahora los cambios a ver si funciona, si? Ahí veremos las actions en acción, si hay algún error, volveremos a iterar y te comentaremos qué pasó :)

Me gustaron las preguntas!