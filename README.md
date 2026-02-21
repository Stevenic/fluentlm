# FluentLM

A pure HTML/CSS/JS component library based on [Fluent UI React](https://github.com/microsoft/fluentui/tree/master/packages/react) v8, designed to be used by LLMs when generating web pages. No React, no build tools, no framework — just static files that any model can reference to produce polished Fluent UI interfaces.

The library implements ~98% of the Fluent UI v8 component set (46 components across buttons, inputs, navigation, data display, surfaces, feedback, layout, and pickers) with full light/dark theme support.

## Why?

LLMs can generate HTML, but the output usually looks unstyled or generic. FluentLM gives a model everything it needs — a component reference doc and a CSS/JS bundle — to produce professional-looking pages that match Microsoft's Fluent design system, with no framework overhead or build step.

## Quick Start

### 1. Copy the dist folder

Run the build (requires Node.js):

```bash
npm install
npm run build
```

This produces a `dist/` folder containing:

```
dist/
├── fluentlm.css              # Combined CSS (all components)
├── fluentlm.min.css           # Minified CSS
├── fluentlm.js                # Combined JS (all components)
├── fluentlm.min.js            # Minified JS
├── theme-light.css            # Light theme
├── theme-dark.css             # Dark theme
└── fluentlm-instructions.md    # Component reference for LLM prompts
```

Copy the `dist/` folder into your project and serve it from your web server or host on a CDN.

### 2. Include in your HTML

```html
<html lang="en" class="fluentlm">
<head>
  <link rel="stylesheet" href="/dist/theme-light.css">
  <link rel="stylesheet" href="/dist/theme-dark.css">
  <link rel="stylesheet" href="/dist/fluentlm.min.css">
</head>
<body>
  <!-- your content -->
  <script src="/dist/fluentlm.min.js"></script>
</body>
</html>
```

### 3. Add the component reference to your LLM prompt

The file `dist/fluentlm-instructions.md` (~14k tokens) is a complete reference of every component's HTML structure, CSS classes, and available variants. In includes style information and notes to help the LLM generate proper HTML and avoid common mistakes. Include it in your system prompt or context so the model knows how to use the library.

Add instructions telling the model to use FluentLM components when generating HTML. Here's an example:

```
You have access to the FluentLM component library with a rich collection of components that use Fluent v8 classes and styles. 
When building any HTML page or UI, use the FluentLM components documented in the <fluentlm-instructions> below.
Follow the structure of the component examples, adhear to any implementation notes, and only use documented classes and variables.

All pages should have the following css files in their header:

<link rel="stylesheet" href="{root}/dist/theme-light.css">
<link rel="stylesheet" href="{root}/dist/theme-dark.css">
<link rel="stylesheet" href="{root}/dist/fluentlm.min.css">

And the following js script to the pages body:

<script src="{root}/dist/fluentlm.min.js"></script>

Always wrap the page in <html class="fluentlm"> for the light theme or <html class="fluentlm fluent-dark"> for a dark theme.
You can switch themes at runtime using:

```js
FluentLM.setTheme('dark');
FluentLM.setTheme('light');
```

<fluentlm-instructions>
{paste contents of fluentlm-instructions.md here}
</fluentlm-instructions>
```

### Example Prompt

> Build me a settings page with a nav sidebar on the left containing links for
> "General", "Notifications", and "Privacy". The main content area should have
> a heading, a text field for display name, a toggle for email notifications,
> a dropdown for language selection (English, Spanish, French), and a primary
> "Save" button with a "Cancel" default button next to it. Include an info
> message bar at the top that says "Your changes will take effect after saving."

With the component reference in context, the model will generate a complete page using `flm-stack` for layout, `flm-nav` for the sidebar, `flm-textfield`, `flm-toggle`, `flm-dropdown`, `flm-button`, and `flm-messagebar` — all correctly structured and styled.

## Samples

The `samples/` folder contains Microsoft Teams tab apps that demonstrate real-world usage of the library. Each sample includes a README with the prompt you could use to recreate it.

| Sample | Description | Key Components |
|--------|-------------|----------------|
| [Project Dashboard](samples/project-dashboard/) | Sprint task board with kanban columns, list view, and task editing | CommandBar, DetailsList, DocumentCard, Dialog, Nav, Panel, Persona, Pivot |
| [Team Standup Tracker](samples/team-standup/) | Async daily standup app with per-person grouped updates | Callout, Facepile, GroupedList, Persona, Pivot, ProgressIndicator, TeachingBubble |
| [OKR / Goal Tracker](samples/okr-tracker/) | Quarterly objectives and key results with progress tracking | ChoiceGroup, ComboBox, Dialog, DocumentCard, Nav, Rating, Slider, ProgressIndicator |
| [Knowledge Base / Wiki](samples/knowledge-base/) | Internal docs browser with search, article content, and annotations | Breadcrumb, Coachmark, DetailsList, HoverCard, Nav, Rating, SearchBox, Tooltip |
| [Time & Expense Tracker](samples/time-expense/) | Weekly timesheet and expense logging with inline editing | DatePicker, DetailsList, Modal, Shimmer, SpinButton, SwatchColorPicker, TimePicker |
| [Analytics Dashboard](samples/analytics-dashboard/) | SaaS metrics with Chart.js visualizations and KPI cards | CommandBar, DocumentCard, Dropdown, Nav, Pivot, ProgressIndicator + Chart.js |
| [Employee Directory](samples/employee-directory/) | Searchable people browser with persona cards and profiles | Breadcrumb, Callout, Dropdown, Facepile, Panel, Persona, Pivot, SearchBox |
| [IT Support Tickets](samples/support-tickets/) | Help desk ticket tracker with status workflow and priorities | CommandBar, DetailsList, Dialog, Dropdown, Modal, Persona, Pivot, SearchBox |

To run the samples locally, build first (`npm run build`), then serve the repo root with any static server:

```bash
npx serve .
```

Open `http://localhost:3000/samples/project-dashboard/` (or any sample path) in your browser.

## Theming

FluentLM supports light and dark themes via CSS custom properties. The active theme is controlled by the class on `<html>`:

```html
<html class="fluentlm">          <!-- light theme (default) -->
<html class="fluentlm fluent-dark">  <!-- dark theme -->
```

Switch at runtime with JavaScript:

```js
FluentLM.setTheme('dark');
FluentLM.setTheme('light');
```

## How It Works

- **CSS classes** handle all visual rendering — no JS required for basic components
- **`data-*` attributes** trigger JS enhancements (icon injection, dropdown menus, split buttons)
- **Native HTML elements** are used wherever possible (`<button>`, `<input>`, `<select>`, `<a>`)
- Components follow BEM-style naming: `flm-{component}`, `flm-{component}--{variant}`

## License

ISC
