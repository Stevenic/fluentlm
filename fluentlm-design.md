# FluentLM — Design Document

A lightweight, client-side-only implementation of Microsoft Fluent UI v8 using plain HTML, CSS, and vanilla JavaScript. No React, no server-side framework, no build step required.

---

## Goals

1. **Pure client-side** — runs in any modern browser with a single `<script>` include.
2. **Minimal HTML surface** — components use native elements, CSS classes for visual variants, and `data-*` only when JS must transform the DOM. Designed to be generated and maintained by LLMs with minimal token overhead.
3. **CSS-only theming** — light and dark themes expressed as CSS custom properties; switchable at runtime by toggling a class on `<html>`.
4. **Faithful to Fluent v8** — visual fidelity to the official library's design tokens, spacing, typography, and color palette.
5. **Progressive enhancement** — components render correctly with CSS alone; JS adds interactivity (icons, split buttons, dropdowns) on top.

---

## 1. Fluent UI v8 Component Inventory

All components below are sourced from `@fluentui/react@8` (`node_modules/@fluentui/react/lib-commonjs/components/`).

### 1.1 Basic Inputs

| Component | Variants / Sub-components | Key Props |
|-----------|--------------------------|-----------|
| **Button** | DefaultButton, PrimaryButton, CompoundButton, IconButton, ActionButton, CommandBarButton, CommandButton, SplitButton, MessageBarButton | text, iconProps, disabled, checked, split, href |
| **Checkbox** | — | label, checked, disabled, indeterminate |
| **Toggle** | — | label, checked, disabled, onText, offText |
| **ChoiceGroup** | ChoiceGroupOption | options[], selectedKey, disabled |
| **TextField** | MaskedTextField | label, value, placeholder, multiline, errorMessage, prefix, suffix |
| **SearchBox** | — | placeholder, value, underlined, disableAnimation |
| **Slider** | — | label, min, max, value, step, vertical, showValue |
| **SpinButton** | — | label, min, max, value, step, iconProps |
| **Rating** | — | min, max, rating, size, allowZeroStars |

### 1.2 Navigation

| Component | Variants / Sub-components | Key Props |
|-----------|--------------------------|-----------|
| **Nav** | — | groups[], selectedKey, isOnTop |
| **Breadcrumb** | — | items[], maxDisplayedItems, overflowIndex |
| **Pivot** | PivotItem | selectedKey, linkFormat, linkSize |
| **CommandBar** | — | items[], overflowItems[], farItems[] |
| **ContextualMenu** | ContextualMenuItem | items[], target, directionalHint |
| **OverflowSet** | — | items[], overflowItems[] |

### 1.3 Data Display

| Component | Variants / Sub-components | Key Props |
|-----------|--------------------------|-----------|
| **DetailsList** | DetailsHeader, DetailsRow, DetailsRowCheck, DetailsRowFields, DetailsColumn, DetailsFooter | items[], columns[], selectionMode, layoutMode, checkboxVisibility |
| **List** | — | items[], onRenderCell, getPageSpecification |
| **GroupedList** | GroupHeader, GroupFooter, GroupShowAll, GroupSpacer, GroupedListSection, GroupedListV2 | items[], groups[], selectionMode |
| **DocumentCard** | DocumentCardActions, DocumentCardActivity, DocumentCardDetails, DocumentCardLocation, DocumentCardPreview, DocumentCardImage, DocumentCardTitle, DocumentCardLogo, DocumentCardStatus | type (normal/compact) |

### 1.4 Surfaces

| Component | Variants / Sub-components | Key Props |
|-----------|--------------------------|-----------|
| **Dialog** | DialogContent, DialogFooter | hidden, dialogContentProps, modalProps, type (normal/largeHeader/close) |
| **Panel** | — | isOpen, type (smallFixedFar/medium/large/etc), headerText, isLightDismiss |
| **Modal** | — | isOpen, isBlocking, containerClassName |
| **Callout** | CalloutContent, FocusTrapCallout | target, directionalHint, gapSpace, isBeakVisible |
| **Popup** | — | role, shouldRestoreFocus |

