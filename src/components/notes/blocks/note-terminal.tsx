"use client"

import { TerminalPlayground } from "@/components/notes/illustrations/terminal-playground"

type NoteTerminalProps = {
  scenario: string
  title?: string
  caption?: string
}

export function NoteTerminal({ scenario, title, caption }: NoteTerminalProps) {
  return (
    <TerminalPlayground scenario={scenario} title={title} caption={caption} />
  )
}
