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
  const sidebar_width = 200;
  exports.sidebar_width = sidebar_width;
  const titlebar_height = 100;
  exports.titlebar_height = titlebar_height;
  const infobar_height = 350;
  exports.infobar_height = infobar_height;
  const game_width = width - sidebar_width;
  exports.game_width = game_width;
  const line_height = 30;
  exports.line_height = line_height;
  const title_height = 90;

  exports.title_height = title_height;

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