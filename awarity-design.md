# Awarity UX Design Spec — Current Screens

## Global Shell & Navigation

### App Shell Layout
- **Type:** Two-column layout — fixed left nav + flexible main area
- **Min height:** 100vh, flex display
- **Theme support:** Dual themes (`awarity-light`, `awarity-dark`) via FluentLM CSS custom properties

### Left Navigation Rail (220px fixed)
- **Background:** `--bodyStandoutBackground` with right border divider
- **Sticky** to viewport, full height, internally scrollable

| Element | Details |
|---|---|
| **Brand** | "Awarity" — `fontSizeXLarge`, semibold, bottom-bordered |
| **Nav Links** | Icon + label, 3px left border indicator for active state |
| **Active State** | `--listItemBackgroundChecked` bg, semibold text, `--themePrimary` left border |
| **Hover State** | `--listItemBackgroundHovered` background |

**Navigation Items (top to bottom):**

| Icon | Label | Route |
|---|---|---|
| Home | Home | `../home/` |
| Database | Catalogs | `../catalogs/` |
| Search | Explore | `../explorer/` |
| Org | Structure | `../structure/` |
| Filter | Lenses | `../lenses/` |
| Flow | Workflows | `../workflows/` |
| Processing | Runs | `../runs/` |
| *(spacer)* | | |
| Settings | Settings | `../settings/` |

**Footer:** Theme toggle button (full-width)

### Main Area Structure (shared across screens)
Each screen's main area follows this vertical stack:

1. **CommandBar** — contextual action toolbar, bottom-bordered
2. **Breadcrumb** — `Home > [Page]`, padded with background
3. **MessageBar Zone** — auto-hiding container for transient notifications (5s auto-dismiss)
4. **Content Area** — flex-grow, scrollable, padded `--spacingL2`

---

## Screen 1: Catalogs

**Purpose:** Manage document catalogs — the filesystem-backed corpora that Awarity reasons over.

### CommandBar Actions

| Button | Style | Icon | State |
|---|---|---|---|
| **New Catalog** | Primary | Add | Always enabled |
| **Generate Abstracts** | CommandBar item | TextDocument | Enabled when rows selected |
| **Delete** | CommandBar item | Delete | Enabled when rows selected |
| *(divider)* | | | |
| **Refresh** | CommandBar item | Refresh | Always enabled |
| **Search** (far side) | SearchBox | — | Filters rows by catalog name |

### Content Area — Three View States

#### 1. Loading State (`state-loading`)
- **Shimmer table:** 5 rows x 7 flex columns of `flm-shimmer-line` placeholders
- Mimics the data table shape during async load

#### 2. Empty State (`state-empty`)
- **Centered vertical layout** (min-height 400px)
- Large Database icon (48px, 40% opacity)
- Heading: "No catalogs yet"
- Subtext: "Catalogs store your document corpus. Create one to begin reasoning over your data."
- Primary CTA: "Create your first catalog" (opens New Catalog panel)

#### 3. Data State (`state-data`) — DetailsList Table

**Columns:**

| Column | Width | Alignment | Content |
|---|---|---|---|
| *(checkbox)* | auto | — | Row selection checkbox |
| **Name** | 200px | left | Catalog name (semibold) |
| **Documents** | 100px | right | Document count (formatted) |
| **Chunks** | 100px | right | Chunk count or "—" |
| **Abstracts** | 100px | right | Abstract count or "—" |
| **Classifications** | 120px | right | Classification count |
| **Last Updated** | 140px | left | Date string |
| **Status** | flex: 1 | left | Status badge |

**Status Badges** (colored dot + label):

| Status | CSS Class | Color | Example |
|---|---|---|---|
| Ready | `status-badge--ready` | `--green` | Fully ingested, abstracts generated |
| Abstracts Missing | `status-badge--warning` | `--yellow` | Ingested but no abstracts |
| Processing | `status-badge--processing` | `--blue` | Active operation + inline progress bar (3px) |
| Error | `status-badge--error` | `--red` | Ingest or processing failure |

**Sample Data (5 catalogs):**

| Name | Docs | Chunks | Abstracts | Classifications | Status |
|---|---|---|---|---|---|
| sec-filings | 2,341 | 18,420 | 2,341 | 3 | Ready |
| legal-contracts | 847 | 6,120 | 0 | 0 | Abstracts Missing |
| research-papers | 512 | 3,840 | 287 | 1 | Processing (56%) |
| email-archive | 4,200 | — | — | 0 | Error |
| compliance-docs | 1,105 | 8,930 | 1,105 | 5 | Ready |

