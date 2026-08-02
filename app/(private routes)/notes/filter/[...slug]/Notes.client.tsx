"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api/clientApi";
import type { NoteTag } from "@/types/note";
import css from "./NotesPage.module.css";

const PER_PAGE = 12;

interface NotesClientProps {
  tag?: NoteTag;
}

function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search, tag }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const debouncedSearch = useDebouncedCallback((value: string): void => {
    setSearch(value.trim());
    setPage(1);
  }, 500);

  const handleSearch = (value: string): void => {
    debouncedSearch(value);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Something went wrong.</p>}
      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}
      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}
      {isFetching && !isLoading && <p>Updating...</p>}
    </main>
  );
}

export default NotesClient;
