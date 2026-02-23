# Awarity Parts

Reusable UI patterns built on FluentLM components and the awarity-v2.js runtime.

---

## File & Folder Picker

A text input with an inline browse button that opens a native file or folder picker. Uses the File System Access API when available (Chromium browsers) and remembers the last-used directory across sessions via IndexedDB. Falls back to a hidden `<input type="file">` on unsupported browsers.

### HTML

Wrap a standard `flm-textfield` around a `flm-textfield-wrapper` containing the input and a browse button:

```html
<!-- Folder picker -->
<div class="flm-textfield">
  <label class="flm-label" for="my-folder">Folder</label>
  <div class="flm-textfield-wrapper">
    <input class="flm-textfield-input" id="my-folder" placeholder="/path/to/folder">
    <button type="button" class="flm-browse-btn" data-icon="FolderOpen"
            data-browse-for="my-folder" aria-label="Browse"></button>
  </div>
</div>

<!-- File picker -->
<div class="flm-textfield">
  <label class="flm-label" for="my-file">File</label>
  <div class="flm-textfield-wrapper">
    <input class="flm-textfield-input" id="my-file" placeholder="Select a file…">
    <button type="button" class="flm-browse-btn" data-icon="Document"
            data-browse-for="my-file" aria-label="Browse"></button>
  </div>
</div>
```

Key attributes on the `<button>`:

| Attribute | Purpose |
|-----------|---------|
| `data-icon="FolderOpen"` | Renders a folder icon **and** tells the JS handler to open a directory picker |
| `data-icon="Document"` | Renders a file icon **and** tells the JS handler to open a file picker |
| `data-browse-for="<id>"` | The `id` of the `<input>` whose `.value` should be populated with the result |

Any `data-icon` value other than `FolderOpen` is treated as a file picker.

### CSS

The `flm-textfield-wrapper` is already a `display: flex` container (defined in `fluentlm.min.css`). Add these styles for the browse button:

```css
.flm-textfield-wrapper .flm-browse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  border: none;
  border-left: 1px solid var(--inputBorder);
  background: var(--defaultStateBackground);
  color: var(--bodySubtext);
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}
.flm-textfield-wrapper .flm-browse-btn:hover {
  background: var(--bodyStandoutBackground);
  color: var(--bodyText);
}
```

The button sits flush against the right edge of the input. The icon SVG is injected automatically by FluentLM's `data-icon` system.

### JavaScript

**Prerequisite:** Include `awarity-v2.js` on the page. It exposes `awarity.browse()`.

#### Option A — Delegated handler (recommended)

Attach a single click listener to a parent container (e.g. a form, panel body, or dialog). This automatically handles any browse buttons added dynamically:

```js
function handleBrowse(e) {
  var btn = e.target.closest('.flm-browse-btn');
  if (!btn) return;
  var targetId = btn.getAttribute('data-browse-for');
  var input = targetId ? document.getElementById(targetId) : null;
  if (!input) return;
  var isFolder = btn.getAttribute('data-icon') === 'FolderOpen';
  awarity.browse(input, { mode: isFolder ? 'folder' : 'file' });
}

document.getElementById('my-container').addEventListener('click', handleBrowse);
```

#### Option B — Direct call

Call `awarity.browse()` from any click handler:

```js
document.getElementById('my-browse-btn').addEventListener('click', function () {
  var input = document.getElementById('my-folder');
  awarity.browse(input, { mode: 'folder' });
});
```

#### `awarity.browse(targetInput, opts)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `targetInput` | `HTMLInputElement` | The text input to populate with the selected path |
| `opts.mode` | `'file'` \| `'folder'` | Picker mode (default `'file'`) |
| `opts.types` | `Array` | Optional file type filters passed to `showOpenFilePicker` (ignored in folder mode and in the fallback) |

**Behavior:**
1. Reads the last-used directory handle from IndexedDB
2. Opens the native picker starting in that directory (if available)
3. On selection, writes the name into `targetInput.value` and focuses the input
4. Saves the directory handle back to IndexedDB for next time
5. If the File System Access API is unavailable, falls back to a hidden `<input type="file">` with `webkitdirectory` for folder mode

#### Helper for dynamic HTML

If you're building picker markup from JS (e.g. for dynamic forms), use a helper like this:

```js
function pathInput(id, value, placeholder, icon) {
  icon = icon || 'FolderOpen';
  return '<div class="flm-textfield-wrapper">' +
    '<input class="flm-textfield-input" id="' + id + '" value="' + (value || '') + '"' +
      (placeholder ? ' placeholder="' + placeholder + '"' : '') + '>' +
    '<button type="button" class="flm-browse-btn" data-icon="' + icon + '" ' +
      'data-browse-for="' + id + '" aria-label="Browse"></button>' +
  '</div>';
}
```

Pass `'Document'` as the icon for file pickers, or omit it (defaults to `'FolderOpen'`) for folder pickers.
