export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0 || bytes === null || bytes === undefined) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`;
}

export function formatBytesPerSec(bytes) {
  return `${formatBytes(bytes)}/s`;
}

export function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = n => String(n).padStart(2, '0');
  return d > 0
    ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

// Returns an Ink-compatible color name based on load percentage
export function percentColor(value) {
  if (value === null || value === undefined) return 'gray';
  if (value < 50) return 'green';
  if (value < 80) return 'yellow';
  return 'red';
}

export function renderBar(percent, width = 10, fillChar = '█', emptyChar = '░') {
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  const filled = Math.round((p / 100) * width);
  const empty = Math.max(0, width - filled);
  return fillChar.repeat(filled) + emptyChar.repeat(empty);
}