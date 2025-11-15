// src/js/ui.js
// ui.js - helper functions to update the DOM and draw a simple sparkline
// Save this file as UTF-8 (no BOM)

/**
 * Populate a <select> element with currency symbols.
 * @param {HTMLSelectElement} select
 * @param {Object} symbols
 * @param {string} selected
 */
export function populateSelect(select, symbols = {}, selected) {
  // handle missing symbols gracefully
  const entries = Object.entries(symbols).sort((a, b) => a[0].localeCompare(b[0]));
  select.innerHTML = '';
  if (entries.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'No symbols available';
    select.appendChild(opt);
    return;
  }

  for (const [code, meta] of entries) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = `${code}${meta && meta.description ? ' — ' + meta.description : ''}`;
    if (code === selected) opt.selected = true;
    select.appendChild(opt);
  }
}

/**
 * Draw a small sparkline on a canvas using an array of numbers.
 * @param {HTMLCanvasElement} canvas
 * @param {number[]} values
 */
export function drawSparkline(canvas, values) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (!Array.isArray(values) || values.length === 0) return;

  // If there's only one value, draw a single horizontal line
  if (values.length === 1) {
    const y = h / 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    return;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // compute points with padding
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (w - 4) + 2; // padding 2px left/right
    const y = h - ((v - min) / range) * (h - 4) - 2;   // padding 2px top/bottom
    return { x, y };
  });

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#333';
  ctx.stroke();
}
