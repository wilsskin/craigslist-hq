import { describe, it, expect } from 'vitest'
import {
  normalizeQuery,
  itemMatchesQuery,
  filterSectionsByQuery,
} from './searchTaxonomy'
import type { TaxonomySection } from '@/data/types'

describe('normalizeQuery', () => {
  it('trims whitespace and lowercases', () => {
    expect(normalizeQuery('  Hello World  ')).toBe('hello world')
  })

  it('returns empty string for whitespace-only input', () => {
    expect(normalizeQuery('   ')).toBe('')
  })
})

describe('itemMatchesQuery', () => {
  it('matches case insensitive substring', () => {
    expect(itemMatchesQuery('Automotive', 'auto')).toBe(true)
    expect(itemMatchesQuery('Automotive', 'AUTO')).toBe(true)
  })

  it('returns false when no match', () => {
    expect(itemMatchesQuery('Automotive', 'zzz')).toBe(false)
  })

  it('returns true for empty query', () => {
    expect(itemMatchesQuery('anything', '')).toBe(true)
  })
})

describe('filterSectionsByQuery', () => {
  const sections: TaxonomySection[] = [
    {
      id: 'sec_a',
      title: 'Section A',
      items: [
        { id: 'a1', label: 'activities' },
        { id: 'a2', label: 'artists' },
      ],
    },
    {
      id: 'sec_b',
      title: 'Section B',
      items: [
        { id: 'b1', label: 'beauty' },
        { id: 'b2', label: 'books' },
      ],
    },
  ]

  it('returns original sections and matchCount -1 for empty query', () => {
    const result = filterSectionsByQuery(sections, '')
    expect(result.filteredSections).toBe(sections) // same reference
    expect(result.matchCount).toBe(-1)
  })

  it('returns original sections for whitespace-only query', () => {
    const result = filterSectionsByQuery(sections, '   ')
    expect(result.filteredSections).toBe(sections)
    expect(result.matchCount).toBe(-1)
  })

  it('filters items by case insensitive substring', () => {
    const result = filterSectionsByQuery(sections, 'art')
    expect(result.matchCount).toBe(1)
    expect(result.filteredSections).toHaveLength(1)
    expect(result.filteredSections[0].id).toBe('sec_a')
    expect(result.filteredSections[0].items).toHaveLength(1)
    expect(result.filteredSections[0].items[0].label).toBe('artists')
  })

  it('excludes sections with zero matching items', () => {
    const result = filterSectionsByQuery(sections, 'beau')
    expect(result.filteredSections).toHaveLength(1)
    expect(result.filteredSections[0].id).toBe('sec_b')
    expect(result.matchCount).toBe(1)
  })

  it('returns empty array and matchCount 0 when nothing matches', () => {
    const result = filterSectionsByQuery(sections, 'zzzzz')
    expect(result.filteredSections).toHaveLength(0)
    expect(result.matchCount).toBe(0)
  })

  it('does not mutate input arrays', () => {
    const originalItems = [...sections[0].items]
    filterSectionsByQuery(sections, 'act')
    expect(sections[0].items).toEqual(originalItems)
  })
})
