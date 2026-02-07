
export function useSearchForm({ idTechnology, idLocation, idExperienceLevel, idText, onSearch, onTextFilter, textValueFromURL }) {

    const handleFilterJobs = (e) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const filters = {
            technology: formData.get(idTechnology),
            location: formData.get(idLocation),
            experienceLevel: formData.get(idExperienceLevel),
            text: formData.get(idText)
        }
        
        onSearch(filters)
        onTextFilter(filters.text)
    }

    const handleClearFilters = (e) => {
        console.log(e.target.closest('form'))
        e.preventDefault()
        e.target.closest('form').reset()

        const emptyFilters = {
            technology: '',
            location: '',
            experienceLevel: '',
            text: ''
        }
        
        onSearch(emptyFilters)
        onTextFilter('')
    }

    return {
        handleFilterJobs,
        handleClearFilters
    }

}
