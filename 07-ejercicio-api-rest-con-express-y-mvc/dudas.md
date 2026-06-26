<!-- Aquí puedes poner tus dudas del ejercicio -->
Hola Mateo, en la implementación de CORS, no logró entender que me está faltando, probando desde la terminal usando curl, al igual usando la extensión de bruno en VS code, me dan un error.
- Error: No permitido por CORS

---

**Respuesta:**
Excelente pregunta! De hecho, cuando probé tu código también me pasó.

El problema es súper simple y tiene que ver con cómo funciona CORS por dentro.

Cuando tú haces una petición desde el navegador (por ejemplo, una página web abriendo en `http://localhost:1234`), el navegador manda solo una cabecera llamada `Origin` que dice "oye, yo vengo de aquí". Tu middleware recibe ese `Origin`, lo busca en la lista de orígenes permitidos, y si está, te deja pasar.

Pero cuando haces la prueba con `curl` o con Bruno (que son herramientas que NO son un navegador), no se manda esa cabecera `Origin`. Entonces tu middleware recibe `origin` con valor `undefined` (es decir, "nada"), y al hacer `acceptedOrigins.includes(undefined)` da `false`, porque `undefined` no está en tu lista. Por eso te tira el error "No permitido por CORS", aunque tú no estés haciendo nada raro.

**La solución** es tan simple como decirle: "si no hay `Origin`, déjalo pasar también". Eso es lo que hace este cambio:

```js
origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin) || !origin) { // <- Está aquí
        return callback(null, true)
    }
    return callback(new Error('No permitido por CORS'))
}
```
