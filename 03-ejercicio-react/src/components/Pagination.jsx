export default function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const stylePrevButton = isFirstPage ? { pointerEvents: 'none', opacity: 0.5 } : {};
    const styleNextButton = isLastPage ? { pointerEvents: 'none', opacity: 0.5 } : {};

    const handlePrevClick = () => {
        if(!isFirstPage) {
            onPageChange(currentPage - 1);
        }
    }

    const handleNextClick = () => {
        if(!isLastPage) {
            onPageChange(currentPage + 1);
        }
    }

    const handlePageChange = (page) => {
        console.log('handlePageChange', page);
        if(page !== currentPage) {
            onPageChange(page);
        }
    }

    return (
        <nav className="pagination">
            {/* Cambiamos los `anchor` por `button` para evitar que se abra una nueva pestaña cuando se hace click. No tiene sentido usar `e.preventDefault()` si lo que queremos es no navegar */}
            <button style={stylePrevButton} onClick={handlePrevClick}>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 6l-6 6l6 6" />
                </svg>
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    data-page={page}
                    className={page === currentPage ? 'is-active' : ''}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button style={styleNextButton} onClick={handleNextClick}>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 6l6 6l-6 6" />
                </svg>
            </button>
        </nav>
    )
}