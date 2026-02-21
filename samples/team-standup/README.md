# Team Standup Tracker

A daily standup tracking app where team members post what they did, what they're working on, and what's blocking them. Designed to replace the "go around the room" meeting format with an async-friendly Teams tab.

## Components Used

Callout, Facepile, GroupedList, Icon, MessageBar, Persona, Pivot, ProgressIndicator, Separator, Stack, TeachingBubble, Text

## Prompt Suggestions

Here are prompts you could use with an LLM (with the FluentLM component reference loaded) to recreate this app:

### Full app prompt

> Build a daily standup tracker Teams tab. Show a header with the title "Daily Standup", today's date, and a facepile of all team members. Add a progress indicator showing how many team members have reported. Use a pivot with Today, Yesterday, and This Week tabs. In the Today tab, show a grouped list with one group per team member — each group header displays their persona with presence status, and the items below are their standup updates categorized as Done, Doing, or Blocked with color-coded tags. Show warning message bars for members who haven't submitted yet and error message bars for blocked items. Include an "Add Update" button with a callout form for submitting updates, and a teaching bubble that explains how to use the tracker on first visit. Add a theme toggle.

### Variations to try

> Add a "This Week" summary table showing each team member's daily submission status (checkmarks for days they submitted, warnings for missed days) and aggregate counts of done/doing/blocked items.

> Add a search box that filters standup updates across all team members, highlighting matching text.

> Include a panel that slides out when clicking a team member's name, showing their full standup history for the week with timestamps.
