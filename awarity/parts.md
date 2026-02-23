# Awarity Parts

Reusable UI patterns built on FluentLM components and the awarity-v2.js runtime.

---

## Dialog & Detail Panel Layout

All dialogs and slide out detail panels must obey the following layout rules:

- The primary action like Save/Add/Next must be docked to the right hand side at the bottom of the dialog or panel.
- Seconday actions like Close/Cancel should be immediately to the left of the primary action.
- If the item is deletable, the Delete action must be docked to the left side at the bottom of the dialog or panel.
- For wizards, the Previous action should be docked to the left side at the bottom of the wizard.
- The content area of detail panels should be scrollable but the title and action buttons should always be visible.
- If a detail panel has a pivotset, only the content area of the pivots needs to be scrollable.
- Dialogs should have their content scrollable if it won't fit on the screen but the same rules as detail panels applies.
- FluentLM uses custom dropdowns and comboboxes so ensure that the content area of dialogs and detail panels contain the appropriate classes to prevent their popups from being clipped z-order wise.

### Detail Panel Footer HTML

The footer uses a full-width flex container. Delete is a direct child (sits at flex-start / left). Close and the primary action are wrapped in a `panel-footer-right` div that uses `margin-left: auto` to dock them to the right.

```html
<div class="flm-panel-footer">
  <div class="panel-footer-actions">
    <button class="flm-button" id="btn-delete" style="color: var(--red);">
      <i class="flm-icon" data-icon="Delete"></i> Delete
    </button>
    <div class="panel-footer-right">
      <button class="flm-button" id="btn-close">Close</button>
      <button class="flm-button flm-button--primary" id="btn-save">Save</button>
    </div>
  </div>
</div>
```

If the panel is not deletable, omit the Delete button — Close and the primary action remain in `panel-footer-right`.

### Detail Panel Footer CSS

The base `.flm-panel-footer` uses `justify-content: flex-end`, so `panel-footer-actions` must set `width: 100%` to fill the footer and allow its children to spread apart.

```css
.panel-footer-actions {
  display: flex;
  gap: var(--spacingS1);
  align-items: center;
  width: 100%;
}
.panel-footer-right {
  margin-left: auto;
  display: flex;
  gap: var(--spacingS1);
}
```

### Dialog Footer HTML

Dialog footers use the built-in `flm-dialog-footer` which right-aligns its children by default. Place Cancel immediately left of the primary action.

```html
<div class="flm-dialog-footer">
  <button class="flm-button" data-dialog-close>Cancel</button>
  <button class="flm-button flm-button--primary" id="btn-confirm">Confirm</button>
</div>
```

For wizards, dock the Back button to the left with `margin-right: auto`:

```html
<div class="flm-dialog-footer">
  <button class="flm-button" id="btn-back" style="margin-right: auto;">Back</button>
  <button class="flm-button" data-dialog-close>Cancel</button>
  <button class="flm-button flm-button--primary" id="btn-next">Next</button>
</div>
```

### Detail Panel Scrollability CSS

The panel must be a flex column so the header and footer stay fixed while the body scrolls. If the panel has a pivot bar, make it sticky so only pivot content scrolls.

```css
/* Fixed header + footer, scrollable body */
.flm-panel {
  display: flex;
  flex-direction: column;
}
.flm-panel-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.flm-panel-header,
.flm-panel-footer {
  flex-shrink: 0;
}

/* Sticky pivot bar within scrollable body */
.pivot-bar {
  position: sticky;
  top: 0;
  z-index: 1;
}
.pivot-panel {
  overflow-y: auto;
}
.pivot-panel--active {
  flex: 1;
  min-height: 0;
}
```

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

---

## Model Picker

A dropdown for selecting an LLM model. Uses the FluentLM Dropdown component for consistent styling. The available models come from `awarity.getModels()`, which returns a promise resolving to an array of `{ id, label }` objects.

### HTML

Use a FluentLM Dropdown:

```html
<div class="flm-textfield">
  <label class="flm-label">Model</label>
  <div class="flm-dropdown" id="my-model">
    <button class="flm-dropdown-trigger" type="button">
      <span class="flm-dropdown-title flm-dropdown-title--placeholder">Select model…</span>
      <span class="flm-dropdown-caret" data-icon="ChevronDown"></span>
    </button>
    <div class="flm-dropdown-listbox"></div>
  </div>
</div>
```

### JavaScript

#### Populating the dropdown

Call `awarity.getModels()` to fetch the model list, then build option elements inside the listbox. Pass an optional `selected` value and `includeDefault` flag:

