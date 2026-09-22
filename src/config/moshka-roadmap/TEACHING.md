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

## Videos

Most lessons should have **two** clips when the topic maps to YouTube:

1. Short overview: `VID.html`, `VID.js`, `VID.react`, etc. (Fireship 100 Seconds), via `yt()` or `watchPair()`.
2. Long sit-down: Bro Code, Traversy, Net Ninja, or **Web Dev Simplified** (`VID.jsDomWds`, `VID.reactUseStateWds`, …), via `ytWatch()` with **Watch from X to Y** in the caption.

Prefer WDS for DOM, events, array methods, promises, fetch, React hooks, and Playwright. Add `link()` to [WDS channel](https://www.youtube.com/@WebDevSimplified) or an MDN page when there is no perfect clip.

Use `watchPair(short, long)` from `moshka-teach.ts` when both clips belong at the top of a section.
