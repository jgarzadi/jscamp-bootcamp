/* Pasa tu contenido de src/App.jsx aquí */
import { useEffect } from 'react'

import SearchFormSection from '../components/SearchFormSection.jsx'
import SearchResultsSection from '../components/SearchResultsSection.jsx'
import Pagination from "../components/Pagination.jsx"

import { useFetchJobs } from '../hooks/useFetchJobs.jsx'

import styles from '../components/css/Search.module.css'

export default function Search() {

  /*
  const {
    filters,
    textToFilter,
    currentPage,
    totalPages,
    pagedResults,
    jobsWithTextFilter,
    handlePageChange,
    handleSearch,
    handleTextFilter
  } = useFilters() // Lógica de filtrado en el UI
  */

  const {
    jobs,
    total,
    loading,
    totalPages,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter
  } = useFetchJobs() // Lógica de filtrado en el backend (simulada)

  useEffect(() => {
    document.title = `Resultados de búsqueda (${total}), Página ${currentPage} de ${totalPages}`
  }, [total, currentPage, totalPages])

  return (
    <>
      <main>
        <SearchFormSection onSearch={handleSearch} onTextFilter={handleTextFilter} />
        {
          loading ? (
            <div className={styles.bouncingBall}></div>
          ) : <SearchResultsSection jobs={jobs} />}
        {
          total > 0 && (<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />)
        }
      </main>
    </>
  )
}
