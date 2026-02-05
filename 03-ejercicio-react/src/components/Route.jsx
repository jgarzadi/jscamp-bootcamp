import { useRouter } from '../hooks/useRouter.jsx'
import NotFoundPage from '../pages/404.jsx'

export default function Route ({ path, component: Component }) {
    const { currentPath } = useRouter()
    if (currentPath !== path) return null
    return <Component />
}