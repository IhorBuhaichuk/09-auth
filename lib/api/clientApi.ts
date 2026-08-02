import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface SessionResponse {
  success: boolean;
}

interface UpdateUserData {
  username: string;
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
    });

  return response.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${noteId}`);
  return response.data;
}

export async function createNote(note: CreateNoteData): Promise<Note> {
  const response = await api.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${noteId}`);
  return response.data;
}

export async function register(credentials: AuthCredentials): Promise<User> {
  const response = await api.post<User>("/auth/register", credentials);
  return response.data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const response = await api.post<User>("/auth/login", credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<SessionResponse> {
  const response = await api.get<SessionResponse>("/auth/session");
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(data: UpdateUserData): Promise<User> {
  const response = await api.patch<User>("/users/me", data);
  return response.data;
}
