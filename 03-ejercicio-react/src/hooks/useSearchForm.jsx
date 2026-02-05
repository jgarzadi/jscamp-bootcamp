
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

    return {
        handleFilterJobs
    }

}