**Interactions:**
- **Check-all** checkbox with indeterminate state support
- **Row click** (excluding checkbox area) opens Detail Panel
- **Search** filters rows by `data-catalog` attribute match

### Detail Panel (right slide-over, medium width)

A `flm-panel` with overlay that displays full catalog details.

**Sections:**

#### Overview (key-value grid, 2 columns: label + value)
- Documents, Chunks, Abstracts, Classifications, Storage path, Created date, Status badge

#### Error Banner (conditional)
- Shown only for `status: error` catalogs
- `flm-messagebar--error` with specific error message
- Example: *"Ingest failed: unable to parse 12 documents. Check source files for encoding issues."*

#### Actions
- Generate Abstracts
- Ask Question
- Run Classification
- Delete Catalog (red text)

#### Troubleshoot (conditional, error only)
- View Logs
- Retry Ingest (primary button)

#### Recent Activity
- Chronological list of operations with relative timestamps
- Format: `[operation label] — [time ago]`

**Footer:** Close button

### New Catalog Panel (right slide-over, medium width)

**Form fields:**

| Field | Type | Required | Details |
|---|---|---|---|
| **Catalog Name** | Text input | Yes | Placeholder: "e.g. sec-filings" |
| **Source Type** | Radio group | — | "Folder" (default) or "File list" |
| **Path** | Text input + browse button | Yes | FolderOpen icon button triggers `<input webkitdirectory>` |
| **Auto-generate abstracts** | Checkbox | — | Post-ingest automation |

**States:**
- **Validation error:** Inline messagebar if required fields empty
- **Creating:** Indeterminate progress bar with "Creating catalog..." label
- **Success:** Panel closes, success messagebar in main content (5s)

**Footer:** Create (primary) + Cancel

### Delete Confirmation Dialog
- `flm-dialog` with overlay (z-index 1002)
- Light-dismiss enabled
- Body: "Are you sure you want to delete **[name(s)]**? This will remove all chunks, abstracts, and classification data. This action cannot be undone."
- Delete button styled with `--red` background
- Supports bulk delete (comma-separated names from multi-select)

---

## Screen 2: Explore (Ask)

**Purpose:** Query a catalog using Awarity's ECW engine — configure, run, and view results.

### CommandBar Actions

| Button | Style | Icon | State |
|---|---|---|---|
| **New Query** | Primary | Add | Disabled until first query completes |
| **View Runs** | CommandBar item | Processing | Always enabled |
| *(divider)* | | | |
| **Help** | CommandBar item | Help | Always enabled |

### Zone 1: Query Configuration

A collapsible card (`query-config`) with standout background and border-radius. Has four visual states, each changing the title text:

| State | Title | Body | Running Section |
|---|---|---|---|
| **idle** | "Query Configuration" | Expanded (form visible) | Hidden |
| **running** | "Query Running" | Collapsed (animated) | Visible with progress |
| **complete** | "Query Completed" | Collapsed | Stats + actions visible |
| **error** | "Query Error" | Collapsed | Stats + error info visible |
| **cancelled** | "Query Cancelled" | Collapsed | Stats + cancelled indicator |

#### Configuration Form (visible in idle state)

**Row 1 — Context Controls (horizontal flex, wrapping):**

| Field | Type | Width | Options |
|---|---|---|---|
| **Catalog** | Dropdown | 180px | sec-filings, legal-contracts, research-papers, compliance-docs |
| **Mode** | Radio group (horizontal) | auto | Full ECW (default), Abstracts |
| **Lens** | Dropdown | 160px | (none), financial-risk, legal-compliance, executive-summary, technical-detail |
| **Model** | Dropdown | 150px | claude-sonnet (default), claude-haiku, gpt-4o, gpt-4o-mini |

**Row 2 — Question Input:**
- Label: "Question or Goal" with "Saved Queries" link (right-aligned, opens library panel)
- Textarea (3 rows, full-width, resizable vertical)
- Placeholder: *"What would you like to explore? e.g. 'What are the top financial risk disclosures across all SEC filings?'"*

**Actions Row:**
- **Run** (primary, disabled until catalog + question are set)
- **Clear**

**Advanced Section (collapsible):**
- Toggle link: "Advanced" / "Hide Advanced"
- Content: "Skip Inference" checkbox (maps to `--skip-inference` CLI flag)

#### Running State (collapsed config)

