import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import {
  findNodePath,
  getNoteById,
  listMentionItems,
  notes,
  resolveChatScopeRootId,
  resolveNotesPath,
} from "@/lib/notes"
import { NotesBrowser } from "@/components/notes/notes-browser"
import { NoteDetail } from "@/components/notes/note-detail"

type PageProps = {
  params: Promise<{ path?: string[] }>
}

/** Always resolve from live config — avoids flaky static 404s during HMR / edits */
export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { path } = await params
  const pathIds = path ?? []
  const resolved = resolveNotesPath(pathIds)

  if (!resolved) {
    return { title: "Note not found", robots: { index: false, follow: false } }
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
  const pathIds = (path ?? []).filter(Boolean)
  let resolved = resolveNotesPath(pathIds)

  // Recover stale / partial paths: if the last segment is a known note or folder,
  // redirect to its real location instead of a bare 404.
  if (!resolved && pathIds.length > 0) {
    const last = pathIds[pathIds.length - 1]!
    const realPath = findNodePath(last)
    if (realPath && realPath.join("/") !== pathIds.join("/")) {
      redirect(`/notes/${realPath.join("/")}`)
    }
    // Tree ref exists but document missing / disabled
    if (getNoteById(last)) {
      const again = findNodePath(last)
      if (again) redirect(`/notes/${again.join("/")}`)
    }
  }

  resolved = resolveNotesPath(pathIds)
  if (!resolved) notFound()

  if (resolved.kind === "file") {
    const scopeRootId = resolveChatScopeRootId(
      resolved.note,
      resolved.pathIds
    )
    const mentionItems = listMentionItems(scopeRootId)

    return (
      <NoteDetail
        note={resolved.note}
        breadcrumbs={resolved.breadcrumbs}
        pathIds={resolved.pathIds}
        mentionItems={mentionItems}
      />
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
