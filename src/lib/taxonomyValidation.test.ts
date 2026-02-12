import { describe, it, expect } from 'vitest'
import {
  collectAllIds,
  findDuplicateIds,
  validateTaxonomy,
  validateLeftRailCoherence,
} from './taxonomyValidation'
import type { TaxonomySection, LeftRailCategory } from '@/data/types'

const makeSections = (
  overrides?: Partial<TaxonomySection>[],
): TaxonomySection[] => {
  const defaults: TaxonomySection[] = [
    {
      id: 'sec_a',
      title: 'Section A',
      items: [
        { id: 'a_1', label: 'Item 1' },
        { id: 'a_2', label: 'Item 2' },
      ],
    },
    {
      id: 'sec_b',
      title: 'Section B',
      items: [{ id: 'b_1', label: 'Item 1' }],
    },
  ]
  if (!overrides) return defaults
  return overrides.map((o, i) => ({ ...defaults[i % defaults.length], ...o }))
}

describe('collectAllIds', () => {
  it('returns section ids and item ids in a flat array', () => {
    const ids = collectAllIds(makeSections())
    expect(ids).toEqual(['sec_a', 'a_1', 'a_2', 'sec_b', 'b_1'])
  })
})

describe('findDuplicateIds', () => {
  it('returns empty array when no duplicates', () => {
    expect(findDuplicateIds(['a', 'b', 'c'])).toEqual([])
  })

  it('returns duplicate ids when duplicates exist', () => {
    expect(findDuplicateIds(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b'])
  })
})

describe('validateTaxonomy', () => {
  it('returns hasDuplicates false when all ids are unique', () => {
    const result = validateTaxonomy(makeSections())
    expect(result.hasDuplicates).toBe(false)
    expect(result.duplicates).toEqual([])
  })

  it('returns hasDuplicates true and lists duplicates when duplicates exist', () => {
    const sections: TaxonomySection[] = [
      {
        id: 'sec_a',
        title: 'A',
        items: [
          { id: 'dup_id', label: 'X' },
          { id: 'dup_id', label: 'Y' },
        ],
      },
    ]
    const result = validateTaxonomy(sections)
    expect(result.hasDuplicates).toBe(true)
    expect(result.duplicates).toContain('dup_id')
  })

  it('handles empty sections array gracefully', () => {
    const result = validateTaxonomy([])
    expect(result.hasDuplicates).toBe(false)
    expect(result.duplicates).toEqual([])
    expect(result.hasShapeIssues).toBe(false)
    expect(result.shapeIssues).toEqual([])
  })

  it('detects shape issues for missing fields', () => {
    const sections = [
      { id: '', title: 'A', items: [{ id: 'x', label: '' }] },
    ] as TaxonomySection[]
    const result = validateTaxonomy(sections)
    expect(result.hasShapeIssues).toBe(true)
    expect(result.shapeIssues.length).toBeGreaterThan(0)
  })
})

describe('validateLeftRailCoherence', () => {
  it('returns isCoherent true when left rail matches sections', () => {
    const sections = makeSections()
    const leftRail: LeftRailCategory[] = [
      { id: 'nav_a', label: 'A', section_id: 'sec_a' },
      { id: 'nav_b', label: 'B', section_id: 'sec_b' },
    ]
    const result = validateLeftRailCoherence(sections, leftRail)
    expect(result.isCoherent).toBe(true)
    expect(result.warnings).toEqual([])
  })

  it('warns when lengths do not match', () => {
    const sections = makeSections()
    const leftRail: LeftRailCategory[] = [
      { id: 'nav_a', label: 'A', section_id: 'sec_a' },
    ]
    const result = validateLeftRailCoherence(sections, leftRail)
    expect(result.isCoherent).toBe(false)
    expect(result.warnings[0]).toContain('length')
  })

  it('warns when section_id does not exist in sections', () => {
    const sections = makeSections()
    const leftRail: LeftRailCategory[] = [
      { id: 'nav_a', label: 'A', section_id: 'sec_a' },
      { id: 'nav_z', label: 'Z', section_id: 'sec_z' },
    ]
    const result = validateLeftRailCoherence(sections, leftRail)
    expect(result.isCoherent).toBe(false)
    expect(result.warnings.some((w) => w.includes('sec_z'))).toBe(true)
  })
})