```js
function populateModelDropdown(dropdownId, selected, includeDefault) {
  var dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;
  awarity.getModels().then(function (models) {
    var listbox = dropdown.querySelector('.flm-dropdown-listbox');
    var title = dropdown.querySelector('.flm-dropdown-title');
    var html = '';
    if (includeDefault) {
      var noneSelected = !selected;
      html += '<div class="flm-dropdown-option' + (noneSelected ? ' flm-dropdown-option--selected' : '') + '" data-value="">(workflow default)</div>';
      if (noneSelected && title) {
        title.textContent = '(workflow default)';
        title.classList.remove('flm-dropdown-title--placeholder');
      }
    }
    for (var i = 0; i < models.length; i++) {
      var isSelected = selected === models[i].id;
      html += '<div class="flm-dropdown-option' + (isSelected ? ' flm-dropdown-option--selected' : '') +
        '" data-value="' + models[i].id + '">' + models[i].label + '</div>';
      if (isSelected && title) {
        title.textContent = models[i].label;
        title.classList.remove('flm-dropdown-title--placeholder');
        dropdown.setAttribute('data-value', models[i].id);
      }
    }
    if (listbox) listbox.innerHTML = html;
  });
}

populateModelDropdown('my-model', 'claude-sonnet');
```

#### Building as an HTML string (for dynamic forms)

When generating dropdown markup from JS, use this helper with a pre-fetched model list:

```js
function modelDropdownHtml(id, selected, includeDefault) {
  var selectedLabel = '';
  if (!selected && includeDefault) { selectedLabel = '(workflow default)'; }
  for (var j = 0; j < cachedModels.length; j++) {
    if (cachedModels[j].id === selected) { selectedLabel = cachedModels[j].label; break; }
  }
  var html = '<div class="flm-dropdown" id="' + id + '"' + (selected ? ' data-value="' + selected + '"' : '') + '>' +
    '<button class="flm-dropdown-trigger" type="button">' +
      '<span class="flm-dropdown-title' + (selectedLabel ? '' : ' flm-dropdown-title--placeholder') + '">' +
        (selectedLabel || 'Select model…') + '</span>' +
      '<span class="flm-dropdown-caret" data-icon="ChevronDown"></span>' +
    '</button>' +
    '<div class="flm-dropdown-listbox">';
  if (includeDefault) {
    html += '<div class="flm-dropdown-option' + (!selected ? ' flm-dropdown-option--selected' : '') + '" data-value="">(workflow default)</div>';
  }
  // cachedModels populated via: awarity.getModels().then(function (m) { cachedModels = m; })
  for (var i = 0; i < cachedModels.length; i++) {
    html += '<div class="flm-dropdown-option' + (selected === cachedModels[i].id ? ' flm-dropdown-option--selected' : '') +
      '" data-value="' + cachedModels[i].id + '">' + cachedModels[i].label + '</div>';
  }
  html += '</div></div>';
  return html;
}
```

**Note:** After inserting the HTML, call `wireDropdowns(container)` (from FluentLM) to activate keyboard navigation and click handling on the new dropdown.

#### Reading the selected value

The selected model `id` is stored in the `data-value` attribute on the `.flm-dropdown` root:

```js
var value = document.getElementById('my-model').getAttribute('data-value');
```

#### `awarity.getModels()`

Returns `Promise<Array<{ id: string, label: string }>>`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Model identifier (e.g. `'claude-sonnet'`) — use as the option `data-value` |
| `label` | `string` | Human-readable name (e.g. `'Claude Sonnet'`) — use as the option text |

Currently returns a hardcoded list. Will be replaced with an API call in the future.

---

## Lens Picker

A dropdown for selecting a lens file. Uses the FluentLM Dropdown component for consistent styling. The available lenses come from `awarity.getLenses()`, which returns a promise resolving to an array of `{ id, label }` objects.

### HTML

Use a FluentLM Dropdown:

```html
<div class="flm-textfield">
  <label class="flm-label">Lens</label>
  <div class="flm-dropdown" id="my-lens">
    <button class="flm-dropdown-trigger" type="button">
      <span class="flm-dropdown-title flm-dropdown-title--placeholder">Select lens…</span>
      <span class="flm-dropdown-caret" data-icon="ChevronDown"></span>
    </button>
    <div class="flm-dropdown-listbox"></div>
  </div>
</div>
```

### JavaScript

#### Populating the dropdown

Call `awarity.getLenses()` to fetch the lens list, then build option elements inside the listbox. Pass an optional `selected` value and `includeNone` flag:

