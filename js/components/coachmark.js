/**
 * Coachmark component JS — pulsing beacon that opens a TeachingBubble on click.
 *
 * Usage:
 *   <div class="flm-coachmark" data-teachingbubble-toggle="tb1">
 *     <div class="flm-coachmark-dot"></div>
 *     <div class="flm-coachmark-ring"></div>
 *   </div>
 *   <div class="flm-teachingbubble" id="tb1">...</div>
 *
 * Uses MutationObserver to auto-hide beacon when the teaching bubble is dismissed.
 */
var FluentLMCoachmarkComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var coachmarks = doc.querySelectorAll('.flm-coachmark');
    for (var i = 0; i < coachmarks.length; i++) {
      wireCoachmark(coachmarks[i]);
    }
  }

  function wireCoachmark(el) {
    if (el.getAttribute('data-coachmark-wired')) return;

    var bubbleId = el.getAttribute('data-teachingbubble-toggle');
    if (!bubbleId) return;

    // Click handler to open teaching bubble
    el.addEventListener('click', function () {
      var bubble = document.getElementById(bubbleId);
      if (!bubble) return;

      if (typeof FluentLMTeachingBubbleComponent !== 'undefined') {
        FluentLMTeachingBubbleComponent.show(bubble, el);
      }
    });

    // Observe the teaching bubble for dismiss to hide beacon
    var bubble = document.getElementById(bubbleId);
    if (bubble && typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].attributeName === 'class') {
            if (!bubble.classList.contains('flm-teachingbubble--visible')) {
              el.classList.add('flm-coachmark--hidden');
              observer.disconnect();
            }
          }
        }
      });

      observer.observe(bubble, { attributes: true, attributeFilter: ['class'] });
    }

    el.setAttribute('data-coachmark-wired', 'true');
  }

  return { init: init };
})();
