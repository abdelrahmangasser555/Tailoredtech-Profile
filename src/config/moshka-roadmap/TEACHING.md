# Moshka note authoring

Every hands-on lesson should:

1. Open with `beforeYouStart(id, whatYouWillDo, doneLooksLike, files?)`.
2. Use `teachStep(n, title, explain, lang, filename, code, highlight?)` instead of one big paste.
3. Use `termStep` for shell commands (Step + bash fence).
4. Put `highlight=5-8` on fences (via `teachStep`) so new lines show a lime bar; **Copy all** still copies the full file.

Helpers live in `moshka-teach.ts`, re-exported from `helpers.ts`.

UI: `note-code-block.tsx` parses `highlight=` on ```lang:file highlight=1-3 fences.

Voice: simple English, short sentences. See `MOSHKA_TALK` in `helpers.ts`.