### 1.5 Feedback & Status

| Component | Variants / Sub-components | Key Props |
|-----------|--------------------------|-----------|
| **MessageBar** | — | messageBarType (info/error/blocked/severeWarning/success/warning), isMultiline, truncated |
| **Spinner** | — | size (xSmall/small/medium/large), label, labelPosition |
| **ProgressIndicator** | — | label, description, percentComplete, barHeight |
| **Shimmer** | ShimmerLine, ShimmerCircle, ShimmerGap, ShimmerElementsGroup | isDataLoaded, shimmerElements[], width |
| **Coachmark** | — | target, positioningContainerProps |
| **HoverCard** | ExpandingCard, PlainCard | target, type (expanding/plain), cardDismissDelay |
| **TeachingBubble** | TeachingBubbleContent | target, headline, hasCloseButton, primaryButtonProps, secondaryButtonProps |

### 1.6 Layout

| Component | Variants / Sub-components | Key Props |
|-----------|--------------------------|-----------|
| **Stack** | StackItem | horizontal, verticalAlign, horizontalAlign, gap, padding, wrap |
| **Separator** | — | vertical, alignContent |
| **Divider** | VerticalDivider | — |
| **ScrollablePane** | — | scrollContainerFocus, scrollContainerAriaLabel |
| **Sticky** | — | stickyPosition (header/footer/both), stickyClassName |
| **ResizeGroup** | — | data, onReduceData, onGrowData |

### 1.7 Pickers & Selection

| Component | Variants / Sub-components | Key Props |
|-----------|--------------------------|-----------|
| **DatePicker** | — | value, placeholder, firstDayOfWeek, strings, minDate, maxDate |
| **Calendar** | CalendarDay, CalendarMonth, CalendarPicker, CalendarYear | value, today, dateRangeType, firstDayOfWeek |
| **CalendarDayGrid** | CalendarGridDayCell, CalendarGridRow, CalendarMonthHeaderRow | selectedDate, navigatedDate |
| **TimePicker** | — | value, timeRange, increments |
| **WeeklyDayPicker** | — | initialDate, strings |
| **ColorPicker** | ColorRectangle, ColorSlider | color, alphaType |
| **SwatchColorPicker** | ColorPickerGridCell | colorCells[], selectedId, columnCount |
| **Dropdown** | — | options[], selectedKey, multiSelect, placeholder |
| **ComboBox** | VirtualizedComboBox | options[], selectedKey, allowFreeform, autoComplete |
| **Pickers (Tag/People)** | BasePicker, TagPicker, PeoplePicker, Suggestions, SuggestionsItem, AutoFill | onResolveSuggestions, selectedItems, itemLimit |
| **ExtendedPicker** | ExtendedPeoplePicker | onResolveSuggestions, selectedItems |
| **FloatingPicker** | FloatingPeoplePicker, SuggestionsStore, SuggestionsControl, SuggestionsCore | onResolveSuggestions, targetElement |
| **SelectedItemsList** | SelectedPeopleList, ExtendedSelectedItem | selectedItems, onRenderItem |

### 1.8 Content & Display

| Component | Variants / Sub-components | Key Props |
|-----------|--------------------------|-----------|
| **Icon** | FontIcon, ImageIcon | iconName, imageProps |
| **Image** | — | src, alt, imageFit (center/contain/cover/none), maximizeFrame |
| **Persona** | PersonaCoin | text, secondaryText, tertiaryText, size, presence, imageUrl |
| **Text** | — | variant (tiny/small/medium/large/xLarge/xxLarge/mega), block, nowrap |
| **Label** | — | required, disabled, htmlFor |
| **Link** | — | href, target, disabled |
| **Tooltip** | TooltipHost | content, delay, directionalHint |
| **ActivityItem** | — | activityDescription, comments, timeStamp, activityPersonas |
| **Facepile** | — | personas[], maxDisplayablePersonas, overflowButtonType |
| **Check** | — | checked |

