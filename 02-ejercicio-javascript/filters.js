/* Aquí va la lógica para filtrar los resultados de búsqueda */
// Selecciona los elementos del DOM necesarios para filtrar los empleos
const filterLocation = document.querySelector('#filter-location');
const filterExperience = document.querySelector('#filter-experience-level');
const searchInput = document.querySelector('#empleos-search-input');
const filterTechnology = document.querySelector('#filter-technology');

// Función para aplicar los filtros en conjunto
function applyFilters() {
    const selectedLocation = filterLocation.value;
    const selectedExperience = filterExperience.value;
    const searchText = searchInput.value.toLowerCase();
    const selectedTechnology = filterTechnology.value;

    const jobListings = document.querySelectorAll('.job-listing-card');

    jobListings.forEach((job) => {
        const jobLocation = job.getAttribute('data-ubicacion');
        const jobMode = job.getAttribute('data-modalidad');
        const jobLevel = job.getAttribute('data-nivel');
        const jobTitle = job.querySelector('.job-listing-card h3').textContent.toLowerCase();
        const jobTechnologies = job.getAttribute('data-technology');
        const technologiesArray = jobTechnologies ? jobTechnologies.split(',') : [];

        const locationMatch = selectedLocation === '' || (jobLocation && jobLocation.toLowerCase() === selectedLocation.toLowerCase()) || (jobMode && jobMode === selectedLocation);
        const experienceMatch = selectedExperience === '' || (jobLevel && jobLevel.toLowerCase() === selectedExperience.toLowerCase());
        const searchMatch = searchText === '' || jobTitle.includes(searchText);
        const technologyMatch = selectedTechnology === '' || technologiesArray.includes(selectedTechnology);

        const isShown = locationMatch && experienceMatch && searchMatch && technologyMatch;

        job.classList.toggle('is-hidden', !isShown);
    });
}

// Agrega los event listeners para cada elemento filtros
filterLocation.addEventListener('change', applyFilters);
filterExperience.addEventListener('change', applyFilters);
filterTechnology.addEventListener('change', applyFilters);
searchInput.addEventListener('input', applyFilters);