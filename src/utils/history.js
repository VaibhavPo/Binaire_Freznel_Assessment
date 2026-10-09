export class HistoryBuffer {
  constructor(maxLen = 60) {
    this.maxLen = maxLen;
    this.data = [];
  }

  // Pre-fill the baseline with the initial live reading so the graph spans the width
  // without any artificial/fictional sine waves
  seedFromReal(realValue) {
    if (realValue === null || realValue === undefined || Number.isNaN(realValue)) return;
    const num = typeof realValue === 'number' ? realValue : parseFloat(realValue);
    this.data = Array(this.maxLen).fill(num);
  }

  push(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return;
    const num = typeof value === 'number' ? value : parseFloat(value);
    this.data.push(num);
    if (this.data.length > this.maxLen) this.data.shift();
  }

  get() {
    return this.data;
  }
}