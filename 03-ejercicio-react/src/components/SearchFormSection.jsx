
import { useEffect, useId } from 'react'
import { useSearchForm } from '../hooks/useSearchForm.jsx'
import styles from './css/SearchFormSection.module.css'


export default function SearchFormSection({ onSearch, onTextFilter }) {

    const idText = useId()
    const idTechnology = useId()
    const idLocation = useId()
    const idExperienceLevel = useId()

    const {
        handleTextChange,
        handleSelectChange,
        handleClearFilters
    } = useSearchForm({
        idTechnology,
        idLocation,
        idExperienceLevel,
        idText,
        onSearch,
        onTextFilter
    })

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const textValueFromURL = urlParams.get('text') || ''
        onTextFilter(textValueFromURL)
    }, [])

    return (
        <>
            <section className="jobs-search">
                <h1>Encuentra tu próximo trabajo</h1>
                <p>Explora miles de oportunidades en el sector tecnológico.</p>

                <form id="empleos-search-form" role="search" onChange={handleSelectChange}>
                    <div className="search-bar">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                            <path d="M21 21l-6 -6" />
                        </svg>

                        <input
                            id="empleos-search-input"
                            type="text"
                            name={idText}
                            placeholder="Buscar trabajos, empresas o habilidades"
                            onChange={handleTextChange}
                        />
                    </div>

                    <div className="search-filters">
                        <select name={idTechnology} id="filter-technology">
                            <option value="">Tecnología</option>
                            <optgroup label="Tecnologías populares">
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="react">React</option>
                                <option value="nodejs">Node.js</option>
                            </optgroup>
                            <option value="java">Java</option>
                            <hr />
                            <option value="csharp">C#</option>
                            <option value="c">C</option>
                            <option value="c++">C++</option>
                            <hr />
                            <option value="ruby">Ruby</option>
                            <option value="php">PHP</option>
                        </select>

                        <select name={idLocation} id="filter-location">
                            <option value="">Ubicación</option>
                            <option value="remoto">Remoto</option>
                            <option value="cdmx">Ciudad de México</option>
                            <option value="guadalajara">Guadalajara</option>
                            <option value="monterrey">Monterrey</option>
                            <option value="barcelona">Barcelona</option>
                        </select>

                        <select name={idExperienceLevel} id="filter-experience-level">
                            <option value="">Nivel de experiencia</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid-level</option>
                            <option value="senior">Senior</option>
                            <option value="lead">Lead</option>
                        </select>
                        <button type="button" className={styles.clearButton} onClick={handleClearFilters}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="icon icon-tabler icons-tabler-outline icon-tabler-filter-off">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M8 4h12v2.172a2 2 0 0 1 -.586 1.414l-3.914 3.914m-.5 3.5v4l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227" />
                                <path d="M3 3l18 18" />
                            </svg>
                        </button>
                    </div>
                </form>

                <span id="filter-selected-value"></span>
            </section>
        </>
    )
}