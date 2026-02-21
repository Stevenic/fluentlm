/**
 * FluentLM — Main Runtime
 *
 * On DOMContentLoaded, initializes the theme and walks the DOM to
 * enhance elements that need JS (icons, split buttons, toggles, etc.).
 *
 * Components that are pure CSS (Stack, Text, Label, Link, Separator,
 * Spinner, TextField, Checkbox, Dropdown, Breadcrumb, Image,
 * ProgressIndicator, Persona, Overlay) require no JS initialization.
 *
 * Load order:
 *   1. icons.js          (icon registry — no deps)
 *   2. components/*.js   (component modules — depend on FluentIcons)
 *   3. theme.js          (theme manager — no deps)
 *   4. fluentlm.js   (this file — orchestrator)
 */
var FluentLM = (function () {
  'use strict';

  var initialized = false;

  /**
   * Initialize all components on the page.
   * Safe to call multiple times (idempotent per element).
   * Optionally pass a root element to scope initialization.
   */
  function init(root) {
    // Theme
    FluentTheme.init();

    // Tier 1 components
    FluentLMIconComponent.init(root);
    FluentLMButtonComponent.init(root);
    FluentLMToggleComponent.init(root);
    FluentLMMessageBarComponent.init(root);
    FluentLMDropdownComponent.init(root);

    // Tier 2 components
    FluentLMSearchBoxComponent.init(root);
    FluentLMDialogComponent.init(root);
    FluentLMPanelComponent.init(root);
    FluentLMModalComponent.init(root);
    FluentLMCalloutComponent.init(root);
    FluentLMContextMenuComponent.init(root);
    FluentLMNavComponent.init(root);
    FluentLMPivotComponent.init(root);
    FluentLMTooltipComponent.init(root);
    FluentLMCommandBarComponent.init(root);

    // Tier 3 components
    FluentLMGroupedListComponent.init(root);
    FluentLMRatingComponent.init(root);
    FluentLMFacepileComponent.init(root);
    FluentLMSwatchColorPickerComponent.init(root);
    FluentLMDocumentCardComponent.init(root);
    FluentLMSpinButtonComponent.init(root);
    FluentLMSliderComponent.init(root);
    FluentLMComboBoxComponent.init(root);
    FluentLMTeachingBubbleComponent.init(root);
    FluentLMHoverCardComponent.init(root);
    FluentLMCoachmarkComponent.init(root);
    FluentLMDatePickerComponent.init(root);

    // Tier 4 components
    FluentLMTagPickerComponent.init(root);
    FluentLMOverflowSetComponent.init(root);
    FluentLMTimePickerComponent.init(root);

    initialized = true;
  }

  /**
   * Re-initialize new elements added after page load.
   * Call this after dynamically inserting HTML with flm-* components.
   * Optionally scope to a container element.
   */
  function refresh(root) {
    FluentLMIconComponent.init(root);
    FluentLMButtonComponent.init(root);
    FluentLMToggleComponent.init(root);
    FluentLMMessageBarComponent.init(root);
    FluentLMDropdownComponent.init(root);
    FluentLMSearchBoxComponent.init(root);
    FluentLMDialogComponent.init(root);
    FluentLMPanelComponent.init(root);
    FluentLMModalComponent.init(root);
    FluentLMCalloutComponent.init(root);
    FluentLMContextMenuComponent.init(root);
    FluentLMNavComponent.init(root);
    FluentLMPivotComponent.init(root);
    FluentLMTooltipComponent.init(root);
    FluentLMCommandBarComponent.init(root);

    // Tier 3 components
    FluentLMGroupedListComponent.init(root);
    FluentLMRatingComponent.init(root);
    FluentLMFacepileComponent.init(root);
    FluentLMSwatchColorPickerComponent.init(root);
    FluentLMDocumentCardComponent.init(root);
    FluentLMSpinButtonComponent.init(root);
    FluentLMSliderComponent.init(root);
    FluentLMComboBoxComponent.init(root);
    FluentLMTeachingBubbleComponent.init(root);
    FluentLMHoverCardComponent.init(root);
    FluentLMCoachmarkComponent.init(root);
    FluentLMDatePickerComponent.init(root);

    // Tier 4 components
    FluentLMTagPickerComponent.init(root);
    FluentLMOverflowSetComponent.init(root);
    FluentLMTimePickerComponent.init(root);
  }

  /**
   * Register a custom theme.
   * @param {string} name      - Theme identifier (e.g. 'highcontrast')
   * @param {string} className - CSS class applied to <html> (e.g. 'fluent-highcontrast')
   */
  function registerTheme(name, className) {
    FluentTheme.register(name, className);
  }

  /**
   * Set theme by name (e.g. 'light', 'dark', or any registered theme).
   */
  function setTheme(theme) {
    FluentTheme.setTheme(theme);
  }

  /**
   * Toggle to the next theme. Returns new theme name.
   */
  function toggleTheme() {
    return FluentTheme.toggle();
  }

  /**
   * Get current theme name.
   */
  function getTheme() {
    return FluentTheme.current();
  }

  // Auto-initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    // DOM already ready (script loaded with defer or at end of body)
    init();
  }

  // Expose sub-component APIs for direct use
  return {
    init: init,
    refresh: refresh,
    registerTheme: registerTheme,
    setTheme: setTheme,
    toggleTheme: toggleTheme,
    getTheme: getTheme,
    dialog: typeof FluentLMDialogComponent !== 'undefined' ? FluentLMDialogComponent : null,
    panel: typeof FluentLMPanelComponent !== 'undefined' ? FluentLMPanelComponent : null,
    modal: typeof FluentLMModalComponent !== 'undefined' ? FluentLMModalComponent : null,
    callout: typeof FluentLMCalloutComponent !== 'undefined' ? FluentLMCalloutComponent : null,
    contextMenu: typeof FluentLMContextMenuComponent !== 'undefined' ? FluentLMContextMenuComponent : null,
    comboBox: typeof FluentLMComboBoxComponent !== 'undefined' ? FluentLMComboBoxComponent : null,
    datePicker: typeof FluentLMDatePickerComponent !== 'undefined' ? FluentLMDatePickerComponent : null,
    teachingBubble: typeof FluentLMTeachingBubbleComponent !== 'undefined' ? FluentLMTeachingBubbleComponent : null,
    hoverCard: typeof FluentLMHoverCardComponent !== 'undefined' ? FluentLMHoverCardComponent : null,
    tagPicker: typeof FluentLMTagPickerComponent !== 'undefined' ? FluentLMTagPickerComponent : null,
    overflowSet: typeof FluentLMOverflowSetComponent !== 'undefined' ? FluentLMOverflowSetComponent : null,
    timePicker: typeof FluentLMTimePickerComponent !== 'undefined' ? FluentLMTimePickerComponent : null
  };
})();