### 1.9 Utilities & Infrastructure

| Component | Description |
|-----------|-------------|
| **FocusTrapZone** | Traps keyboard focus within a boundary (modals, panels) |
| **Layer** / **LayerHost** | Portal rendering — renders children at document root |
| **Overlay** | Semi-transparent backdrop behind modals/panels |
| **Keytip** / **KeytipData** / **KeytipLayer** | Keyboard shortcut tooltips (Alt key hints) |
| **MarqueeSelection** | Click-and-drag rectangle selection |
| **Announced** | Screen reader announcements for dynamic content |
| **Fabric** | Root container that provides Fluent theming context |
| **ThemeGenerator** | Utility for generating custom color themes from a primary color |
| **Autofill** | Autocomplete input control used by pickers |

---

## 2. Design Token System

All values sourced from `@fluentui/theme`.

### 2.1 Color Palette

#### Brand / Theme Colors
| Token | Light Value | CSS Variable |
|-------|-------------|--------------|
| themeDarker | `#004578` | `--themeDarker` |
| themeDark | `#005a9e` | `--themeDark` |
| themeDarkAlt | `#106ebe` | `--themeDarkAlt` |
| themePrimary | `#0078d4` | `--themePrimary` |
| themeSecondary | `#2b88d8` | `--themeSecondary` |
| themeTertiary | `#71afe5` | `--themeTertiary` |
| themeLight | `#c7e0f4` | `--themeLight` |
| themeLighter | `#deecf9` | `--themeLighter` |
| themeLighterAlt | `#eff6fc` | `--themeLighterAlt` |

#### Neutral Colors
| Token | Value | CSS Variable |
|-------|-------|--------------|
| black | `#000000` | `--black` |
| neutralDark | `#201f1e` | `--neutralDark` |
| neutralPrimary | `#323130` | `--neutralPrimary` |
| neutralPrimaryAlt | `#3b3a39` | `--neutralPrimaryAlt` |
| neutralSecondary | `#605e5c` | `--neutralSecondary` |
| neutralSecondaryAlt | `#8a8886` | `--neutralSecondaryAlt` |
| neutralTertiary | `#a19f9d` | `--neutralTertiary` |
| neutralTertiaryAlt | `#c8c6c4` | `--neutralTertiaryAlt` |
| neutralQuaternary | `#d2d0ce` | `--neutralQuaternary` |
| neutralQuaternaryAlt | `#e1dfdd` | `--neutralQuaternaryAlt` |
| neutralLight | `#edebe9` | `--neutralLight` |
| neutralLighter | `#f3f2f1` | `--neutralLighter` |
| neutralLighterAlt | `#faf9f8` | `--neutralLighterAlt` |
| white | `#ffffff` | `--white` |

#### Status Colors
| Token | Value | CSS Variable |
|-------|-------|--------------|
| red | `#e81123` | `--red` |
| redDark | `#a4262c` | `--redDark` |
| orange | `#d83b01` | `--orange` |
| orangeLight | `#ea4300` | `--orangeLight` |
| yellow | `#ffb900` | `--yellow` |
| yellowDark | `#d29200` | `--yellowDark` |
| green | `#107c10` | `--green` |
| greenDark | `#004b1c` | `--greenDark` |
| teal | `#008272` | `--teal` |
| blue | `#0078d4` | `--blue` |
| blueDark | `#002050` | `--blueDark` |
| purple | `#5c2d91` | `--purple` |
| magenta | `#b4009e` | `--magenta` |

### 2.2 Semantic Colors

These map intent to palette values and flip between light/dark themes.

#### Backgrounds
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| bodyBackground | `#ffffff` | `#323130` | `--bodyBackground` |
| bodyStandoutBackground | `#faf9f8` | `#201f1e` | `--bodyStandoutBackground` |
| bodyFrameBackground | `#ffffff` | `#323130` | `--bodyFrameBackground` |
| defaultStateBackground | `#faf9f8` | `#201f1e` | `--defaultStateBackground` |
| disabledBackground | `#f3f2f1` | `#201f1e` | `--disabledBackground` |

