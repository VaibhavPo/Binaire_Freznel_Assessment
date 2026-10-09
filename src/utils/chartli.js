/**
 * Render numeric array into btop-style horizontal rows of vertical block columns.
 * Supports tiered color bands (peaks in red/orange, mids in yellow, baseline in green)
 * with textured block caps (░, ▄, █).
 */
export function renderBarRows(data, { width = 40, height = 4 } = {}) {
  if (!data || data.length === 0) {
    return Array.from({ length: height }, () => ' '.repeat(width));
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const delta = max - min || 1;

  const points = [];
  for (let i = 0; i < width; i++) {
    const idx = Math.floor((i / width) * data.length);
    const raw = data[idx] ?? min;
    points.push(((raw - min) / delta) * 100);
  }

  const rows = [];
  for (let r = 0; r < height; r++) {
    let line = '';
    const bottomPct = ((height - 1 - r) / height) * 100;
    const topPct = ((height - r) / height) * 100;
    const midPct = (bottomPct + topPct) / 2;

    for (let x = 0; x < width; x++) {
      const v = points[x];
      if (v >= topPct) {
        line += '█';
      } else if (v >= midPct) {
        line += '▄';
      } else if (v > bottomPct) {
        line += '░';
      } else {
        line += ' ';
      }
    }
    rows.push(line);
  }
  return rows;
}

export function renderChart(data, { width = 40, height = 4 } = {}) {
  return renderBarRows(data, { width, height }).join('\n');
}