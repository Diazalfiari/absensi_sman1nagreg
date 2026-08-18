import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 10,
  totalItems = 0,
  showInfo = true,
  className = ''
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      // Show first page, last page, current page, and pages around current
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
              currentPage === i
                ? 'bg-blue-600 text-zinc-50'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={i} className="px-1 sm:px-2 text-zinc-500 text-xs sm:text-sm">
            ...
          </span>
        );
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-zinc-800 ${className}`}>
      {showInfo && (
        <div className="text-xs sm:text-sm text-zinc-500 order-2 sm:order-1">
          Menampilkan {startIndex + 1} - {endIndex} dari {totalItems} data
        </div>
      )}
      
      <div className={`flex items-center gap-1 sm:gap-2 order-1 sm:order-2 ${!showInfo ? 'mx-auto' : ''}`}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
            currentPage === 1
              ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          <span className="hidden sm:inline">← Sebelumnya</span>
          <span className="sm:hidden">←</span>
        </button>
        
        <div className="flex items-center gap-0.5 sm:gap-1">
          {renderPageNumbers()}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
            currentPage === totalPages
              ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          <span className="hidden sm:inline">Selanjutnya →</span>
          <span className="sm:hidden">→</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
