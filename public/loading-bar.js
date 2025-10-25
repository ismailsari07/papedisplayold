// var line = new ProgressBar.Line('#container', {
//   strokeWidth: 1,
//   easing: 'easeInOut',
//   color: '#2cc024ff',
//   trailColor: '#ffffffff',
//   trailWidth: 1,
//   svgStyle: {width: '100%', height: '100%', borderRadius: '32px'},
//   from: {color: '#228609'},
//   to: {color: '#991908'},
//   step: (state, bar) => {
//     bar.path.setAttribute('stroke', state.color);
//   }
// });

/**
 * Runs a timed progress for a given "HH:MM" duration on a ProgressBar.js instance.
 * - Fills from 0.0 to 1.0 over the exact duration.
 * - Updates every 1s; clears itself at completion.
 * - Returns a stop() function to cancel early if needed.
 *
 * @param {ProgressBar.Line|ProgressBar.Circle|any} bar - ProgressBar.js instance
 * @param {string} hhmm - Duration in "HH:MM" (e.g., "05:20" = 5h 20m)
 * @returns {() => void} stop function
 */
function startTimedProgress(bar, hhmm) {
  const [hStr, mStr] = (hhmm || "").split(":");
  const h = Math.max(0, parseInt(hStr, 10) || 0);
  const m = Math.max(0, parseInt(mStr, 10) || 0);
  const totalSeconds = h * 3600 + m * 60;

  if (totalSeconds <= 0) {
    bar.set(1); // instantly complete if invalid/zero duration
    return () => {};
  }

  const start = Date.now();
  const TICK_MS = 1000;

  const id = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - start) / 1000);
    const fraction = Math.min(1, elapsedSeconds / totalSeconds);

    // Smooth 1s step animation; use bar.set(fraction) if you prefer no animation
    bar.animate(fraction, { duration: TICK_MS, easing: "linear" });

    if (fraction >= 1) clearInterval(id);
  }, TICK_MS);

  return () => clearInterval(id);
}

// startTimedProgress(line, "00:01");
