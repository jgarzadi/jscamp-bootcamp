import { useState } from 'react'

import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import SearchFormSection from './components/SearchFormSection.jsx'
import SearchResultsSection from './components/SearchResultsSection.jsx'
import Pagination from "./components/Pagination";

import jobsData from './data.json';

const RESULTS_PER_PAGE = 5;

function App() {

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = jobsData.length > 0 ? Math.ceil(jobsData.length / RESULTS_PER_PAGE) : 1;

  const pagedResults = jobsData.slice(
    (currentPage - 1) * RESULTS_PER_PAGE, 
    currentPage * RESULTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Header />
      <main>
        <SearchFormSection />
        <SearchResultsSection jobs={pagedResults} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}  />
      </main>
      <Footer />
    </>
  )
}

export default App
