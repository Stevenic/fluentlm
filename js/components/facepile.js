/**
 * Facepile component JS — hides excess coins and injects +N overflow chip.
 */
var FluentLMFacepileComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var facepiles = doc.querySelectorAll('.flm-facepile');
    for (var i = 0; i < facepiles.length; i++) {
      wireFacepile(facepiles[i]);
    }
  }

  function wireFacepile(el) {
    if (el.getAttribute('data-facepile-wired')) return;

    var max = parseInt(el.getAttribute('data-max'), 10);
    if (!max || isNaN(max)) {
      el.setAttribute('data-facepile-wired', 'true');
      return;
    }

    var members = el.querySelectorAll('.flm-facepile-member');
    if (members.length <= max) {
      el.setAttribute('data-facepile-wired', 'true');
      return;
    }

    var overflow = members.length - max;

    // Hide excess members
    for (var i = max; i < members.length; i++) {
      members[i].style.display = 'none';
    }

    // Remove existing overflow chip if any
    var existing = el.querySelector('.flm-facepile-overflow');
    if (existing) {
      existing.parentNode.removeChild(existing);
    }

    // Inject overflow chip
    var chip = document.createElement('span');
    chip.className = 'flm-facepile-overflow';
    chip.textContent = '+' + overflow;

    // Insert after last visible member
    var lastVisible = members[max - 1];
    if (lastVisible.nextSibling) {
      el.insertBefore(chip, lastVisible.nextSibling);
    } else {
      el.appendChild(chip);
    }

    el.setAttribute('data-facepile-wired', 'true');
  }

  return { init: init };
})();
