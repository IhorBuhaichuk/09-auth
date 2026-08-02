import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface SessionResponse {
  success: boolean;
}

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> =
    await api.get<FetchNotesResponse>("/notes", {
      params: {
        page,
        perPage,
        search: search || undefined,
        tag,
      },
      headers: {
        Cookie: await getCookieHeader(),
      },
    });

  return response.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
}

export async function checkSession(): Promise<SessionResponse> {
  const response = await api.get<SessionResponse>("/auth/session", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
}
