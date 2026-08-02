"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NotePreview.module.css";

function NotePreviewClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
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

  const closeModal = (): void => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={closeModal}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={closeModal}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  const createdDate = new Date(note.createdAt).toLocaleDateString("en-GB", {
    timeZone: "UTC",
  });

  return (
    <Modal onClose={closeModal}>
      <div className={css.container}>
        <button className={css.backBtn} type="button" onClick={closeModal}>
          Go back
        </button>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{createdDate}</p>
        </div>
      </div>
    </Modal>
  );
}

export default NotePreviewClient;
