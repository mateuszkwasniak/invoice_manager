import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CustomPagination({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: { [key: string]: any };
}) {
  return (
    <Pagination>
      <PaginationContent>
        {pageCount > 1 && page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`/payments?page=${page - 1}&${new URLSearchParams(
                searchParams
              ).toString()}`}
            />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className="mx-1 tracking-wider">
          z {pageCount === 0 ? 1 : pageCount}
        </PaginationItem>
        {pageCount > page && (
          <PaginationItem>
            <PaginationNext
              href={`/payments?page=${page + 1}&${new URLSearchParams(
                searchParams
              ).toString()}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
