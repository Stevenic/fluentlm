/**
 * FluentLM — Theme Manager
 *
 * Handles light/dark theme switching via class on <html>.
 * Respects prefers-color-scheme on first load.
 */
var FluentTheme = (function () {
  'use strict';

  var LIGHT = 'fluentlm';
  var DARK = 'fluent-dark';
  var TRANSITION = 'fluent-theme-transition';
  var STORAGE_KEY = 'fluentlm-theme';

  function current() {
    return document.documentElement.classList.contains(DARK) ? 'dark' : 'light';
  }

  function setTheme(theme) {
    var html = document.documentElement;
    html.classList.add(TRANSITION);
    html.classList.remove(LIGHT, DARK);
    html.classList.add(theme === 'dark' ? DARK : LIGHT);

    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* noop */ }

    setTimeout(function () {
      html.classList.remove(TRANSITION);
    }, 250);
  }

  function toggle() {
    setTheme(current() === 'light' ? 'dark' : 'light');
    return current();
  }

  function init() {
    var html = document.documentElement;

    // 1. Check localStorage
    var stored;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* noop */ }

    if (stored === 'dark' || stored === 'light') {
      html.classList.remove(LIGHT, DARK);
      html.classList.add(stored === 'dark' ? DARK : LIGHT);
      return;
    }

    // 2. Check OS preference (only if no class is already set)
    if (!html.classList.contains(LIGHT) && !html.classList.contains(DARK)) {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.add(prefersDark ? DARK : LIGHT);
    }
  }

  return {
    init: init,
    current: current,
    setTheme: setTheme,
    toggle: toggle
  };
})();
