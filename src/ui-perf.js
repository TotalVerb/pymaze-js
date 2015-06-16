/** Measures the FPS of the UI. (GFPS) */

let last_time = window.performance.now();
export let fps = 0;

export function updateFPS() {
  const this_time = window.performance.now();
  const diff = this_time - last_time;
  last_time = this_time;
  fps = 0.9 * fps + 100 / diff;
}
