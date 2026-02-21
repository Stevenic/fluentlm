# IT Support Tickets

A help desk ticket tracker with a filterable ticket list, priority badges, status workflow, and ticket detail views. Features a details list with sorting indicators, status pills, assignment personas, and a side panel for ticket details — a standard ITSM app for Microsoft Teams.

## Components Used

CommandBar, DetailsList, Dialog, Dropdown, MessageBar, Modal, Persona, Pivot, ProgressIndicator, SearchBox, Separator, Stack, Text, TextField, Toggle

## Prompt

> Build an IT support ticket tracker Teams tab. Add a command bar with "New Ticket" (primary) and "Assign to Me" on the left, and a search box on the right. Below it show a warning message bar: "5 tickets are past SLA." Add four summary cards in a row: Open (23), In Progress (12), Awaiting Response (8), Resolved This Week (31) — each with a colored left border (blue, yellow, orange, green). Use a pivot with All Tickets, My Tickets, and Unassigned tabs. The All Tickets tab shows a details list with columns: ID (like TKT-1042), Subject, Requester (persona with initials), Priority (badge: Critical=red, High=orange, Medium=yellow, Low=gray), Status (pill: Open=blue, In Progress=yellow, Awaiting Response=orange, Resolved=green), Assigned To (persona), and Created date. Show 8 realistic IT support tickets (password resets, VPN issues, software requests, hardware failures). Clicking a row opens a panel with the ticket detail: subject as heading, status and priority dropdowns, assigned-to persona, a separator, description text, and a "Comments" section with 2 threaded replies showing persona + timestamp + message. Include a "New Ticket" dialog with fields for Subject, Description (multiline), Priority dropdown, and Category dropdown (Hardware, Software, Network, Access, Other). Add a theme toggle.
