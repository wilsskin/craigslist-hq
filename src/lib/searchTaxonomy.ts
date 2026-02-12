import type { TaxonomySection } from '@/data/types'

/**
 * Normalize a search query: trim whitespace and lowercase.
 */
export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

/**
 * Check if an item label matches a search query (case-insensitive substring).
 */
export function itemMatchesQuery(itemLabel: string, query: string): boolean {
  if (query === '') return true
  return itemLabel.toLowerCase().includes(query.toLowerCase())
}

/**
 * Filter taxonomy sections by a search query.
 *
 * Rules:
 * - If normalized query is empty, return the original sections unchanged.
 * - Otherwise, filter each section's items to only matching ones.
 * - Sections with zero matching items are excluded from the result.
 * - Input arrays are never mutated.
 *
 * Returns:
 * - filteredSections: sections with only matching items (empty sections removed)
 * - matchCount: total number of matching items across all returned sections
 */
export function filterSectionsByQuery(
  sections: TaxonomySection[],
  query: string,
): { filteredSections: TaxonomySection[]; matchCount: number } {
  const normalized = normalizeQuery(query)

  if (normalized === '') {
    return { filteredSections: sections, matchCount: -1 }
  }

  let matchCount = 0
  const filteredSections: TaxonomySection[] = []

  for (const section of sections) {
    const matchingItems = section.items.filter((item) =>
      itemMatchesQuery(item.label, normalized),
    )
    if (matchingItems.length > 0) {
      filteredSections.push({ ...section, items: matchingItems })
      matchCount += matchingItems.length
    }
  }

  return { filteredSections, matchCount }
}
