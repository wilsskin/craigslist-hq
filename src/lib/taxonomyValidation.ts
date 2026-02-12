import type { TaxonomySection, LeftRailCategory } from '@/data/types'

/**
 * Collect every id from sections and their items into a flat array.
 */
export function collectAllIds(sections: TaxonomySection[]): string[] {
  const ids: string[] = []
  for (const section of sections) {
    ids.push(section.id)
    for (const item of section.items) {
      ids.push(item.id)
    }
  }
  return ids
}

/**
 * Return any ids that appear more than once.
 */
export function findDuplicateIds(ids: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id)
    }
    seen.add(id)
  }
  return Array.from(duplicates)
}

/**
 * Validate basic shape: every section needs id, title, and an items array
 * where each item has id and label.
 */
function findShapeIssues(sections: TaxonomySection[]): string[] {
  const issues: string[] = []
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i]
    if (!s.id) issues.push(`sections[${i}] missing id`)
    if (!s.title) issues.push(`sections[${i}] missing title`)
    if (!Array.isArray(s.items)) {
      issues.push(`sections[${i}] missing items array`)
      continue
    }
    for (let j = 0; j < s.items.length; j++) {
      const item = s.items[j]
      if (!item.id) issues.push(`sections[${i}].items[${j}] missing id`)
      if (!item.label) issues.push(`sections[${i}].items[${j}] missing label`)
    }
  }
  return issues
}

export interface TaxonomyValidationResult {
  hasDuplicates: boolean
  duplicates: string[]
  hasShapeIssues: boolean
  shapeIssues: string[]
}

/**
 * Full validation: check id uniqueness and structural shape.
 */
export function validateTaxonomy(
  sections: TaxonomySection[],
): TaxonomyValidationResult {
  const allIds = collectAllIds(sections)
  const duplicates = findDuplicateIds(allIds)
  const shapeIssues = findShapeIssues(sections)

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    hasShapeIssues: shapeIssues.length > 0,
    shapeIssues,
  }
}

export interface LeftRailCoherenceResult {
  isCoherent: boolean
  warnings: string[]
}

/**
 * Check that left_rail_categories is coherent with sections:
 * - Same length
 * - Every section_id in left_rail_categories maps to an existing section id
 */
export function validateLeftRailCoherence(
  sections: TaxonomySection[],
  leftRailCategories: LeftRailCategory[],
): LeftRailCoherenceResult {
  const warnings: string[] = []
  const sectionIds = new Set(sections.map((s) => s.id))

  if (leftRailCategories.length !== sections.length) {
    warnings.push(
      `left_rail_categories length (${leftRailCategories.length}) does not match sections length (${sections.length})`,
    )
  }

  for (const cat of leftRailCategories) {
    if (!sectionIds.has(cat.section_id)) {
      warnings.push(
        `left_rail_categories entry "${cat.id}" references section_id "${cat.section_id}" which does not exist in sections`,
      )
    }
  }

  return {
    isCoherent: warnings.length === 0,
    warnings,
  }
}
