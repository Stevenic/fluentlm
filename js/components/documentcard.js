/**
 * DocumentCard component JS — stub for icon injection via FluentLMIconComponent.
 */
var FluentLMDocumentCardComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var cards = doc.querySelectorAll('.flm-documentcard');
    for (var i = 0; i < cards.length; i++) {
      wireCard(cards[i]);
    }
  }

  function wireCard(card) {
    if (card.getAttribute('data-documentcard-wired')) return;

    // Icons are handled by FluentLMIconComponent.
    // Wire up any action buttons for focus management.
    var actions = card.querySelectorAll('.flm-documentcard-actions .flm-button');
    for (var i = 0; i < actions.length; i++) {
      actions[i].addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    card.setAttribute('data-documentcard-wired', 'true');
  }

  return { init: init };
})();