```js
function populateLensDropdown(dropdownId, selected, includeNone) {
  var dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;
  awarity.getLenses().then(function (lenses) {
    var listbox = dropdown.querySelector('.flm-dropdown-listbox');
    var title = dropdown.querySelector('.flm-dropdown-title');
    var html = '';
    if (includeNone) {
      var noneSelected = !selected;
      html += '<div class="flm-dropdown-option' + (noneSelected ? ' flm-dropdown-option--selected' : '') + '" data-value="">(none)</div>';
      if (noneSelected && title) {
        title.textContent = '(none)';
        title.classList.remove('flm-dropdown-title--placeholder');
      }
    }
    for (var i = 0; i < lenses.length; i++) {
      var isSelected = selected === lenses[i].id;
      html += '<div class="flm-dropdown-option' + (isSelected ? ' flm-dropdown-option--selected' : '') +
        '" data-value="' + lenses[i].id + '">' + lenses[i].label + '</div>';
      if (isSelected && title) {
        title.textContent = lenses[i].label;
        title.classList.remove('flm-dropdown-title--placeholder');
        dropdown.setAttribute('data-value', lenses[i].id);
      }
    }
    if (listbox) listbox.innerHTML = html;
  });
}

populateLensDropdown('my-lens', 'lenses/financial-risk.lens.md', true);
```

#### Building as an HTML string (for dynamic forms)

When generating dropdown markup from JS, use this helper with a pre-fetched lens list:

```js
function lensDropdownHtml(id, selected, includeNone) {
  var selectedLabel = '';
  if (!selected && includeNone) { selectedLabel = '(none)'; }
  for (var j = 0; j < cachedLenses.length; j++) {
    if (cachedLenses[j].id === selected) { selectedLabel = cachedLenses[j].label; break; }
  }
  var html = '<div class="flm-dropdown" id="' + id + '"' + (selected ? ' data-value="' + selected + '"' : '') + '>' +
    '<button class="flm-dropdown-trigger" type="button">' +
      '<span class="flm-dropdown-title' + (selectedLabel ? '' : ' flm-dropdown-title--placeholder') + '">' +
        (selectedLabel || 'Select lens…') + '</span>' +
      '<span class="flm-dropdown-caret" data-icon="ChevronDown"></span>' +
    '</button>' +
    '<div class="flm-dropdown-listbox">';
  if (includeNone) {
    html += '<div class="flm-dropdown-option' + (!selected ? ' flm-dropdown-option--selected' : '') + '" data-value="">(none)</div>';
  }
  // cachedLenses populated via: awarity.getLenses().then(function (l) { cachedLenses = l; })
  for (var i = 0; i < cachedLenses.length; i++) {
    html += '<div class="flm-dropdown-option' + (selected === cachedLenses[i].id ? ' flm-dropdown-option--selected' : '') +
      '" data-value="' + cachedLenses[i].id + '">' + cachedLenses[i].label + '</div>';
  }
  html += '</div></div>';
  return html;
}
```

**Note:** After inserting the HTML, call `wireDropdowns(container)` (from FluentLM) to activate keyboard navigation and click handling on the new dropdown.

#### Reading the selected value

The selected lens `id` is stored in the `data-value` attribute on the `.flm-dropdown` root:

```js
var value = document.getElementById('my-lens').getAttribute('data-value');
```

#### `awarity.getLenses()`

Returns `Promise<Array<{ id: string, label: string }>>`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Lens file path (e.g. `'lenses/financial-risk.lens.md'`) — use as the option `data-value` |
| `label` | `string` | Human-readable name (e.g. `'Financial Risk'`) — use as the option text |

Currently returns a hardcoded list. Will be replaced with an API call in the future.

---

## Mode Dropdown

A dropdown for selecting between the two query modes: **Full ECW** (full document context) and **Abstracts** (cached semantic summaries). Uses the FluentLM Dropdown component for consistent styling.

### HTML

Use a FluentLM Dropdown with two static options:

```html
<div class="flm-textfield">
  <label class="flm-label">Mode</label>
  <div class="flm-dropdown" id="my-mode" data-value="full">
    <button class="flm-dropdown-trigger" type="button">
      <span class="flm-dropdown-title">Full ECW</span>
      <span class="flm-dropdown-caret" data-icon="ChevronDown"></span>
    </button>
    <div class="flm-dropdown-listbox">
      <div class="flm-dropdown-option flm-dropdown-option--selected" data-value="full">Full ECW</div>
      <div class="flm-dropdown-option" data-value="abstracts">Abstracts</div>
    </div>
  </div>
</div>
```

### JavaScript

#### Building as an HTML string (for dynamic forms)