#### Text
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| bodyText | `#323130` | `#f3f2f1` | `--bodyText` |
| bodySubtext | `#605e5c` | `#c8c6c4` | `--bodySubtext` |
| disabledText | `#a19f9d` | `#605e5c` | `--disabledText` |
| errorText | `#a4262c` | `#F1707B` | `--errorText` |

#### Links
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| link | `#0078d4` | `#6CB8F6` | `--link` |
| linkHovered | `#004578` | `#82C7FF` | `--linkHovered` |

#### Buttons
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| buttonBackground | `#ffffff` | `#323130` | `--buttonBackground` |
| buttonBackgroundHovered | `#f3f2f1` | `#3b3a39` | `--buttonBackgroundHovered` |
| buttonBackgroundPressed | `#edebe9` | `#484644` | `--buttonBackgroundPressed` |
| buttonText | `#323130` | `#f3f2f1` | `--buttonText` |
| primaryButtonBackground | `#0078d4` | `#0078d4` | `--primaryButtonBackground` |
| primaryButtonBackgroundHovered | `#106ebe` | `#106ebe` | `--primaryButtonBackgroundHovered` |
| primaryButtonText | `#ffffff` | `#ffffff` | `--primaryButtonText` |

#### Inputs
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| inputBackground | `#ffffff` | `#323130` | `--inputBackground` |
| inputBorder | `#605e5c` | `#a19f9d` | `--inputBorder` |
| inputBorderHovered | `#323130` | `#f3f2f1` | `--inputBorderHovered` |
| inputText | `#323130` | `#f3f2f1` | `--inputText` |
| inputPlaceholderText | `#605e5c` | `#c8c6c4` | `--inputPlaceholderText` |

#### Lists & Menus
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| listBackground | `#ffffff` | `#323130` | `--listBackground` |
| listItemBackgroundHovered | `#f3f2f1` | `#3b3a39` | `--listItemBackgroundHovered` |
| listItemBackgroundChecked | `#edebe9` | `#484644` | `--listItemBackgroundChecked` |
| menuBackground | `#ffffff` | `#323130` | `--menuBackground` |
| menuItemBackgroundHovered | `#f3f2f1` | `#3b3a39` | `--menuItemBackgroundHovered` |

#### Status Backgrounds
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| infoBackground | `#f3f2f1` | `#323130` | `--infoBackground` |
| errorBackground | `#FDE7E9` | `#442726` | `--errorBackground` |
| warningBackground | `#FFF4CE` | `#433519` | `--warningBackground` |
| severeWarningBackground | `#FED9CC` | `#4F2A0F` | `--severeWarningBackground` |
| successBackground | `#DFF6DD` | `#393D1B` | `--successBackground` |
| blockingBackground | `#FDE7E9` | `#442726` | `--blockingBackground` |

#### Status Icons
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| infoIcon | `#605e5c` | `#C8C6C4` | `--infoIcon` |
| errorIcon | `#A80000` | `#F1707B` | `--errorIcon` |
| warningIcon | `#797775` | `#C8C6C4` | `--warningIcon` |
| severeWarningIcon | `#D83B01` | `#FCE100` | `--severeWarningIcon` |
| successIcon | `#107C10` | `#92C353` | `--successIcon` |
| blockingIcon | `#FDE7E9` | `#442726` | `--blockingIcon` |

### 2.3 Typography

#### Font Family
```
'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif
```

#### Font Size Ramp
| Name | Size | Weight | CSS Variable |
|------|------|--------|--------------|
| tiny | 10px | 400 | `--fontSizeTiny` |
| xSmall | 10px | 400 | `--fontSizeXSmall` |
| small | 12px | 400 | `--fontSizeSmall` |
| smallPlus | 12px | 400 | `--fontSizeSmallPlus` |
| medium | 14px | 400 | `--fontSizeMedium` |
| mediumPlus | 16px | 400 | `--fontSizeMediumPlus` |
| large | 18px | 400 | `--fontSizeLarge` |
| xLarge | 20px | 600 | `--fontSizeXLarge` |
| xxLarge | 28px | 600 | `--fontSizeXXLarge` |
| superLarge | 42px | 600 | `--fontSizeSuperLarge` |
| mega | 68px | 600 | `--fontSizeMega` |

