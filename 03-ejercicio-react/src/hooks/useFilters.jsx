// NOT USED IN THE APP, JUST FOR DEMO PURPOSES, USING API CALLS INSTEAD OF LOCAL DATAimport { useState } from 'react'

import jobsData from '../data.json'

const RESULTS_PER_PAGE = 5

export function useFilters() {
    
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

    return {
        filters,
        textToFilter,
        currentPage,
        totalPages,
        pagedResults,
        jobsWithTextFilter,
        handlePageChange,
        handleSearch,
        handleTextFilter
    }
}