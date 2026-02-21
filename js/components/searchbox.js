/**
 * SearchBox component JS — injects search icon, wires clear button.
 */
var FluentLMSearchBoxComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var boxes = doc.querySelectorAll('.flm-searchbox');
    for (var i = 0; i < boxes.length; i++) {
      render(boxes[i]);
    }
  }

  function render(box) {
    if (box.getAttribute('data-searchbox-rendered')) return;

    // Inject search icon if not present
    var iconEl = box.querySelector('.flm-searchbox-icon');
    if (!iconEl) {
      iconEl = document.createElement('span');
      iconEl.className = 'flm-searchbox-icon';
      var svg = FluentIcons.getSvg('Search');
      if (svg) iconEl.appendChild(svg);
      box.insertBefore(iconEl, box.firstChild);
    }

    // Inject clear button if not present
    var clearBtn = box.querySelector('.flm-searchbox-clear');
    if (!clearBtn) {
      clearBtn = document.createElement('button');
      clearBtn.className = 'flm-searchbox-clear';
      clearBtn.setAttribute('aria-label', 'Clear search');
      clearBtn.type = 'button';
      var cancelSvg = FluentIcons.getSvg('Cancel');
      if (cancelSvg) clearBtn.appendChild(cancelSvg);
      box.appendChild(clearBtn);
    }

    var input = box.querySelector('.flm-searchbox-input');
    if (!input) { box.setAttribute('data-searchbox-rendered', 'true'); return; }

    // Toggle has-value class
    function updateHasValue() {
      if (input.value) {
        box.classList.add('flm-searchbox--has-value');
      } else {
        box.classList.remove('flm-searchbox--has-value');
      }
    }

    input.addEventListener('input', updateHasValue);
    updateHasValue();

    // Clear button click
    clearBtn.addEventListener('click', function () {
      input.value = '';
      updateHasValue();
      input.focus();
      // Fire input event so any listeners are notified
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    box.setAttribute('data-searchbox-rendered', 'true');
  }

  return { init: init };
})();