#### Font Weights
| Name | Value | CSS Variable |
|------|-------|--------------|
| light | 100 | `--fontWeightLight` |
| semilight | 300 | `--fontWeightSemilight` |
| regular | 400 | `--fontWeightRegular` |
| semibold | 600 | `--fontWeightSemibold` |
| bold | 700 | `--fontWeightBold` |

### 2.4 Spacing

| Token | Value | CSS Variable |
|-------|-------|--------------|
| s2 | 4px | `--spacingS2` |
| s1 | 8px | `--spacingS1` |
| m | 16px | `--spacingM` |
| l1 | 20px | `--spacingL1` |
| l2 | 32px | `--spacingL2` |

### 2.5 Effects

#### Elevation / Shadows
| Token | Value | CSS Variable |
|-------|-------|--------------|
| elevation4 | `0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)` | `--elevation4` |
| elevation8 | `0 3.2px 7.2px 0 rgba(0,0,0,.132), 0 0.6px 1.8px 0 rgba(0,0,0,.108)` | `--elevation8` |
| elevation16 | `0 6.4px 14.4px 0 rgba(0,0,0,.132), 0 1.2px 3.6px 0 rgba(0,0,0,.108)` | `--elevation16` |
| elevation64 | `0 25.6px 57.6px 0 rgba(0,0,0,.22), 0 4.8px 14.4px 0 rgba(0,0,0,.18)` | `--elevation64` |

#### Border Radius
| Token | Value | CSS Variable |
|-------|-------|--------------|
| roundedCorner2 | 2px | `--roundedCorner2` |
| roundedCorner4 | 4px | `--roundedCorner4` |
| roundedCorner6 | 6px | `--roundedCorner6` |

### 2.6 Motion / Animation

#### Durations
| Token | Value | CSS Variable |
|-------|-------|--------------|
| duration1 | 100ms | `--duration1` |
| duration2 | 200ms | `--duration2` |
| duration3 | 300ms | `--duration3` |
| duration4 | 400ms | `--duration4` |

#### Easing Curves
| Name | Value | CSS Variable |
|------|-------|--------------|
| accelerate | `cubic-bezier(0.9, 0.1, 1, 0.2)` | `--easeAccelerate` |
| decelerate | `cubic-bezier(0.1, 0.9, 0.2, 1)` | `--easeDecelerate` |
| linear | `cubic-bezier(0, 0, 1, 1)` | `--easeLinear` |
| standard | `cubic-bezier(0.8, 0, 0.2, 1)` | `--easeStandard` |

---

## 3. Component Priority (Implementation Order)

Grouped into tiers by how commonly they appear in typical LOB applications.

### Tier 1 — Core (implement first)
1. Stack / StackItem (layout foundation)
2. Text
3. Label
4. Button (Default, Primary, Icon, Compound)
5. Link
6. Icon / FontIcon
7. TextField
8. Checkbox
9. Toggle
10. Dropdown
11. Separator / Divider
12. Spinner
13. MessageBar

### Tier 2 — Common
14. Dialog / DialogContent / DialogFooter
15. Panel
16. Modal / Overlay
17. Callout
18. CommandBar
19. Nav
20. Breadcrumb
21. Pivot / PivotItem
22. DetailsList (basic)
23. SearchBox
24. ContextualMenu
25. ProgressIndicator
26. Tooltip / TooltipHost
27. Persona / PersonaCoin
28. Image

