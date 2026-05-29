# EasePoet (PoetryEaseWrite)

A distraction-free, fully client-side poetry writing app. No backend, no account, no install — just open it and write.

**Live demo:** [easepoet.drew-gnr.xyz](https://easepoet.drew-gnr.xyz/)

---

## Features

- **Multiple workspaces** — write several poems at once, each with its own title
- **Word lookup** — powered by the [Free Dictionary API](https://dictionaryapi.dev/); shows definition and synonyms
- **Rhyme finder** — powered by [Datamuse](https://www.datamuse.com/api/)
- **Syllable counter** — real-time per-line syllable count using the Datamuse `/words?md=s` endpoint; useful for Haiku (5-7-5), iambic pentameter, and other structured forms. Expand “per line” to see a breakdown
- **Reference media** — upload an image or video to each workspace as visual inspiration; pan and zoom with pointer drag / scroll wheel
- **Auto-save** — all workspaces are saved to `localStorage` every 30 seconds and restored automatically when you reopen the tab. Nothing is sent to any server
- **Export — Text** — downloads the current workspace as a plain `.txt` file (Ctrl+Enter while in the textarea)
- **Export — PDF** — uses `window.print()` with a print stylesheet that hides the UI and shows only the selected poem. Works in Chrome, Edge, and Safari. In Firefox, use File → Print or Ctrl+P and ensure “Print backgrounds” is enabled

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + N` | New workspace |
| `Ctrl + Enter` | Save current poem as `.txt` |
| `Ctrl + L` | Focus word lookup input |
| `Ctrl + R` | Focus rhyme finder input |
| `Escape` | Return focus to word lookup |

---

## Tech stack

- Pure HTML + CSS + JavaScript (zero dependencies, zero build step)
- [Free Dictionary API](https://dictionaryapi.dev/) — definitions
- [Datamuse API](https://www.datamuse.com/api/) — rhymes and syllable counts

---

## File structure

```
PoetryEaseWrite/
├── index.html
├── Assets/
│   ├── script.js
│   └── style.css
├── .gitattributes
├── README.md
└── LICENSE
```

---

## License

MIT
