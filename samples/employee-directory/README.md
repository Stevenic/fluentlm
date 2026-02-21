# Employee Directory

A searchable employee directory with persona cards, department filtering, and detail panels. Features a grid of contact cards with presence indicators, a search box with live filtering, and a side panel for full profile views — a common HR/people app for Microsoft Teams.

## Components Used

Breadcrumb, Callout, Dropdown, Facepile, Panel, Persona, Pivot, SearchBox, Separator, Stack, Text, Toggle

## Prompt

> Build an employee directory Teams tab. At the top, add a breadcrumb (Home > People > All Employees) and a horizontal stack with a search box (placeholder "Search by name, title, or department...") and a dropdown to filter by department (All, Engineering, Design, Marketing, Sales, HR). Show a count like "Showing 24 of 142 employees". Display employees in a responsive grid of cards. Each card has a persona (size 72) with name, job title, department, and email. Add a colored dot for presence status (green=Available, yellow=Away, red=Busy, gray=Offline). Give 3 people Available, 2 Away, 1 Busy, 2 Offline. Clicking a card opens a panel with the full profile: large persona at top, then a pivot with About and Team tabs. The About tab shows contact info (email, phone, office location, manager) in a two-column layout. The Team tab shows a facepile of direct reports and a list of their names and titles. Show 8 employee cards total across Engineering, Design, and Marketing. Add a theme toggle.
