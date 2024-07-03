import React, {useEffect, useState} from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

const Pagination = ({ page, totalPages, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 656) { // Example breakpoint for mobile
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
  
    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const paginationStyle = {
    backgroundColor: '#0243cd',
  };

  const activeStyle = {
    backgroundColor: '#fff',
    color: '#0243cd',
    borderColor: '#0243cd',
  };

  const MAX_PAGES = isMobile ? 2 : 9;
  const START_PAGE = Math.max(1, page - Math.floor(MAX_PAGES / 2));
  const END_PAGE = Math.min(totalPages, START_PAGE + MAX_PAGES - 1);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= MAX_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= Math.floor(MAX_PAGES / 2)) {
        for (let i = 1; i <= MAX_PAGES; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (page > totalPages - Math.floor(MAX_PAGES / 2)) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - MAX_PAGES + 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = page - Math.floor(MAX_PAGES / 2) + 1; i <= page + Math.floor(MAX_PAGES / 2) - 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    return pages;
  }

  const handleClick = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <BootstrapPagination>
      <BootstrapPagination.First
        disabled={page === 0}
        onClick={() => handleClick(0)}
      />
      <BootstrapPagination.Prev
        disabled={page === 0}
        onClick={() => handleClick(page - 1)}
      />
      {getPageNumbers().map((pageNumber, index) => (
        <React.Fragment key={index}>
          {pageNumber === 'ellipsis' ? (
            <BootstrapPagination.Ellipsis disabled />
          ) : (
            <BootstrapPagination.Item
            
              active={pageNumber - 1 === page}
              onClick={() => handleClick(pageNumber - 1)}
            >
              {pageNumber}
            </BootstrapPagination.Item>
          )}
        </React.Fragment>
      ))}
      <BootstrapPagination.Next
        disabled={page === totalPages - 1}
        onClick={() => handleClick(page + 1)}
      />
      <BootstrapPagination.Last
        disabled={page === totalPages - 1}
        onClick={() => handleClick(totalPages - 1)}
      />
    </BootstrapPagination>
  );
};

export default Pagination;
