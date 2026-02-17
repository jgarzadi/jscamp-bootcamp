
export function useSearchForm({ idTechnology, idLocation, idExperienceLevel, idText, onSearch, onTextFilter }) {

    const handleTextChange = (e) => {
        e.stopPropagation() // Con esto evitamos que el evento del input llegue al evento del form. Si no ponemos esto, el form se enviará cuando escribamos en el input y no funcionará el debounce porque el form se enviará antes de que el debounce termine
        const textValue = e.target.value
        onTextFilter(textValue)
    }

    const handleSelectChange = (e) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const filters = {
            technology: formData.get(idTechnology),
            location: formData.get(idLocation),
            experienceLevel: formData.get(idExperienceLevel),
            text: formData.get(idText)
        }
        
        onSearch(filters)
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
        handleTextChange,
        handleSelectChange,
        handleClearFilters
    }

}
