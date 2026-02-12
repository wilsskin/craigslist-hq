import type { TaxonomyData, TaxonomySection, LeftRailCategory } from './types'
import rawTaxonomy from '../../craigslist_taxonomy.json'
import {
  validateTaxonomy,
  validateLeftRailCoherence,
} from '@/lib/taxonomyValidation'

/**
 * Taxonomy data imported from the repo-root JSON file.
 * Do not modify the JSON.
 */
const taxonomy: TaxonomyData = rawTaxonomy as TaxonomyData

// ── Runtime validation (warn only, never throw) ──────────────────────

const validation = validateTaxonomy(taxonomy.sections)

if (validation.hasDuplicates) {
  console.warn(
    '[taxonomy] Duplicate ids found:',
    validation.duplicates.join(', '),
  )
}

if (validation.hasShapeIssues) {
  console.warn(
    '[taxonomy] Shape issues found:',
    validation.shapeIssues.join('; '),
  )
}

const coherence = validateLeftRailCoherence(
  taxonomy.sections,
  taxonomy.left_rail_categories,
)

if (!coherence.isCoherent) {
  console.warn(
    '[taxonomy] Left rail coherence issues:',
    coherence.warnings.join('; '),
  )
}

// ── Exports ──────────────────────────────────────────────────────────

/** All top-level sections in JSON order. Used by MainContentShell. */
export const taxonomySections: TaxonomySection[] = taxonomy.sections

/**
 * Left rail category list.
 * Uses the dedicated left_rail_categories array when it is coherent with
 * sections. Falls back to deriving from sections if the coherence check fails.
 */
export const leftRailCategories: LeftRailCategory[] = coherence.isCoherent
  ? taxonomy.left_rail_categories
  : taxonomy.sections.map(
      (s): LeftRailCategory => ({
        id: `nav_${s.id}`,
        label: s.title,
        section_id: s.id,
      }),
    )
