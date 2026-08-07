import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getAllNotesPaths,
  notes,
  resolveNotesPath,
} from "@/lib/notes"
import { NotesBrowser } from "@/components/notes/notes-browser"
import { NoteDetail } from "@/components/notes/note-detail"

type PageProps = {
  params: Promise<{ path?: string[] }>
}

export function generateStaticParams() {
  return getAllNotesPaths().map((path) => ({ path }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { path } = await params
  const resolved = resolveNotesPath(path ?? [])

  if (!resolved) {
    return { title: "Notes", robots: { index: false, follow: false } }
  }

  if (resolved.kind === "file") {
    return {
      title: resolved.note.title,
      description: resolved.note.description,
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    }
  }

  const name = resolved.folder?.name ?? notes.headline
  return {
    title: name,
    description: notes.subheadline,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  }
}

export default async function NotesPathPage({ params }: PageProps) {
  const { path } = await params
  const pathIds = path ?? []
  const resolved = resolveNotesPath(pathIds)

  if (!resolved) notFound()

  if (resolved.kind === "file") {
    return (
      <NoteDetail note={resolved.note} breadcrumbs={resolved.breadcrumbs} />
    )
  }

  return (
    <NotesBrowser
      pathIds={resolved.pathIds}
      breadcrumbs={resolved.breadcrumbs}
      entries={resolved.children}
      folderName={resolved.folder?.name ?? null}
    />
  )
}
