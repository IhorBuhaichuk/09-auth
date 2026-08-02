import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

export const dynamic = "force-dynamic";

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug[0] === "all" ? "All" : slug[0];
  const title = `${filter} notes | NoteHub`;
  const description = `Browse ${filter.toLowerCase()} notes in NoteHub.`;
  const filterPath = slug[0] === "all" ? "all" : slug[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${filterPath}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub application",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : (slug[0] as NoteTag);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag ?? "all"} tag={tag} />
    </HydrationBoundary>
  );
}
