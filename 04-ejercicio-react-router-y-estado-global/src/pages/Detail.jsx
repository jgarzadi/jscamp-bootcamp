import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "../components/Link.jsx";
import styles from "./Detail.module.css";
import snarkdown from "snarkdown";

function JobSection({ title, content }) {
  const html = snarkdown(content);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={`${styles.sectionContent} prose`}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
}

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    setLoading(true);
    setError(null);

    fetch(`https://jscamp-api.vercel.app/api/jobs/${jobId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Empleo no encontrado");
        }
        return response.json();
      })
      .then((data) => {
        setJob(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jobId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p className={styles.loadingText}>Cargando oferta...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className={styles.error}>
        <h2 className={styles.errorTitle}>Oferta no encontrada</h2>
        <p>Puede que esta oferta haya caducado o que la URL no sea correcta.</p>
        <button className={styles.errorButton} onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/search" className={styles.breadcrumbButton}>
            Empleos
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{job.titulo}</span>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>{job.titulo}</h1>
          <p className={styles.meta}>
            {job.empresa} - {job.ubicacion}
          </p>
          <button className={styles.applyButton}>Aplicar ahora</button>
        </header>

        

        <JobSection
          title="Descripción del puesto"
          content={job.content.description}
        />
        <JobSection
          title="Responsabilidades"
          content={job.content.responsibilities}
        />
        <JobSection title="Requisitos" content={job.content.requirements} />
        <JobSection title="Acerca de la empresa" content={job.content.about} />
      </div>
    </>
  );
}
