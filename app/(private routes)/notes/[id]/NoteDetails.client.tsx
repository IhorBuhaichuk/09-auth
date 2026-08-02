"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NoteDetails.module.css";

function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data: note,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong.</p>;
  }

  const createdDate = new Date(note.createdAt).toLocaleDateString("en-GB", {
    timeZone: "UTC",
  });

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{createdDate}</p>
        </div>
      </div>
    </main>
  );
}

export default NoteDetailsClient;
