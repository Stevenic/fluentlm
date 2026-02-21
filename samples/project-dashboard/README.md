# Project Dashboard

A project management dashboard for tracking tasks across a sprint. Features a kanban board view, list view, task editing panel, and deletion confirmation — the kind of app a team would pin as a Microsoft Teams tab.

## Components Used

CommandBar, DetailsList, DocumentCard, Dialog, Dropdown, DatePicker, Facepile, MessageBar, Nav, Panel, Persona, Pivot, ProgressIndicator, SearchBox, Separator, Stack, Text, TextField, Toggle

## Prompt Suggestions

Here are prompts you could use with an LLM (with the FluentLM component reference loaded) to recreate this app:

### Full app prompt

> Build a project dashboard Teams tab with a nav sidebar listing project sections (Overview, Tasks, Files, Wiki). The main area should have a command bar with New Task, Edit, Delete, Filter, and Settings actions. Show an info message bar about the current sprint deadline. Add a pivot with Board View, List View, and Timeline tabs. Board View shows three columns (To Do, In Progress, Done) with task cards that display the task name, assignee persona with presence, priority tag, and due date. List View shows the same data in a DetailsList table. Include a slide-out panel for editing task details with text fields, dropdowns, and a date picker, plus a delete confirmation dialog. Add a theme toggle.

### Variations to try

> Add a search box to the command bar that filters tasks in both board and list views.

> Add a "Sprint Summary" tab to the pivot showing progress indicators for each team member's completed vs. assigned tasks, with persona avatars and completion percentages.

> Replace the board view columns with a grouped list where tasks are grouped by assignee, each group showing the person's persona as the header with their task count.
