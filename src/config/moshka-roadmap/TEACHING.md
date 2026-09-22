# Moshka note authoring

Every hands-on lesson should:

1. Open with `beforeYouStart(id, whatYouWillDo, doneLooksLike, files?)`.
2. Use `concept(id, title, body)` before hard topics (OOP, async, runtime, table markup).
3. Use `teachStep(n, title, explain, lang, filename, code, highlight?, afterCode?)` instead of one big paste.
4. Put `afterCode` on every step when the highlight block is more than ~3 lines: bullet each new line in plain English.
5. Use `termStep` for shell commands (Step + bash fence).
6. Put `highlight=` on **only the new lines** in that step so the lime bar marks what changed; **Copy all** still copies the full file.

Helpers live in `moshka-teach.ts`, re-exported from `helpers.ts`.

UI: `note-code-block.tsx` parses `highlight=` on ```lang:file highlight=1-3 fences.

Voice: simple English, short sentences. Treat Moshka as an absolute beginner until the lesson proves otherwise. See `MOSHKA_TALK` in `helpers.ts`.
