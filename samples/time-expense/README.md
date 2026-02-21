# Time & Expense Tracker

A time and expense logging app for tracking weekly hours across projects and submitting expense reports. Features detailed timesheets with inline editing, expense cards, and summary views — a staple enterprise app for Microsoft Teams.

## Components Used

CommandBar, DatePicker, DetailsList, DocumentCard, Dropdown, MessageBar, Modal, Persona, Pivot, ProgressIndicator, Separator, Shimmer, SpinButton, Stack, SwatchColorPicker, Text, TextField, TimePicker

## Prompt Suggestions

Here are prompts you could use with an LLM (with the FluentLM component reference loaded) to recreate this app:

### Full app prompt

> Build a time and expense tracker Teams tab. Add a command bar with "New Entry" (primary), "Submit Week", and "Export" on the left, and "Filter" with a date range display on the right. Show a warning message bar about unaccounted hours. Display summary cards showing total hours (32/40), pending approvals, total expenses, and active projects. Use a pivot with Timesheet, Expenses, and Summary tabs. The Timesheet tab has a details list with Date, Project, Task, Hours, and Status columns — show 7 rows of realistic data with color-coded statuses (Approved green, Pending yellow, Draft gray), spin buttons for hours, and shimmer loading rows at the bottom. Include a swatch color picker for project colors. The Expenses tab shows expense items as document cards with amounts and categories. The Summary tab shows a progress bar for total hours and breakdown by project with colored progress indicators. Add a modal for new time entries with a date picker, time pickers for start/end, project dropdown, hours spin button, notes text field, and project color swatch picker. Add a theme toggle.

### Variations to try

> Add a "By Day" view in the Timesheet tab that shows a horizontal stack of day columns (Mon-Fri), each listing that day's time entries as compact cards with project color indicators.

> Include an approval workflow panel that shows submitted timesheets with approve/reject buttons, reviewer personas, and status message bars.

> Add a chart-style summary using stacked progress indicators to visualize hours by project for each day of the week, creating a simple visual breakdown.
