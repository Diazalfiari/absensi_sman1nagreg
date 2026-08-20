import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
  showInfo = true,
  className = '',
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i += 1) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            aria-current={currentPage === i ? 'page' : undefined}
            className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-all sm:px-3 sm:py-2 sm:text-sm ${
              currentPage === i
                ? 'bg-[#29438f] text-white dark:bg-[#9eafff] dark:text-[#172654]'
                : 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(<span key={i} className="px-1 text-xs text-zinc-500 sm:px-2 sm:text-sm">...</span>);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col items-center justify-between gap-3 border-t border-zinc-800/80 px-4 py-4 sm:flex-row sm:px-6 ${className}`}>
      {showInfo && (
        <div className="order-2 text-xs text-zinc-500 sm:order-1 sm:text-sm">
          Menampilkan {startIndex + 1} - {endIndex} dari {totalItems} data
        </div>
      )}

      <div className={`order-1 flex items-center gap-1 sm:order-2 sm:gap-2 ${!showInfo ? 'mx-auto' : ''}`}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:py-2 sm:text-sm ${
            currentPage === 1
              ? 'cursor-not-allowed bg-zinc-900 text-zinc-600'
              : 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <span className="hidden sm:inline">&#8592; Sebelumnya</span>
          <span className="sm:hidden">&#8592;</span>
        </button>

        <div className="flex items-center gap-0.5 sm:gap-1">{renderPageNumbers()}</div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:py-2 sm:text-sm ${
            currentPage === totalPages
              ? 'cursor-not-allowed bg-zinc-900 text-zinc-600'
              : 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <span className="hidden sm:inline">Selanjutnya &#8594;</span>
          <span className="sm:hidden">&#8594;</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
