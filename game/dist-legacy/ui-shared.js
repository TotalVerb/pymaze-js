define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.initialize_ui = initialize_ui;
  var canvas = null;
  exports.canvas = canvas;
  var context = null;
  exports.context = context;
  var initialized = false;
  exports.initialized = initialized;
  var images = {};

  exports.images = images;
  var width = 800;
  exports.width = width;
  var height = 600;

  exports.height = height;

  function initialize_ui() {
    var preload = document.getElementById('preload');
    if (document.readyState === 'complete') {
      // Load canvas.
      exports.canvas = canvas = document.getElementById('game_area');
      exports.context = context = canvas.getContext('2d');
      exports.initialized = initialized = true;
      preload.parentNode.removeChild(preload);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = document.querySelectorAll('.res-img')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var img = _step.value;

          images[img.id.slice(4)] = img;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      if (preload !== undefined) {
        preload.textContent = 'Loading... Please wait...';
      }
    }

    return initialized;
  }
});