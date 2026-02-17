# Aquí puedes dejar tus dudas

## Primera parte

<!-- Dudas de la primera parte del ejercicio -->

## Segunda parte

<!-- Dudas de la segunda parte del ejercicio -->

## Tercera parte

<!-- Dudas de la tercera parte del ejercicio -->

## Cuarta parte

<!-- Dudas de la cuarta parte del ejercicio -->

## Quinta parte

<!-- Dudas de la quinta parte del ejercicio -->
No logré implementar correctamente este punto, me pueden explicar cual es el beneficio de tener este debounce y como se implementa correctamente. Gracias!
- Agregar un debounce al filtro de búsqueda para que no se haga una nueva búsqueda cada vez que se escribe.

### Respuesta: ¿Qué es el debounce y cuál es su beneficio?

**Debounce** es una técnica que retrasa la ejecución de una función hasta que haya pasado un tiempo determinado sin que se vuelva a invocar.

#### Beneficios en tu búsqueda:

1. **Reduce llamadas innecesarias a la API**: Sin debounce, cada letra que escribes genera una petición HTTP. Si escribes "React Developer" (15 caracteres), harías 15 llamadas a la API. Con el debounce, solo se haría una llamada después de que el usuario deje de escribir por determinado tiempo (500ms por ejemplo).

2. **Mejora el rendimiento**: Menos peticiones = menos carga en el servidor y mejor experiencia de usuario.

3. **Ahorra recursos**: Reduces el consumo de ancho de banda y procesamiento tanto en cliente como servidor.

4. **Mejor UX**: El usuario puede terminar de escribir antes de que se ejecute la búsqueda, evitando resultados intermedios confusos o loaders.

#### Implementación correcta:

**Paso 1:** Crear el hook `useDebounce` en `src/hooks/useDebounce.jsx`:

```javascript
import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
```

**Paso 2:** Usar el hook en `useFetchJobs.jsx`:

```javascript
import { useDebounce } from './useDebounce.jsx'

export function useFetchJobs() {
  const [textToFilter, setTextToFilter] = useState('')
  
  // Aplicamos debounce al texto de búsqueda (espera 500ms después de que el usuario deje de escribir)
  const debouncedTextToFilter = useDebounce(textToFilter, 500)

  useEffect(() => {
    async function fetchJobs() {
      // ... código de fetch
      const queryParams = new URLSearchParams()
      if (debouncedTextToFilter) queryParams.append('text', debouncedTextToFilter)
      // ... resto del código
    }
    fetchJobs()
  }, [filters, debouncedTextToFilter, currentPage]) // Usar debouncedTextToFilter en las dependencias en vez de textToFilter
}
```

#### ¿Cómo funciona?

- El `textToFilter` se actualiza inmediatamente cuando el usuario escribe
- El `debouncedTextToFilter` solo se actualiza 500ms después de que el usuario **deje de escribir**
- El `useEffect` depende de `debouncedTextToFilter`, no de `textToFilter`
- Si el usuario sigue escribiendo, el timer se cancela y se crea uno nuevo

#### Ejemplo práctico:

**Sin debounce:**
- Usuario escribe: "R" → llamada API
- Usuario escribe: "e" → llamada API  
- Usuario escribe: "a" → llamada API
- Usuario escribe: "c" → llamada API
- Usuario escribe: "t" → llamada API
- **Total: 5 llamadas API** ❌

**Con debounce (500ms):**
- Usuario escribe: "React" (en menos de 500ms por tecla)
- Espera 500ms sin escribir
- → **1 sola llamada API** ✅

## Sexta parte

<!-- Dudas de la sexta parte del ejercicio -->

## Séptima parte

<!-- Dudas de la séptima parte del ejercicio -->
No me fue posible utilizar useSearchParams de react Router, será porque me falta instalar dependencias?
Tampoco logré que el custom router redirigiera a la web 404 si el path no coincide 

### Respuesta: Router personalizado y manejo de parámetros de búsqueda

#### 1. ¿Por qué no funciona `useSearchParams` de React Router?

