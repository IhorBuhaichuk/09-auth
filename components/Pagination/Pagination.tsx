"use client";

import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate =
  "default" in (ReactPaginateModule as object)
    ? (
        ReactPaginateModule as unknown as ModuleWithDefault<
          ComponentType<ReactPaginateProps>
        >
      ).default
    : (ReactPaginateModule as unknown as ComponentType<ReactPaginateProps>);

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const handlePageChange: ReactPaginateProps["onPageChange"] = ({
    selected,
  }) => {
    onPageChange(selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={handlePageChange}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}

export default Pagination;
