// Removes extra spaces, line breaks, and special formatting inconsistencies
export function formatText(text: string | null | undefined): string {
  return text ? text.replace(/\s+/g, ' ').trim().normalize() : '';
}
