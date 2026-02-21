/**
 * FluentLM — Theme Manager
 *
 * Handles theme switching via class on <html>.
 * Respects prefers-color-scheme on first load.
 *
 * Built-in themes: light, dark.
 * Register custom themes with FluentTheme.register(name, className).
 */
var FluentTheme = (function () {
  'use strict';

  var TRANSITION = 'fluent-theme-transition';
  var STORAGE_KEY = 'fluentlm-theme';

  // Theme registry: name → CSS class
  var themes = {
    light: 'fluentlm',
    dark: 'fluent-dark'
  };

  // Ordered list of theme names for cycling
  var themeOrder = ['light', 'dark'];

  /**
   * Register a custom theme.
   * @param {string} name  - Theme identifier (used with setTheme/getTheme)
   * @param {string} className - CSS class applied to <html>
   */
  function register(name, className) {
    if (!name || !className) { return; }
    themes[name] = className;
    if (themeOrder.indexOf(name) === -1) {
      themeOrder.push(name);
    }
  }

  function allClasses() {
    var classes = [];
    for (var key in themes) {
      if (themes.hasOwnProperty(key)) { classes.push(themes[key]); }
    }
    return classes;
  }

  function current() {
    var html = document.documentElement;
    for (var i = themeOrder.length - 1; i >= 0; i--) {
      if (html.classList.contains(themes[themeOrder[i]])) {
        return themeOrder[i];
      }
    }
    return 'light';
  }

  function setTheme(theme) {
    var className = themes[theme];
    if (!className) { return; }

    var html = document.documentElement;
    html.classList.add(TRANSITION);

    var classes = allClasses();
    for (var i = 0; i < classes.length; i++) {
      html.classList.remove(classes[i]);
    }
    html.classList.add(className);

    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* noop */ }

    setTimeout(function () {
      html.classList.remove(TRANSITION);
    }, 250);
  }

  function toggle() {
    var idx = themeOrder.indexOf(current());
    var next = themeOrder[(idx + 1) % themeOrder.length];
    setTheme(next);
    return current();
  }

  function init() {
    var html = document.documentElement;

    // 1. Check localStorage
    var stored;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* noop */ }

    if (stored && themes[stored]) {
      var classes = allClasses();
      for (var i = 0; i < classes.length; i++) {
        html.classList.remove(classes[i]);
      }
      html.classList.add(themes[stored]);
      return;
    }

    // 2. Check OS preference (only if no theme class is already set)
    var classes = allClasses();
    var hasTheme = false;
    for (var i = 0; i < classes.length; i++) {
      if (html.classList.contains(classes[i])) { hasTheme = true; break; }
    }
    if (!hasTheme) {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.add(prefersDark ? themes.dark : themes.light);
    }
  }

  return {
    init: init,
    current: current,
    setTheme: setTheme,
    toggle: toggle,
    register: register
  };
})();
