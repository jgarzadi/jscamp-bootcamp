import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce.jsx'

const API_URL = 'https://jscamp-api.vercel.app/api/jobs'
const RESULTS_PER_PAGE = 10

export function useFetchJobs() {
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [jobs, setJobs] = useState([])

  const [filters, setFilters] = useState({
    technology: '',
    location: '',
    experienceLevel: ''
  })
  const [textToFilter, setTextToFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Aplicamos debounce al texto de búsqueda (espera 500ms después de que el usuario deje de escribir)
  const debouncedTextToFilter = useDebounce(textToFilter, 1000)

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)

        // to show the loading svg
        // Esto está genial para probar, pero siempre hay que evitarlo. El objetivo es tener el resultado de cara al usuario lo más rápido posible. Entiendo que haya sido para mostrar el spinner (quedó super lindo :)), pero lo dejamos comentado por esta razón, si? Felicidades!
        // await new Promise(resolve => setTimeout(resolve, 3000))

        const queryParams = new URLSearchParams()
        if (debouncedTextToFilter) queryParams.append('text', debouncedTextToFilter)
        if (filters.technology) queryParams.append('technology', filters.technology)
        if (filters.location) queryParams.append('type', filters.location)
        if (filters.experienceLevel) queryParams.append('level', filters.experienceLevel)
        
        queryParams.append('limit', RESULTS_PER_PAGE)
        const offset = (currentPage - 1) * RESULTS_PER_PAGE
        queryParams.append('offset', offset)

        // Muy bien usado!
        const response = await fetch(API_URL + '?' + queryParams.toString())
        const json = await response.json()

        setJobs(json.data)
        setTotal(json.total)

      } catch (error) {
        console.error('Error obteniendo la lista de trabajos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [filters, debouncedTextToFilter, currentPage])

  const totalPages = total > 0 ? Math.ceil(total / RESULTS_PER_PAGE) : 1

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
    jobs,
    total,
    loading,
    totalPages,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter
  }
}