**En este módulo no estamos usando React Router como dependencia**, sino un router personalizado que creamos en `src/hooks/useRouter.jsx`. Por eso `useSearchParams` no existe en el proyecto.

#### Podemos crear un `useSearchParams` personalizado

Crea el archivo `src/hooks/useSearchParams.jsx`:

```javascript
import { useState, useEffect } from 'react'

export function useSearchParams() {
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search))

  useEffect(() => {
    const handleLocationChange = () => {
      setSearchParams(new URLSearchParams(window.location.search))
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const updateSearchParams = (params) => {
    const newParams = new URLSearchParams(params)
    const newUrl = `${window.location.pathname}?${newParams.toString()}`
    window.history.pushState({}, '', newUrl)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return [searchParams, updateSearchParams]
}
```

**Uso:**
```javascript
const [searchParams, setSearchParams] = useSearchParams()

// Leer parámetros
const text = searchParams.get('text') || ''

// Actualizar parámetros
setSearchParams({ text: 'react', location: 'remoto' })
```

En el siguiente módulo vamos a ver como podemos usar `useSearchParams` de React Router (la dependencia), así que no te preocupes mucho por esto si?

En este punto tengo dudas de si quedó claro, así que cualquier cosa pregúntanos! Tal vez entendimos mal la pregunta

#### 2. ¿Por qué no funciona la ruta 404 (path="*")?

**El problema:** Si solo hacemos comparación exacta (`currentPath === path`), cuando usamos `path="*"` nunca coincidirá porque `currentPath` será algo como `/pagina-inexistente` y `path` será el string literal `"*"`.

**La solución:** Necesitamos llevar un registro de todas las rutas válidas que existen en la aplicación, y mostrar el 404 solo cuando la URL actual **no esté** en esa lista.

**Implementación:**

```javascript
import { useRouter } from '../hooks/useRouter.jsx'
import NotFoundPage from '../pages/404.jsx'

const USED_PATHS = new Set()

export default function Route ({ path, component: Component }) {
    const { currentPath } = useRouter()
    
    // 1. Guardamos todas las rutas válidas (excepto "*")
    if (path !== '*') {
        USED_PATHS.add(path)
    }
    
    // 2. Si la ruta coincide exactamente, mostramos el componente
    if (currentPath === path && USED_PATHS.has(path)) {
        return <Component />
    }

    // 3. Si la URL no está en las rutas válidas Y es la ruta "*", mostramos 404
    if (path === '*' && !USED_PATHS.has(currentPath)) {
        return <NotFoundPage />
    }

    // 4. Si no coincide, no mostramos nada
    return null
}
```

**¿Cómo funciona?**

1. **Primera pasada** (cuando React renderiza todos los `Route`):
   - `<Route path="/" ...>` → Agrega `"/"` a `USED_PATHS`
   - `<Route path="/search" ...>` → Agrega `"/search"` a `USED_PATHS`
   - `<Route path="*" ...>` → No agrega nada (se salta el `if`)
   - Ahora es `USED_PATHS = ["/", "/search"]`

2. **Si visitas `/`**:
   - Primera ruta: `currentPath === "/"` y `USED_PATHS.has("/")` → ✅ Renderiza `HomePage`
   - Segunda ruta: `currentPath !== "/search"` → Retorna `null`
   - Tercera ruta: `USED_PATHS.has("/")` es `true` → No muestra 404

3. **Si visitas `/pagina-que-no-existe`**:
   - Primera ruta: `currentPath !== "/"` → Retorna `null`
   - Segunda ruta: `currentPath !== "/search"` → Retorna `null`
   - Tercera ruta: `path === "*"` y `!USED_PATHS.has("/pagina-que-no-existe")` → ✅ Renderiza `NotFoundPage`

Como en el punto anterior, si hay alguna duda de la explicación nos comentas!
En el siguiente módulo con `react-router` será bastante más fácil y automático, pero es bueno entender como funciona por detrás :)

## Ejercicio extra

<!-- Dudas del ejercicio extra -->
