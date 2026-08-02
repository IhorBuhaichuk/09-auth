"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import type { MouseEvent } from "react";
import { deleteNote } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>,
    noteId: string,
  ): void => {
    event.stopPropagation();
    deleteNoteMutation.mutate(noteId);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link className={css.link} href={`/notes/${note.id}`}>
              View details
            </Link>
            <button
              className={css.button}
              type="button"
              disabled={
                deleteNoteMutation.isPending &&
                deleteNoteMutation.variables === note.id
              }
              onClick={(event) => handleDelete(event, note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
