import { NavLink } from "react-router";
import { Link } from "./Link.jsx";
import { useAuthStore } from "../store/authStore.js";
import { useFavoritesStore } from "../store/favoritesStore.js";

const HeaderUserButton = () => {
  const { isLoggedIn, login, logout } = useAuthStore()
  const { clearFavorites } = useFavoritesStore()

  const handleLogout = () => {
    logout()
    clearFavorites()
  }

  const handleLogin = () => {
    login()
  }

  return isLoggedIn ? (
    <button onClick={handleLogout}>Cerrar Sesión</button>
  ) : (
    <button onClick={handleLogin}>Iniciar Sesión</button>
  )
}

export function Header() {
  const { isLoggedIn } = useAuthStore()
  const { favoritesCount } = useFavoritesStore()
  const numberOfFavorites = favoritesCount()

  return (
    <header>
      <Link href="/" style={{ textDecoration: "none" }}>
        <h1 style={{ color: "white" }}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          DevJobs
        </h1>
      </Link>

      <nav>
        <NavLink
          className={({ isActive }) => (isActive ? "nav-link-active" : "")}
          to="/search"
        >
          Empleos
        </NavLink>
        {isLoggedIn && (
          <NavLink
            className={({ isActive }) => (isActive ? "nav-link-active" : "")}
            to="/profile"
          >
            Perfil
            (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="icon icon-tabler icons-tabler-filled icon-tabler-heart"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
            </svg>
            {numberOfFavorites})
          </NavLink>
        )}

        <a href="/search">Sin SPA</a>
      </nav>
      <HeaderUserButton />
    </header>
  );
}
