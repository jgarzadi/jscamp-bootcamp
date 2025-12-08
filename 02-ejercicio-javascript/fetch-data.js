/* Aquí va la lógica para mostrar los resultados de búsqueda */
// Selecciona el contenedor donde se mostrarán los empleos
const container = document.querySelector('.jobs-listings');

// Fetch para obtener los datos del archivo JSON y mostrarlos en el container
fetch('data.json')
    .then(response => response.json())
    .then((jobs) => {
        console.log(jobs);
        jobs.forEach((job) => {
            const listElement = document.createElement('li');
            const article = document.createElement('article');
            article.className = 'job-listing-card';
            article.dataset.modalidad = job.data.modalidad;
            article.dataset.nivel = job.data.nivel;
            article.dataset.technology = job.data.technology;
            article.dataset.ubicacion = job.ubicacion;

            article.innerHTML = `
                    <div>
                        <h3>${job.titulo}</h3>
                        <small>${job.empresa} | ${job.ubicacion}</small>
                        <p>${job.descripcion}</p>
                    </div>
                    <button class="button-apply-job">Aplicar</button>
            `;
            listElement.appendChild(article);
            container.appendChild(listElement);
        });
    })
    .catch(error => console.error('Error fetching data:', error.message));