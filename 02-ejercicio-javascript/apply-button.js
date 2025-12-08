/* Aquí va la lógica para dar funcionalidad al botón de "Aplicar" */
const jobListingContainer = document.querySelector('.jobs-listings');

jobListingContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('button-apply-job')) {
           const applyButton = event.target;
           applyButton.textContent = 'Aplicado!';
           applyButton.disabled = true;
           applyButton.classList.add('is-applied');
    }
});
