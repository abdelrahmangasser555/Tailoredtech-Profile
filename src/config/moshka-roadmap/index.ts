import { moshkaTree } from "@/config/moshka-roadmap/tree"
import { moshkaStartNotes } from "@/config/moshka-roadmap/notes/start"
import { moshkaCafeNotes } from "@/config/moshka-roadmap/notes/p01-cafe"
import { moshkaHarborNotes } from "@/config/moshka-roadmap/notes/p02-harbor"
import { moshkaScoreNotes } from "@/config/moshka-roadmap/notes/p03-score"
import { moshkaGitNotes } from "@/config/moshka-roadmap/notes/p-git"
import { moshkaPortNotes } from "@/config/moshka-roadmap/notes/p04-port"
import { moshkaReactNotes } from "@/config/moshka-roadmap/notes/p-react-vite"
import { moshkaUxNotes } from "@/config/moshka-roadmap/notes/p05-ux"
import { moshkaApiNotes } from "@/config/moshka-roadmap/notes/p06-api"
import { moshkaAuthNotes } from "@/config/moshka-roadmap/notes/p07-auth"
import { moshkaNextNotes } from "@/config/moshka-roadmap/notes/p08-next"
import { moshkaCursorNotes } from "@/config/moshka-roadmap/notes/p09-cursor"
import { moshkaAiNotes } from "@/config/moshka-roadmap/notes/p10-ai"
import { moshkaTestNotes } from "@/config/moshka-roadmap/notes/p11-test"
import { moshkaOpsNotes } from "@/config/moshka-roadmap/notes/p12-ops"
import { moshkaBbsNotes } from "@/config/moshka-roadmap/notes/p13-bbs"
import { moshkaAgencyNotes } from "@/config/moshka-roadmap/notes/p14-agency"
import { moshkaRepoNotes } from "@/config/moshka-roadmap/notes/p15-repo"
import { moshkaSqlNotes } from "@/config/moshka-roadmap/notes/p16-sql"
import { moshkaSbNotes } from "@/config/moshka-roadmap/notes/p17-supabase"
import type { NoteDocument } from "@/lib/notes-types"

export { moshkaTree }

export const moshkaRoadmapNotes: Record<string, NoteDocument> = {
  ...moshkaStartNotes,
  ...moshkaCafeNotes,
  ...moshkaHarborNotes,
  ...moshkaScoreNotes,
  ...moshkaGitNotes,
  ...moshkaPortNotes,
  ...moshkaReactNotes,
  ...moshkaUxNotes,
  ...moshkaApiNotes,
  ...moshkaAuthNotes,
  ...moshkaNextNotes,
  ...moshkaCursorNotes,
  ...moshkaAiNotes,
  ...moshkaTestNotes,
  ...moshkaOpsNotes,
  ...moshkaBbsNotes,
  ...moshkaAgencyNotes,
  ...moshkaRepoNotes,
  ...moshkaSqlNotes,
  ...moshkaSbNotes,
}
