/**
 * MessageBar component JS — auto-injects status icon and wires dismiss button.
 */
var FluentLMMessageBarComponent = (function () {
  'use strict';

  // Map messagebar type to icon name
  var typeIconMap = {
    'info':          'Info',
    'success':       'Completed',
    'warning':       'Warning',
    'severeWarning': 'Warning',
    'error':         'ErrorBadge',
    'blocked':       'Blocked'
  };

  function getType(el) {
    var classes = el.className;
    var types = Object.keys(typeIconMap);
    for (var i = 0; i < types.length; i++) {
      if (classes.indexOf('flm-messagebar--' + types[i]) !== -1) {
        return types[i];
      }
    }
    return 'info';
  }

  function init(root) {
    var els = (root || document).querySelectorAll('.flm-messagebar');
    for (var i = 0; i < els.length; i++) {
      render(els[i]);
    }
  }

  function render(el) {
    if (el.getAttribute('data-messagebar-rendered')) return;

    var type = getType(el);

    // Auto-inject icon if none exists
    if (!el.querySelector('.flm-messagebar-icon')) {
      var iconName = typeIconMap[type];
      var svg = FluentIcons.getSvg(iconName);
      if (svg) {
        var iconSpan = document.createElement('span');
        iconSpan.className = 'flm-messagebar-icon';
        iconSpan.appendChild(svg);
        el.insertBefore(iconSpan, el.firstChild);
      }
    }

    // Wrap bare text content in .flm-messagebar-text if not already wrapped
    if (!el.querySelector('.flm-messagebar-text')) {
      var children = Array.prototype.slice.call(el.childNodes);
      var textWrapper = document.createElement('span');
      textWrapper.className = 'flm-messagebar-text';
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child.classList ||
            (!child.classList.contains('flm-messagebar-icon') &&
             !child.classList.contains('flm-messagebar-actions') &&
             !child.classList.contains('flm-messagebar-dismiss'))) {
          textWrapper.appendChild(child);
        }
      }
      // Insert text wrapper after the icon
      var icon = el.querySelector('.flm-messagebar-icon');
      if (icon) {
        icon.after(textWrapper);
      } else {
        el.insertBefore(textWrapper, el.firstChild);
      }
    }

    // Wire up dismiss button
    var dismiss = el.querySelector('.flm-messagebar-dismiss');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        el.style.display = 'none';
      });
    }

    // ARIA
    el.setAttribute('role', 'status');
    if (type === 'error' || type === 'blocked' || type === 'severeWarning') {
      el.setAttribute('role', 'alert');
    }

    el.setAttribute('data-messagebar-rendered', 'true');
  }

  return { init: init };
})();
