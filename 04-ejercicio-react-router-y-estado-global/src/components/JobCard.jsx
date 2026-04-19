import { NavLink } from 'react-router'
import { useState } from 'react'
import { useFavoritesStore } from '../store/favoritesStore.js'
import { useAuthStore } from '../store/authStore.js'

function JobCardApplyButton( { jobId } ) {
  const [isApplied, setIsApplied] = useState(false)
  const { isLoggedIn } = useAuthStore()

  const handleApplyClick = () => {
    console.log('Aplicando al trabajo con ID: ' + jobId)
    setIsApplied(true)
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? 'Aplicado' : 'Aplicar'

  return (
    <button disabled={!isLoggedIn} className={buttonClasses} onClick={handleApplyClick}>
      {buttonText}
    </button>
  )
}

function JobCardFavoriteButton({ jobId }) {
  const{ isLoggedIn } = useAuthStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  return (
    <button disabled={!isLoggedIn} className="button-favorite" onClick={() => toggleFavorite(jobId)}>
      {isFavorite(jobId) ? '❤️' : '🤍'}
    </button>
  )
}

export function JobCard({ job }) {
  return (
    <article
      className="job-listing-card"
      data-modalidad={job.data.modalidad}
      data-nivel={job.data.nivel}
      data-technology={job.data.technology}
    >
      <div>
        <h3><NavLink className="job-title-link" to={`/jobs/${job.id}`}>
          {job.titulo}
        </NavLink></h3>
        <small>
          {job.empresa} | {job.ubicacion}
        </small>
        <p>{job.descripcion}</p>
      </div>
      <div className="button-container">
        <JobCardApplyButton jobId={job.id} />
        <JobCardFavoriteButton jobId={job.id} />
      </div>
    </article>
  )
}
