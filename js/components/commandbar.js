/**
 * CommandBar component JS — injects icons for command bar items with data-icon.
 */
var FluentLMCommandBarComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    // Inject icons into commandbar items that have data-icon
    var items = doc.querySelectorAll('.flm-commandbar-item[data-icon]');
    for (var i = 0; i < items.length; i++) {
      FluentLMIconComponent.render(items[i]);
    }

    // Inject overflow icon
    var overflows = doc.querySelectorAll('.flm-commandbar-overflow');
    for (var j = 0; j < overflows.length; j++) {
      if (!overflows[j].getAttribute('data-icon-rendered')) {
        var svg = FluentIcons.getSvg('More');
        if (svg) {
          overflows[j].innerHTML = '';
          overflows[j].appendChild(svg);
          overflows[j].setAttribute('data-icon-rendered', 'true');
        }
      }
    }
  }

  return { init: init };
})();
