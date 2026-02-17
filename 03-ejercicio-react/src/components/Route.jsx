import { useRouter } from '../hooks/useRouter.jsx'
import NotFoundPage from '../pages/404.jsx'

const USED_PATHS = new Set()

export default function Route ({ path, component: Component }) {
    const { currentPath } = useRouter()
    
    // 1. Si el path no es `*`, lo guardamos en la lista de las rutas que se pasan como prop `path` al componente Route
    // a. Se guarda ["/"]
    // b. Luego se guarda ["/", "/search"]
    // c. Cuando llega `*` no se guarda
    // Con esto tenemos todas las rutas validas que existen
    if (path !== '*') {
        USED_PATHS.add(path)
    }
    
    // 2. Si la ruta coincide con el path que tenemos en la URL y además lo tenemos en la lista de rutas permitidas, mostramos la página
    if(currentPath === path && USED_PATHS.has(path)) {
        return <Component />
    }

    // 3. Si la página que el usuario tiene por URL no está dentro de las rutas permitidas, y además es la ruta comodín `*`, mostramos la página 404
    if(path === '*' && !USED_PATHS.has(currentPath)) {
        return <NotFoundPage />
    }

    // 4. Si no coincide con ninguna de las condiciones anteriores, no mostramos nada
    return null
}