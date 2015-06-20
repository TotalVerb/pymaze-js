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
  const images = {};

  exports.images = images;
  const width = 800;
  exports.width = width;
  const height = 600;

  exports.height = height;

  function initialize_ui() {
    const preload = document.getElementById('preload');
    if (document.readyState === 'complete') {
      // Load canvas.
      exports.canvas = canvas = document.getElementById('game_area');
      exports.context = context = canvas.getContext('2d');
      exports.initialized = initialized = true;
      preload.parentNode.removeChild(preload);
      for (var img of document.querySelectorAll('.res-img')) {
        images[img.id.slice(4)] = img;
      }
    } else {
      if (preload !== undefined) {
        preload.textContent = 'Loading... Please wait...';
      }
    }

    return initialized;
  }
});