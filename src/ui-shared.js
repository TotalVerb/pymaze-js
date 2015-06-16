export let canvas = null;
export let context = null;
export let initialized = false;
export const images = {};

export const width = 800;
export const height = 600;
export const sidebar_width = 200;
export const titlebar_height = 100;
export const infobar_height = 350;
export const game_width = width - sidebar_width;
export const line_height = 30;
export const title_height = 90;


export function initialize_ui() {
  const preload = document.getElementById('preload');
  if (document.readyState === "complete") {
    // Load canvas.
    canvas = document.getElementById('game_area');
    context = canvas.getContext('2d');
    initialized = true;
    preload.parentNode.removeChild(preload);
    for (let img of document.querySelectorAll('.res-img')) {
      images[img.id.slice(4)] = img;
    }
  } else {
    if (preload !== undefined) {
      preload.textContent = 'Loading... Please wait...';
    }
  }

  return initialized;
}