**Progress display:**
- Phase label with animated dots (4-state cycle: `""`, `" ."`, `" . ."`, `" . . ."`, 800ms interval)
- Phases cycle through: "Reading documents" → "Extracting notes" → "Synthesizing answer"
- Determinate progress bar (simulated ~30s with random increments of 2.5-4.1% per second)

**Metadata sub-bar (flex, space-between):**
- Left: catalog name, mode, lens, model, token estimate (separated by `·` dots)
- Right: Cancel link (red) + elapsed timer (`m:ss` format, tabular-nums)

**Show/Hide Query:** Collapsible text block showing the original query text in a bordered, scrollable container

#### Completed State

**Stats Fact Set** (3-column CSS grid, 60% width):

| Col 1 | Col 2 | Col 3 |
|---|---|---|
| Catalog | Model | Duration |
| Lens | Token usage | *(extra: error/cancelled)* |
| Documents | Mode | |

**Completed Actions:**
- **Edit Query** — returns to idle state, preserves textarea content
- **Save Query** — adds to per-catalog library (disabled if already saved)

**Cancelled variant:** Extra stat shows "Operation: Canceled" in yellow

**Error variant:** Extra stat shows error message in red, spans 2 columns

### Zone 2: Results Area

A bordered container (min-height 400px) with three states:

#### Idle / Running State
- Centered empty state with Search icon
- Running: "Waiting for answer..." / Idle: "No query executed yet."

#### Complete State — Tabbed Results

**Pivot Bar** (tab strip):
- **Answer** tab (default active)
- **Sources** tab
- *(spacer)*
- Copy to clipboard icon button
- Download icon button (saves as `[catalog]-answer.md`)

**Answer Tab:**
- Rich HTML content with styled paragraphs, headings, lists
- Line-height 1.7, proper list indentation

**Sources Tab:**
- Unstyled list of document filenames with bottom-bordered items

#### Error State
- `flm-messagebar--error` with error message
- Action buttons: View Logs + Retry (primary)

### Supplementary Panels

#### Logs Panel (right slide-over)
- Monospace log viewer (`Cascadia Code` / `Consolas`)
- Color-coded log lines: info (subtext), warn (yellow), error (red), success (green)
- Max-height 500px, scrollable
- Timestamp format: `[YYYY-MM-DD HH:mm:ss]`

#### Query Library Panel (right slide-over)
- Title: "Saved Queries — [catalog name]"
- Search box for filtering saved queries
- **Per-catalog storage**, sorted MRU (most recently used first)
- Each item shows:
  - Query text (2-line clamp with "more"/"less" toggle)
  - Delete button
  - Recently-saved items highlighted with `--listItemBackgroundChecked`
- Click item → pastes text into query textarea, closes panel
- Clicking "more" expands text, "less" collapses
- Toggle auto-disabled if text doesn't overflow

#### Delete Query Confirmation Dialog
- Shows preview of the query text
- Red delete button + Cancel
- Light-dismiss enabled

### Floating Action Button
- **"Go to Top"** circular button (40px, `--themePrimary` bg)
- Fixed bottom-right (24px offset)
- Appears when `.app-content` scrolls past 300px
- Smooth scroll to top on click

---

## Design System Notes

### FluentLM Components Used
- `flm-button` (default, primary, icon variants)
- `flm-commandbar` (items, far section, divider)
- `flm-breadcrumb`
- `flm-detailslist` (header, rows, cells, check column)
- `flm-panel` (overlay, header, body, footer, medium size)
- `flm-dialog` (overlay, header, body, footer, light-dismiss)
- `flm-messagebar` (success, error, info, warning)
- `flm-dropdown` (trigger, listbox, options)
- `flm-choicegroup` (radio buttons)
- `flm-checkbox`
- `flm-textfield` (with required variant)
- `flm-searchbox`
- `flm-progress` (determinate + indeterminate)
- `flm-shimmer` (loading placeholders)
- `flm-icon` (SVG path registration via `FluentIcons.register()`)

### Custom Icons Registered
Database, Org, Flow, Processing, TextDocument, Refresh, Tag, Download, FolderOpen, Copy, Help

### Theming
- Two registered themes: `awarity-light` / `awarity-dark`
- Default: `awarity-dark`
- Toggle persisted via `FluentLM.setTheme()` / `FluentLM.getTheme()`
- Semantic color tokens: `--green`, `--yellow`, `--blue`, `--red` for status indicators using `color-mix(in srgb, ... 15%, transparent)` for badge backgrounds

### Planned but Not Yet Implemented Screens
Per the UX strategy doc and nav links: **Home**, **Structure** (classification), **Lenses**, **Workflows**, **Runs**, **Settings**
