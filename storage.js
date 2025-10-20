export const KEY = 'medichora_items';
export function loadAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}
export function saveAll(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}
export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
