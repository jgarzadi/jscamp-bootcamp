import { useRouter } from "../hooks/useRouter"

export default function Link({ href, children, ...props }) {
    const { navigateTo } = useRouter()
    
    const handleClick = (e) => {
        e.preventDefault()
        navigateTo(href)
    }

    return (
        <a href={href} onClick={handleClick} {...props}>
            {children}
        </a>
    )
}