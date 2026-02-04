import JobListings from "./JobListings";

export default function SearchResultsSection({ jobs }) {
    return (
        <>
            <section>
                <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>
                <JobListings jobs={jobs} />
            </section>
        </>
    )
}