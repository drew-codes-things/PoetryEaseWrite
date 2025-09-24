# Poetry Writing Workspace

A beautiful, immersive **web-based tool** (HTML, CSS, JS) designed for poets and creative writers to focus on their craft.

## Features
*   **Workspace Management**:
    *   **Dynamic Creation**: Add new, clean writing workspaces on the fly.
    *   **Editable Titles**: Easily name and rename each poem.
    *   **Deletion**: Remove workspaces with a confirmation to prevent accidental loss.
*   **Poet's Toolkit**:
    *   **Word Lookup**: Instantly get definitions for any word using the DictionaryAPI.
    *   **Rhyme Finder**: Discover rhyming words to perfect your verses using the Datamuse API.
*   **Inspiration & Media**:
    *   **Media Upload**: Attach a reference image or video to each workspace.
    *   **Interactive Viewer**: Pan and zoom your reference media for closer inspection.
*   **Saving & Exporting**:
    *   **Save as Text**: Download your finished poems as `.txt` files.
*   **User Experience**:
    *   **Immersive UI**: A stunning, animated "glassmorphism" interface with particle effects.
    *   **Keyboard Shortcuts**: Use `Ctrl+N` for a new workspace and `Ctrl+Enter` to save.
    *   **Responsive Design**: Fully functional on modern desktop and mobile browsers.
    *   **Lightweight**: Works directly in the browser with no installation or account required.

## How It Works
1. The application opens with a fresh workspace, ready for your first poem.
2. Use the **Word Lookup** and **Rhyme Finder** tools in the sidebars to spark inspiration.
3. Click **Reference Media** to upload an image or video that complements your writing. Pan and zoom as needed.
4. Give your poem a title and click **Save as Text** to download your work.
5. Need a new canvas? Use the sidebar button or `Ctrl+N` to add another workspace.

## External APIs Used
-   `GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}` - Fetches word definitions and suggestions.
-   `GET https://api.datamuse.com/words?rel_rhy={word}` - Fetches rhyming words and suggestions.

## Potential Future Features
*   **Theme Customization**: Allow users to select different color themes or background effects.
*   **Enhanced Export Options**: Add options to export as PDF or Markdown.
*   **More Robust Undo/Redo**: Implement undo for actions beyond simple text editing, like workspace deletion.
*   **Word Count & Stats**: Display a live word count or other simple statistics for the current poem.
*   **App Logo**: Design a logo for the browser tab and header.