# Knowledge Base / Wiki

A team wiki and documentation browser with hierarchical navigation, search, rich article content, and interactive reference features. The kind of internal docs site a team would pin in Microsoft Teams for quick access.

## Components Used

Breadcrumb, Coachmark, DetailsList, HoverCard, Icon, Image, MessageBar, Nav, Persona, Rating, SearchBox, Separator, Stack, TeachingBubble, Text, Tooltip

## Prompt Suggestions

Here are prompts you could use with an LLM (with the FluentLM component reference loaded) to recreate this app:

### Full app prompt

> Build a knowledge base Teams tab with a search box at the top and a breadcrumb trail (Home > Engineering > Onboarding Guide). Add a nav sidebar with article categories: Getting Started (Welcome, Setup Guide, FAQ), Engineering (Onboarding Guide active, Code Standards, CI/CD Pipeline, Architecture Overview), Design (collapsed), Product (collapsed). The main content area shows a wiki article titled "Engineering Onboarding Guide" with an author persona, last-updated date, and an info message bar about the last review date. The article body includes headings, paragraphs, a details list of required tools (VS Code, Git, Node.js, Docker with version numbers), tooltip-annotated technical terms, and an image. Add a hover card on the author name showing their expanded profile. Include a coachmark beacon on the search box with a teaching bubble explaining search. Add a "Was this helpful?" rating section at the bottom. Include a theme toggle.

### Variations to try

> Add a "Related Articles" section at the bottom using document cards linking to other articles in the same category, with preview icons and last-updated dates.

> Include a table of contents sidebar on the right side that highlights the current section as the user scrolls through the article.

> Add a "Feedback" panel that opens with a form for suggesting edits — include a text area for comments, a choice group for feedback type (Correction, Addition, Clarification), and a submit button.
