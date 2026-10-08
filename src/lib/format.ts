/**
 * Small formatting helpers for content strings.
 *  - *word*        → <em>word</em> (italic serif accent)
 *  - [placeholder] → highlighted placeholder (dashed outline)
 */
const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function rich(text = ''): string {
  return escape(text)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]/g, '<span class="ph" title="Placeholder — edit in src/content/site.ts">$1</span>');
}

/** Plain text with formatting markers removed (for alt text, titles, hrefs). */
export function plain(text = ''): string {
  return text.replace(/[*[\]]/g, '');
}

export const isPlaceholder = (text = '') => /\[.+?\]/.test(text);

export const pad = (n: number) => String(n).padStart(2, '0');
