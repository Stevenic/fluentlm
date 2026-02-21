/**
 * Rating component JS — stores selected rating value on the root element.
 */
var FluentLMRatingComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var ratings = doc.querySelectorAll('.flm-rating');
    for (var i = 0; i < ratings.length; i++) {
      wireRating(ratings[i]);
    }
  }

  function wireRating(rating) {
    if (rating.getAttribute('data-rating-wired')) return;

    var inputs = rating.querySelectorAll('.flm-rating-input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('change', function () {
        if (this.checked) {
          rating.setAttribute('data-rating-value', this.value);
        }
      });
    }

    // Set initial value from pre-checked input
    var checked = rating.querySelector('.flm-rating-input:checked');
    if (checked) {
      rating.setAttribute('data-rating-value', checked.value);
    }

    rating.setAttribute('data-rating-wired', 'true');
  }

  return { init: init };
})();
