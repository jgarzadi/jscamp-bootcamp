import { useState, useEffect, use } from 'react'

import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import SearchFormSection from './components/SearchFormSection.jsx'
import SearchResultsSection from './components/SearchResultsSection.jsx'
import Pagination from "./components/Pagination.jsx"

import jobsData from './data.json'

const RESULTS_PER_PAGE = 5

function App() {
  const [filters, setFilters] = useState({
    technology: '',
    location: '',
    experienceLevel: ''
  })
  const [textToFilter, setTextToFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const jobFilterByFilters = jobsData.filter(job => {
    return (
      (filters.technology === '' || job.data.technology.toLowerCase().includes(filters.technology.toLowerCase())) &&
      (filters.location === '' || job.data.modalidad.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.experienceLevel === '' || job.data.nivel.toLowerCase().includes(filters.experienceLevel.toLowerCase()))
    )
  })

  const jobsWithTextFilter = textToFilter === ''
    ? jobFilterByFilters
    : jobFilterByFilters.filter(job => {
      const text = textToFilter.toLowerCase().trim()
      return (
        job.titulo.toLowerCase().includes(text)
      )
    })

  const pagedResults = jobsWithTextFilter.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  )

  const totalPages = jobsWithTextFilter.length > 0 ? Math.ceil(jobsWithTextFilter.length / RESULTS_PER_PAGE) : 1

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

  return (
    <>
      <Header />
      <main>
        <SearchFormSection onSearch={handleSearch} onTextFilter={handleTextFilter} />
        <SearchResultsSection jobs={pagedResults} />
        {jobsWithTextFilter.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </main>
      <Footer />
    </>
  )
}

export default App