### Tier 3 — Extended
29. ComboBox
30. DatePicker / Calendar
31. ChoiceGroup
32. Slider
33. SpinButton
34. Rating
35. Shimmer
36. DocumentCard family
37. GroupedList
38. Facepile
39. List (virtualized)
40. TeachingBubble
41. HoverCard
42. Coachmark
43. SwatchColorPicker / ColorPicker

### Tier 4 — Specialized (implement as needed)
44. TagPicker / PeoplePicker
45. TimePicker
46. WeeklyDayPicker
47. MarqueeSelection
48. ScrollablePane / Sticky
49. FocusTrapZone
50. Layer / LayerHost
51. Keytip system
52. ResizeGroup
53. OverflowSet
54. Announced
55. ThemeGenerator

---

## 4. Architecture

### Design Principle: Hybrid Component API

Three rules keep HTML tight for LLM generation:

| Layer | Mechanism | Examples |
|-------|-----------|---------|
| **Native HTML** | Use the real element + built-in attributes | `<button disabled>`, `<a href>`, `<input type required>` |
| **CSS classes** | Visual variant = modifier class (BEM-ish) | `.flm-button--primary`, `.flm-stack--horizontal` |
| **`data-*` attributes** | Only when JS must transform the DOM | `data-icon="Add"`, `data-split` |

> **Why?** Classes are the cheapest way to express variants — no JS needed to
> render, no parser overhead, and an LLM can add/remove a class in one token.
> `data-*` is reserved for things CSS can't do (inject an SVG icon, wire a
> dropdown menu, etc.).

### File Structure
```
fluentlm/
├── css/
│   ├── tokens.css            # CSS custom properties (shared tokens)
│   ├── theme-light.css       # Light theme semantic overrides
│   ├── theme-dark.css        # Dark theme semantic overrides
│   ├── base.css              # Reset + global styles + typography
│   └── components/
│       ├── button.css
│       ├── textfield.css
│       ├── checkbox.css
│       └── ...               # One CSS file per component
├── js/
│   ├── fluentlm.js       # Main entry — DOM walker + renderer
│   ├── theme.js              # Theme switching logic
│   └── components/
│       ├── button.js         # Icon injection, split-button wiring
│       ├── textfield.js      # Label/error DOM scaffolding
│       ├── checkbox.js
│       └── ...               # One JS file per component
├── icons/
│   └── fluent-icons.css      # Icon font or SVG sprite
├── index.html                # Demo / test page
├── DESIGN.md                 # This file
└── package.json
```

### JS Runtime (page-load lifecycle)
```
1. DOMContentLoaded fires
2. fluentlm.js walks document.querySelectorAll('[data-icon], [data-split], ...')
3. For each matched element, the corresponding component JS:
   a. Injects child DOM that CSS alone can't create (SVG icons, generated wrappers)
   b. Attaches event listeners (split-button menus, toggle state, etc.)
   c. Sets ARIA attributes where needed
4. Theme.init() reads prefers-color-scheme and applies the class
```

> Components without `data-*` attributes need **zero JS** — CSS classes alone
> handle all visual rendering. This means a page with only buttons, text, and
> layout works with the CSS files and no script tag.

### Theme Switching
```html
<html class="fluentlm">       <!-- or "fluent-dark" -->
```
```js
FluentLM.setTheme('dark');      // toggles class on <html>
```

---

## 5. Component HTML Reference

How each Tier 1 component is expressed in HTML. This is the contract an LLM
follows when generating pages.

### 5.1 Button

```html
<!-- Default -->
<button class="flm-button">Label</button>

<!-- Primary -->
<button class="flm-button flm-button--primary">Save</button>

<!-- With icon (JS injects SVG from data-icon) -->
<button class="flm-button" data-icon="Add">New Item</button>

<!-- Primary + icon -->
<button class="flm-button flm-button--primary" data-icon="Save">Save</button>

<!-- Icon-only (must have aria-label) -->
<button class="flm-button flm-button--icon" data-icon="Settings" aria-label="Settings"></button>

<!-- Compound (two lines) -->
<button class="flm-button flm-button--compound">
  <span class="flm-button-label">Send Mail</span>
  <span class="flm-button-description">Via Outlook</span>
</button>

<!-- Split (JS wires the dropdown caret) -->
<button class="flm-button flm-button--primary" data-split>Save</button>

<!-- As a link -->
<a class="flm-button flm-button--primary" href="/create">Create</a>

<!-- Disabled — native attribute -->
<button class="flm-button" disabled>Disabled</button>
```

