# Poetry Writing Workspace

A browser-based writing tool for poets. Open a workspace, write, and use the built-in word lookup and rhyme finder to refine your verses — no account, no install, no distractions.

Live at [poetryeasewrite.drew-gnr.xyz](https://poetryeasewrite.drew-gnr.xyz)

## Features

- **Multiple workspaces** — open as many poems as you want side-by-side, each with its own title
- **Word lookup** — get the definition and synonyms for any word (sourced across all meanings, not just the first)
- **Rhyme finder** — instantly find rhyming words for any term
- **"Did you mean?"** — both tools suggest the closest match if a word isn't found
- **Reference media** — attach an inspiration image or video to any workspace; pan and zoom it while you write
- **Save as text** — download any poem as a `.txt` file with one click
- **Keyboard shortcuts** — `Ctrl+N` new workspace, `Ctrl+Enter` save current poem, `Enter` in sidebar inputs to search, `Esc` to jump to Word Lookup
- **Floating particle background** — subtle ambient animation

## How to Use

1. The page opens with a fresh workspace ready to go
2. Type your poem in the central textarea — it grows automatically as you write
3. Use **Word Lookup** (left sidebar) to get definitions and synonyms — press Enter or click Search
4. Use **Rhyme Finder** (right sidebar) to find rhymes — press Enter or click Search
5. Click **Reference Media** on any workspace to attach an image or video for inspiration
6. Click **Save as Text** (or press `Ctrl+Enter`) to download your poem
7. Click **+ New Poem** (bottom right) or press `Ctrl+N` to open another workspace

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+N` | Add a new workspace |
| `Ctrl+Enter` | Save the poem in the active workspace |
| `Enter` | Trigger search in Word Lookup or Rhyme Finder |
| `Esc` | Focus the Word Lookup input |

## APIs Used

- [Free Dictionary API](https://dictionaryapi.dev/) — word definitions and synonyms
- [Datamuse API](https://www.datamuse.com/api/) — rhyming words and spelling suggestions

## Structure

```
PoetryEaseWrite/
├── index.html        # Markup and layout
├── Assets/
│   ├── script.js    # All app logic
│   ├── style.css    # Styles
│   └── banner.png   # Header background
└── CNAME            # Custom domain for GitHub Pages
```
