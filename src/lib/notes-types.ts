/**
 * Notes module — JSON-driven nested folders + rich documents.
 * A note is one customizable document; the tree is the filesystem.
 */

export type NotesTreeNode =
  | NotesFolderNode
  | NotesFileRef

export type NotesFolderNode = {
  type: "folder"
  id: string
  name: string
  createdAt: string
  updatedAt: string
  children: NotesTreeNode[]
}

/** Reference in the tree — full content lives in `notes` map by id */
export type NotesFileRef = {
  type: "file"
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type NoteExplainTerm = {
  id: string
  label: string
  title: string
  body: string
}

export type NoteQuestionnaireOption = {
  id: string
  label: string
  correct?: boolean
}

export type NoteQuestionnaireQuestion = {
  id: string
  prompt: string
  options: NoteQuestionnaireOption[]
  explanation?: string
}

export type NoteQuestionnairePage = {
  id: string
  title?: string
  questions: NoteQuestionnaireQuestion[]
}

export type NoteQuestionnaire = {
  id: string
  title: string
  description?: string
  pages: NoteQuestionnairePage[]
}

export type NoteStackItem = {
  /** simple-icons slug, e.g. "siReact", "siTypescript" */
  icon: string
  label: string
}

/** One box in a stack diagram (e.g. Frontend, Backend) */
export type NoteStackLayer = {
  id: string
  label: string
  items: NoteStackItem[]
}

/** Connector between layers — drawn like mermaid edges */
export type NoteStackEdge = {
  from: string
  to: string
  label?: string
}

export type NoteBlock =
  | { type: "markdown"; id: string; content: string }
  | {
      type: "youtube"
      id: string
      url: string
      title?: string
      caption?: string
    }
  | {
      type: "stack"
      id: string
      title?: string
      caption?: string
      /** Flat icon row when no layers */
      items?: NoteStackItem[]
      /** Architecture boxes (preferred) */
      layers?: NoteStackLayer[]
      /** Dashed connectors between layer ids */
      edges?: NoteStackEdge[]
      direction?: "vertical" | "horizontal"
    }
  | {
      type: "mermaid"
      id: string
      title?: string
      caption?: string
      diagram: string
    }
  | {
      type: "illustration"
      id: string
      /** Key in the illustration registry */
      component: string
      title?: string
      caption?: string
    }
  | {
      type: "html"
      id: string
      /** Trusted HTML string (author-controlled config only) */
      html: string
      title?: string
      caption?: string
    }
  | {
      type: "link"
      id: string
      href: string
      label: string
      description?: string
    }
  | {
      type: "callout"
      id: string
      tone?: "info" | "tip" | "warn"
      title?: string
      body: string
    }
  | {
      type: "gallery"
      id: string
      title?: string
      caption?: string
      images: { src: string; label: string }[]
    }

export type NoteSection = {
  id: string
  title: string
  blocks: NoteBlock[]
  /** Optional questionnaire opened via "Take questionnaire" after the section */
  questionnaireId?: string | null
}

export type NoteVariants = {
  /** Sticky section nav on desktop */
  sidebarNav?: boolean
  /** Compact hero (title + crumbs only) */
  compactHero?: boolean
  /** Show created / updated under hero */
  showMeta?: boolean
}

export type NoteDocument = {
  id: string
  name: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  enabled: boolean
  variants?: NoteVariants
  /** Inline explain terms — clickable labels open a side sheet */
  explains?: NoteExplainTerm[]
  questionnaires?: NoteQuestionnaire[]
  sections: NoteSection[]
}

export type NotesConfig = {
  headline: string
  subheadline: string
  tree: NotesTreeNode[]
  notes: Record<string, NoteDocument>
}
