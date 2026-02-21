# OKR / Goal Tracker

An OKR (Objectives and Key Results) tracking app for managing quarterly goals. Each objective contains key results with progress sliders, confidence ratings, and status indicators — ideal for team alignment in Microsoft Teams.

## Components Used

ChoiceGroup, ComboBox, Dialog, DocumentCard, Dropdown, MessageBar, Nav, Persona, ProgressIndicator, Rating, Separator, Slider, Stack, Text, TextField

## Prompt Suggestions

Here are prompts you could use with an LLM (with the FluentLM component reference loaded) to recreate this app:

### Full app prompt

> Build an OKR tracker Teams tab with a nav sidebar listing quarters (Q1-Q4 2026) and a "My OKRs" link. The main area shows a header with the title "OKR Tracker — Q1 2026", an overall progress bar, and a "New Objective" button. Display 3 objective cards, each containing the objective title, owner persona with presence, a read-only confidence rating (stars), and 2-3 key results. Each key result has a description, a slider for progress (0-100%), a progress indicator bar, and a color-coded status tag (On Track in green, At Risk in amber, Behind in red). Add a warning message bar about at-risk key results. Include a dialog for creating new objectives with fields for title (text field), owner (dropdown), quarter (choice group), and tags (combo box). Show recent activity as document cards at the bottom. Add a theme toggle.

### Variations to try

> Add a "Team Dashboard" view showing all team members' OKRs side by side with persona headers and overall progress bars, making it easy to see the whole team's alignment at a glance.

> Add a details list view as an alternative to the card view, with sortable columns for objective name, owner, progress percentage, confidence rating, and status.

> Include a panel that opens when clicking an objective, showing its full history of progress updates with timestamps and who made each change.
