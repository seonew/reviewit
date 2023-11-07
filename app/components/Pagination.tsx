import usePagination from "@/hooks/usePagination";
import { DOTTS } from "@/utils/constants";
import Link from "next/link";
import { MouseEvent } from "react";

type PaginationProps = {
  onClickPage: (page: number) => void;
  onClickPrev: () => void;
  onClickNext: () => void;
  total: number;
  limit: number;
  currentPage: number;
};

const Pagination = ({
  onClickPage,
  onClickPrev,
  onClickNext,
  total,
  limit: itemsPerPage,
  currentPage,
}: PaginationProps) => {
  const pages = usePagination(total, currentPage, itemsPerPage);
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleClickItem = (type: string) => (e: MouseEvent) => {
    e.preventDefault();

    switch (type) {
      case "prev":
        if (currentPage > 1) {
          onClickPrev();
        }
        break;
      case "next":
        if (currentPage < totalPages) {
          onClickNext();
        }
        break;
      default:
        const current = parseInt(e.currentTarget.textContent || "");
        onClickPage(current);
    }
  };

  const prevButtonRendering = (
    <a
      href="#"
      className={`rounded-l-md pagination-end ${
        currentPage === 1
          ? "cursor-default"
          : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      }`}
      onClick={handleClickItem("prev")}
    >
      <span className="sr-only">Previous</span>
      <svg
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  );

  const nextButtonRendering = (
    <a
      href="#"
      className={`rounded-r-md pagination-end ${
        currentPage === totalPages
          ? "cursor-default"
          : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      }`}
      onClick={handleClickItem("next")}
    >
      <span className="sr-only">Next</span>
      <svg
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  );

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 min-w-1024">
      <div className="flex flex-1 items-center justify-end">
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {prevButtonRendering}
            {pages.map((pageNumber, i) =>
              pageNumber === DOTTS ? (
                <span key={i} className={`pagination-default`}>
                  {pageNumber}
                </span>
              ) : (
                <Link
                  key={i}
                  href={"#"}
                  className={`${
                    pageNumber === currentPage
                      ? `pagination-current`
                      : `pagination-default`
                  }`}
                  onClick={handleClickItem(`${pageNumber}`)}
                >
                  {pageNumber}
                </Link>
              )
            )}
            {nextButtonRendering}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