### 5.2 Text

```html
<span class="flm-text">Default (medium) text</span>
<span class="flm-text flm-text--large">Large text</span>
<span class="flm-text flm-text--xxLarge">Page heading</span>
<span class="flm-text flm-text--small flm-text--secondary">Caption</span>
<p class="flm-text flm-text--block">Block-level paragraph.</p>
<span class="flm-text flm-text--nowrap">Truncates with ellipsis…</span>
```

Sizes: `--tiny`, `--xSmall`, `--small`, `--smallPlus`, `--medium` (default),
`--mediumPlus`, `--large`, `--xLarge`, `--xxLarge`, `--superLarge`, `--mega`.

Modifiers: `--secondary` (subdued color), `--disabled`, `--error`,
`--success`, `--block`, `--nowrap`, `--semibold`, `--bold`.

### 5.3 Label

```html
<label class="flm-label" for="name">Name</label>
<label class="flm-label flm-label--required" for="email">Email</label>
<label class="flm-label flm-label--disabled" for="ro">Read-only</label>
```

### 5.4 Link

```html
<a class="flm-link" href="/page">Standard link</a>
<a class="flm-link flm-link--disabled">Disabled link</a>
```

### 5.5 Icon

```html
<!-- JS resolves data-icon to SVG/font glyph -->
<i class="flm-icon" data-icon="Mail"></i>
<i class="flm-icon flm-icon--large" data-icon="Settings"></i>
```

Sizes: `--small` (12px), default (16px), `--large` (20px).

### 5.6 TextField

```html
<!-- Basic -->
<div class="flm-textfield">
  <label class="flm-label" for="f1">Name</label>
  <input class="flm-textfield-input" id="f1" placeholder="Enter name">
</div>

<!-- Required -->
<div class="flm-textfield flm-textfield--required">
  <label class="flm-label flm-label--required" for="f2">Email</label>
  <input class="flm-textfield-input" id="f2" type="email" required>
</div>

<!-- With error -->
<div class="flm-textfield flm-textfield--error">
  <label class="flm-label" for="f3">Age</label>
  <input class="flm-textfield-input" id="f3" value="-1">
  <span class="flm-textfield-error">Must be a positive number</span>
</div>

<!-- Multiline -->
<div class="flm-textfield">
  <label class="flm-label" for="f4">Bio</label>
  <textarea class="flm-textfield-input" id="f4" rows="4"></textarea>
</div>

<!-- With prefix/suffix -->
<div class="flm-textfield">
  <label class="flm-label" for="f5">URL</label>
  <div class="flm-textfield-wrapper">
    <span class="flm-textfield-prefix">https://</span>
    <input class="flm-textfield-input" id="f5">
  </div>
</div>

<!-- Disabled — native attribute -->
<div class="flm-textfield flm-textfield--disabled">
  <label class="flm-label flm-label--disabled" for="f6">Locked</label>
  <input class="flm-textfield-input" id="f6" disabled>
</div>
```

### 5.7 Checkbox

```html
<label class="flm-checkbox">
  <input type="checkbox" class="flm-checkbox-input">
  <span class="flm-checkbox-mark"></span>
  <span class="flm-checkbox-label">Accept terms</span>
</label>

<!-- Checked -->
<label class="flm-checkbox">
  <input type="checkbox" class="flm-checkbox-input" checked>
  <span class="flm-checkbox-mark"></span>
  <span class="flm-checkbox-label">Checked</span>
</label>

<!-- Disabled -->
<label class="flm-checkbox flm-checkbox--disabled">
  <input type="checkbox" class="flm-checkbox-input" disabled>
  <span class="flm-checkbox-mark"></span>
  <span class="flm-checkbox-label">Disabled</span>
</label>
```

