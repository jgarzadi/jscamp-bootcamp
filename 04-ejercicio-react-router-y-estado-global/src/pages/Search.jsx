import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Pagination } from '../components/Pagination.jsx'
import { SearchFormSection } from '../components/SearchFormSection.jsx'
import { JobListings } from '../components/JobListings.jsx'

const RESULTS_PER_PAGE = 4

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState(() => {
    return {
      technology: searchParams.get('technology') || '',
      location: searchParams.get('type') || '',
      experienceLevel: searchParams.get('level') || ''
    }
  })
  const [textToFilter, setTextToFilter] = useState(() => searchParams.get('text') || '' )

  const [currentPage, setCurrentPage] = useState(() => {
    const page = Number(searchParams.get('page'))
    // Agregamos esta condición para evitar que la página sea menor a 1
    if(page < 1) return 1
    // Estaba mal implementado, si es NaN devolvemos 1, si no es NaN devolvemos el valor
    return Number.isNaN(page) ? 1 : page
  })

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)

        const params = new URLSearchParams()
        if (textToFilter) params.append('text', textToFilter)
        if (filters.technology) params.append('technology', filters.technology)
        if (filters.location) params.append('type', filters.location)
        if (filters.experienceLevel) params.append('level', filters.experienceLevel)

        const offset = (currentPage - 1) * RESULTS_PER_PAGE
        params.append('limit', RESULTS_PER_PAGE)
        params.append('offset', offset)

        const queryParams = params.toString()
      
        // Excelente! Muy bien trabajado el filtro para la API
        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${queryParams}`)
        const json = await response.json()

        setJobs(json.data)
        setTotal(json.total)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        // Bien implementado el `finally` para el setLoading
        setLoading(false)
      }
    }

    fetchJobs()
  }, [filters, currentPage, textToFilter])

  useEffect(() => {
    //Bien implementado, pero hay que tener consideración en algo...
    // Que pasa si agregamos un filtro de `technology` y luego lo quitamos?
    // El `if` solo mira si el valor existe, pero puede pasar esto: existe -> deja de existir por quitar un filtro
    // En estos casos, podemos hacer esto:
    const handleAddParamInExists = (params, key, value) => {
      value ? params.set(key, value) : params.delete(key)
    }

    setSearchParams((params) => {
      // Si existe el param lo agregamos, y si no, lo removemos.
      // NOTA: Hicimos una función para no tener que estar colocando en cada linea un `if/else` o un operador ternario. Solo es para que se vea más limpio
      handleAddParamInExists(params, 'text', textToFilter)
      handleAddParamInExists(params, 'technology', filters.technology)
      handleAddParamInExists(params, 'type', filters.location)
      handleAddParamInExists(params, 'level', filters.experienceLevel)

      if (currentPage > 1) params.set('page', currentPage)

      return params
    })

  }, [filters, currentPage, textToFilter, setSearchParams])

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearch = (filters) => {
    setFilters(filters)
    setCurrentPage(1)
  }

  const handleTextFilter = (newTextToFilter) => {
    setTextToFilter(newTextToFilter)
    setCurrentPage(1)
  }

  return {
    loading,
    jobs,
    total,
    totalPages,
    currentPage,
    textToFilter,
    handlePageChange,
    handleSearch,
    handleTextFilter
  }
}

export default function SearchPage() {
  const {
    jobs,
    total,
    loading,
    totalPages,
    currentPage,
    textToFilter,
    handlePageChange,
    handleSearch,
    handleTextFilter
  } = useFilters()

  const title = loading
    ? `Cargando... - DevJobs`
    : `Resultados: ${total}, Página ${currentPage} - DevJobs`

  return (
    <main>
      <title>{title}</title>
      <meta name="description" content="Explora miles de oportunidades laborales en el sector tecnológico. Encuentra tu próximo empleo en DevJobs." />

      <SearchFormSection
        initialText={textToFilter}
        onSearch={handleSearch}
        onTextFilter={handleTextFilter}
      />

      <section>
        <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

        {
          loading ? <p>Cargando empleos...</p> : <JobListings jobs={jobs} />
        }
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </section>
    </main>
  )
}
