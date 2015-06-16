export let canvas = null;
export let context = null;
export let initialized = false;
export const images = {};

export const width = 800;
export const height = 600;


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
