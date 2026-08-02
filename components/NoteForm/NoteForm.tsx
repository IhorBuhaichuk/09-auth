"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { createNote, type CreateNoteData } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

const NOTE_TAGS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
  });

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDraft({ title: event.target.value });
  };

  const handleContentChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setDraft({ content: event.target.value });
  };

  const handleTagChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setDraft({ tag: event.target.value as NoteTag });
  };

  const formAction = (formData: FormData): void => {
    const note: CreateNoteData = {
      title: String(formData.get("title")),
      content: String(formData.get("content")),
      tag: formData.get("tag") as NoteTag,
    };

    createNoteMutation.mutate(note);
  };

  const handleCancel = (): void => {
    router.back();
  };

  return (
    <form className={css.form} action={formAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          minLength={3}
          maxLength={50}
          required
          defaultValue={draft.title}
          onChange={handleTitleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          defaultValue={draft.content}
          onChange={handleContentChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          key={draft.tag}
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleTagChange}
        >
          {NOTE_TAGS.map((tag) => (
            <option value={tag} key={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          Create note
        </button>
      </div>

      {createNoteMutation.isError && (
        <span className={css.error}>Failed to create note.</span>
      )}
    </form>
  );
}

export default NoteForm;