```js
function modeDropdownHtml(id, selected) {
  var isAbstracts = selected === 'abstracts';
  return '<div class="flm-dropdown" id="' + id + '" data-value="' + (selected || 'full') + '">' +
    '<button class="flm-dropdown-trigger" type="button">' +
      '<span class="flm-dropdown-title">' + (isAbstracts ? 'Abstracts' : 'Full ECW') + '</span>' +
      '<span class="flm-dropdown-caret" data-icon="ChevronDown"></span>' +
    '</button>' +
    '<div class="flm-dropdown-listbox">' +
      '<div class="flm-dropdown-option' + (isAbstracts ? '' : ' flm-dropdown-option--selected') + '" data-value="full">Full ECW</div>' +
      '<div class="flm-dropdown-option' + (isAbstracts ? ' flm-dropdown-option--selected' : '') + '" data-value="abstracts">Abstracts</div>' +
    '</div></div>';
}
```

**Note:** After inserting the HTML, call `wireDropdowns(container)` (from FluentLM) to activate keyboard navigation and click handling on the new dropdown.

#### Reading the selected value

The selected mode is stored in the `data-value` attribute on the `.flm-dropdown` root:

```js
var value = document.getElementById('my-mode').getAttribute('data-value');
// Returns 'full' or 'abstracts'
```

---

## Catalog Picker

A dropdown for selecting a catalog. The available catalogs come from `awarity.getCatalogs()`, which returns a promise resolving to an array of `{ id, label }` objects. Uses the FluentLM Dropdown component (not a `<select>`) for a richer visual style with the standard dropdown trigger, listbox, and option pattern.

### HTML

Use a FluentLM Dropdown:

```html
<div class="flm-textfield">
  <label class="flm-label">Catalog</label>
  <div class="flm-dropdown" id="my-catalog">
    <button class="flm-dropdown-trigger" type="button">
      <span class="flm-dropdown-title flm-dropdown-title--placeholder">Select a catalog…</span>
      <span class="flm-dropdown-caret" data-icon="ChevronDown"></span>
    </button>
    <div class="flm-dropdown-listbox"></div>
  </div>
</div>
```

### JavaScript

#### Populating the dropdown

Call `awarity.getCatalogs()` to fetch the catalog list, then build the option elements inside the listbox. Pass an optional `selected` value:

```js
function populateCatalogDropdown(dropdownId, selected) {
  var dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;
  awarity.getCatalogs().then(function (catalogs) {
    var listbox = dropdown.querySelector('.flm-dropdown-listbox');
    var title = dropdown.querySelector('.flm-dropdown-title');
    var html = '';
    for (var i = 0; i < catalogs.length; i++) {
      var isSelected = selected === catalogs[i].id;
      html += '<div class="flm-dropdown-option' + (isSelected ? ' flm-dropdown-option--selected' : '') +
        '" data-value="' + catalogs[i].id + '">' + catalogs[i].label + '</div>';
      if (isSelected) {
        title.textContent = catalogs[i].label;
        title.classList.remove('flm-dropdown-title--placeholder');
        dropdown.setAttribute('data-value', catalogs[i].id);
      }
    }
    listbox.innerHTML = html;
  });
}

populateCatalogDropdown('my-catalog', 'sec-filings');
```

#### Building as an HTML string (for dynamic forms)

When generating dropdown markup from JS, use this helper with a pre-fetched catalog list:

```js
function catalogDropdownHtml(id, selected) {
  var html = '<div class="flm-dropdown" id="' + id + '"' +
    (selected ? ' data-value="' + selected + '"' : '') + '>' +
    '<button class="flm-dropdown-trigger" type="button">' +
      '<span class="flm-dropdown-title' + (selected ? '' : ' flm-dropdown-title--placeholder') + '">' +
        (selected || 'Select a catalog…') + '</span>' +
      '<span class="flm-dropdown-caret" data-icon="ChevronDown"></span>' +
    '</button>' +
    '<div class="flm-dropdown-listbox">';
  // cachedCatalogs populated via: awarity.getCatalogs().then(function (c) { cachedCatalogs = c; })
  for (var i = 0; i < cachedCatalogs.length; i++) {
    html += '<div class="flm-dropdown-option' +
      (selected === cachedCatalogs[i].id ? ' flm-dropdown-option--selected' : '') +
      '" data-value="' + cachedCatalogs[i].id + '">' + cachedCatalogs[i].label + '</div>';
  }
  html += '</div></div>';
  return html;
}
```

**Note:** After inserting the HTML, call `wireDropdowns(container)` (from FluentLM) to activate keyboard navigation and click handling on the new dropdown.

#### Reading the selected value

The selected catalog `id` is stored in the `data-value` attribute on the `.flm-dropdown` root:

```js
var value = document.getElementById('my-catalog').getAttribute('data-value');
```

#### `awarity.getCatalogs()`

Returns `Promise<Array<{ id: string, label: string }>>`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Catalog identifier (e.g. `'sec-filings'`) — use as the option `data-value` |
| `label` | `string` | Human-readable name (e.g. `'SEC Filings'`) — use as the option text |

Currently returns a hardcoded list. Will be replaced with an API call in the future.
