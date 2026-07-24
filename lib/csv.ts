const FORMULA_PREFIX = /^[\t\r ]*[=+\-@]/;

export function escapeCsvCell(value: unknown): string {
  const text = String(value ?? "");
  const safe = FORMULA_PREFIX.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsv(rows: unknown[][]): string {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}
