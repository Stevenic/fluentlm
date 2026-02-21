# Analytics Dashboard

A data-driven analytics dashboard for a SaaS product, combining Chart.js visualizations with FluentLM components for navigation, filters, and layout. Features line charts for trends, bar charts for comparisons, doughnut charts for breakdowns, and KPI summary cards — a typical executive overview tab for Microsoft Teams.

## Components Used

CommandBar, DocumentCard, Dropdown, MessageBar, Nav, Persona, Pivot, ProgressIndicator, Separator, Stack, Text, Toggle

## External Libraries

- [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) — line, bar, and doughnut charts

## Prompt

> Build an analytics dashboard Teams tab. Include a left nav with sections for Overview, Acquisition, Engagement, and Revenue. The main area starts with a command bar with a date range dropdown (Last 7 days / 30 days / 90 days) on the left and an "Export" button on the right. Show a success message bar saying "Dashboard updated 2 minutes ago." Below that, display four summary cards in a horizontal stack: Total Users (12,847, +8.3%), Active Sessions (3,421, +12.1%), Conversion Rate (3.2%, -0.4%), and Revenue ($48,290, +15.7%) — each with a small trend indicator. Use a pivot with Overview, Acquisition, and Revenue tabs. The Overview tab has two rows: first row is a Chart.js line chart (daily active users over 30 days) next to a doughnut chart (traffic sources: Direct 35%, Organic 28%, Referral 22%, Social 15%). Second row is a bar chart (signups by week) next to a details-style top pages list showing page name, views, and avg time. Style the charts to match FluentLM theme colors using var(--themePrimary), var(--themeDarkAlt), var(--themeSecondary), and var(--themeTertiary). Add a theme toggle.