### 5.8 Toggle

```html
<label class="flm-toggle">
  <span class="flm-toggle-label">Notifications</span>
  <input type="checkbox" class="flm-toggle-input">
  <span class="flm-toggle-track">
    <span class="flm-toggle-thumb"></span>
  </span>
  <span class="flm-toggle-state-text" data-on="On" data-off="Off"></span>
</label>
```

### 5.9 Dropdown

```html
<div class="flm-dropdown">
  <label class="flm-label" for="d1">Country</label>
  <select class="flm-dropdown-select" id="d1">
    <option value="">Select…</option>
    <option value="us">United States</option>
    <option value="gb">United Kingdom</option>
  </select>
</div>
```

### 5.10 Stack (Layout)

```html
<!-- Vertical stack (default) -->
<div class="flm-stack" style="gap: var(--spacingS1)">
  <div>Row 1</div>
  <div>Row 2</div>
</div>

<!-- Horizontal stack -->
<div class="flm-stack flm-stack--horizontal" style="gap: var(--spacingM)">
  <div class="flm-stack-item flm-stack-item--grow">Fills remaining space</div>
  <div class="flm-stack-item">Fixed</div>
</div>

<!-- Centered both axes -->
<div class="flm-stack flm-stack--horizontal flm-stack--center" style="gap: var(--spacingS1)">
  <div>Centered</div>
</div>

<!-- Wrap -->
<div class="flm-stack flm-stack--horizontal flm-stack--wrap" style="gap: var(--spacingS1)">
  <div>Tag 1</div>
  <div>Tag 2</div>
  <div>Tag 3</div>
</div>
```

Modifiers: `--horizontal`, `--center`, `--end`, `--space-between`, `--wrap`.

Stack items: `flm-stack-item--grow`, `flm-stack-item--shrink`, `flm-stack-item--align-end`.

> **Note:** `gap` is set via inline `style` to keep the class list short.
> This is the one property that varies freely per instance.

### 5.11 Separator

```html
<hr class="flm-separator">
<hr class="flm-separator flm-separator--vertical">
```

### 5.12 Spinner

```html
<div class="flm-spinner">
  <div class="flm-spinner-circle"></div>
</div>

<div class="flm-spinner flm-spinner--large">
  <div class="flm-spinner-circle"></div>
  <span class="flm-spinner-label">Loading…</span>
</div>
```

Sizes: `--xSmall`, `--small`, default (medium), `--large`.

### 5.13 MessageBar

```html
<div class="flm-messagebar flm-messagebar--info">
  This is an informational message.
</div>
<div class="flm-messagebar flm-messagebar--success">
  Operation completed.
</div>
<div class="flm-messagebar flm-messagebar--warning">
  Please review before continuing.
</div>
<div class="flm-messagebar flm-messagebar--severeWarning">
  Immediate action required.
</div>
<div class="flm-messagebar flm-messagebar--error">
  Something went wrong.
</div>
```

---

## 6. HTML Authoring Rules (for LLMs)

1. **Use native elements first.** `<button>`, `<input>`, `<a>`, `<select>`,
   `<label>`, `<textarea>` — never a `<div>` when a real element exists.
2. **Visual variants are CSS modifier classes.** Pattern: `flm-{component}--{variant}`.
3. **`data-*` only for JS-dependent features.** If removing the attribute
   still leaves a usable (if plain) component, you've drawn the line right.
4. **Native HTML attributes over custom ones.** `disabled`, `required`,
   `checked`, `href`, `aria-label`, `placeholder` — never duplicate these as
   `data-disabled`, `data-required`, etc.
5. **Inline `style` only for truly per-instance values.** `gap`, `width`,
   `max-width`. Never for colors, fonts, or spacing scale values — those come
   from tokens.
6. **No wrapper divs unless structurally required.** A button is a `<button>`,
   not a `<div><button></button></div>`.
