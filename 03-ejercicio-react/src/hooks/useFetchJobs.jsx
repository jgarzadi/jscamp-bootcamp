import { useState, useEffect } from 'react'

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

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)

        // to show the loading svg
        await new Promise(resolve => setTimeout(resolve, 3000))

        const queryParams = new URLSearchParams()
        if (textToFilter) queryParams.append('text', textToFilter)
        if (filters.technology) queryParams.append('technology', filters.technology)
        if (filters.location) queryParams.append('type', filters.location)
        if (filters.experienceLevel) queryParams.append('level', filters.experienceLevel)
        
        queryParams.append('limit', RESULTS_PER_PAGE)
        const offset = (currentPage - 1) * RESULTS_PER_PAGE
        queryParams.append('offset', offset)

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
  }, [filters, textToFilter, currentPage])

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