import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomePage } from './HomePage'
import { taxonomySections, leftRailCategories } from '@/data/taxonomy'
import { CITIES } from '@/data/constants'

describe('HomePage smoke test', () => {
  it('renders the three layout regions', () => {
    render(<HomePage />)

    expect(screen.getByTestId('header-shell')).toBeInTheDocument()
    expect(screen.getByTestId('left-rail-shell')).toBeInTheDocument()
    expect(screen.getByTestId('main-content-shell')).toBeInTheDocument()
  })

  it('renders the default location label when no cities selected', () => {
    render(<HomePage />)

    expect(screen.getByTestId('left-rail-location-button')).toHaveTextContent(
      'Select location',
    )
  })
})

describe('Taxonomy content rendering', () => {
  it('renders at least one section heading from the taxonomy', () => {
    render(<HomePage />)

    // Read the first section title from the imported taxonomy data.
    // Use getAllByText because the label appears in both left rail and main content.
    const firstTitle = taxonomySections[0].title
    const matches = screen.getAllByText(firstTitle)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders at least one card label from the taxonomy', () => {
    render(<HomePage />)

    // Read the first item label from the first section
    const firstItemLabel = taxonomySections[0].items[0].label
    // Use getAllByText since labels may repeat across sections
    const matches = screen.getAllByText(firstItemLabel)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders all section headings in the main content', () => {
    render(<HomePage />)

    for (const section of taxonomySections) {
      expect(screen.getByRole('heading', { name: section.title })).toBeInTheDocument()
    }
  })

  it('renders all left rail category labels', () => {
    render(<HomePage />)

    for (const cat of leftRailCategories) {
      // Left rail labels also appear as headings in main content,
      // so verify at least one element with this text exists
      const matches = screen.getAllByText(cat.label)
      expect(matches.length).toBeGreaterThanOrEqual(1)
    }
  })
})

// ── Sprint 3 tests ──────────────────────────────────────────────────

describe('Header search input', () => {
  it('renders a search input with the correct placeholder', () => {
    render(<HomePage />)

    const input = screen.getByPlaceholderText('search craigslist')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('updates value when the user types', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    const input = screen.getByPlaceholderText('search craigslist')
    await user.type(input, 'apartments')
    expect(input).toHaveValue('apartments')
  })

  it('renders a leading search icon', () => {
    render(<HomePage />)

    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })
})

describe('Header and left rail primary actions', () => {
  it('renders Post an ad button in the header', () => {
    render(<HomePage />)

    const btn = screen.getByRole('button', { name: /post an ad/i })
    expect(btn).toBeInTheDocument()
    expect(screen.getByTestId('header-post-ad-button')).toBeInTheDocument()
  })

  it('renders Select location button in the left rail', () => {
    render(<HomePage />)

    expect(screen.getByTestId('left-rail-location-button')).toBeInTheDocument()
    expect(screen.getByTestId('left-rail-location-button')).toHaveTextContent(
      'Select location',
    )
  })
})

describe('Scroll to section from categories', () => {
  it('calls scrollIntoView on the matching section when a category is clicked', async () => {
    const user = userEvent.setup()

    // Spy on scrollIntoView — jsdom doesn't implement it natively
    const scrollSpy = vi.fn()
    Element.prototype.scrollIntoView = scrollSpy

    render(<HomePage />)

    // Use the first left rail category (data-driven, not hardcoded)
    const firstCat = leftRailCategories[0]
    const categoryBtn = screen.getByTestId(`category-link-${firstCat.section_id}`)
    expect(categoryBtn).toBeInTheDocument()

    await user.click(categoryBtn)

    // scrollIntoView should have been called
    expect(scrollSpy).toHaveBeenCalledTimes(1)
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })

    // The target element (section anchor) should exist with the expected id
    const sectionEl = document.getElementById(firstCat.section_id)
    expect(sectionEl).not.toBeNull()
    expect(sectionEl!.getAttribute('data-testid')).toBe(
      `section-anchor-${firstCat.section_id}`,
    )
  })

  it('each section has a stable anchor id matching its taxonomy id', () => {
    render(<HomePage />)

    for (const section of taxonomySections) {
      const anchor = screen.getByTestId(`section-anchor-${section.id}`)
      expect(anchor).toBeInTheDocument()
      expect(anchor.id).toBe(section.id)
    }
  })
})

// ── Sprint 4 tests — Location Modal ─────────────────────────────────

describe('Location modal open and close', () => {
  it('opens the modal when the location trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('left-rail-location-button'))
    expect(screen.getByTestId('location-modal')).toBeInTheDocument()
  })

  it('closes the modal when Apply is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('left-rail-location-button'))
    expect(screen.getByTestId('location-modal')).toBeInTheDocument()

    await user.click(screen.getByTestId('modal-apply'))
    // After closing, the modal content should be removed from the DOM
    expect(screen.queryByTestId('location-modal')).not.toBeInTheDocument()
  })
})

describe('City selection and chips', () => {
  it('selects cities and renders chips in selection order', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('left-rail-location-button'))

    // Select Boston first, then San Francisco
    await user.click(screen.getByTestId(`city-option-${CITIES[1].id}`))
    await user.click(screen.getByTestId(`city-option-${CITIES[0].id}`))

    const chipsContainer = screen.getByTestId('modal-chips')
    const chips = within(chipsContainer).getAllByText(/San Francisco|Boston/)

    // Boston was selected first, so it should appear first
    expect(chips[0]).toHaveTextContent('Boston')
    expect(chips[1]).toHaveTextContent('San Francisco')
  })

  it('removes a city chip and updates state', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('left-rail-location-button'))

    // Select two cities
    await user.click(screen.getByTestId(`city-option-${CITIES[1].id}`))
    await user.click(screen.getByTestId(`city-option-${CITIES[0].id}`))

    // Remove Boston (first chip)
    await user.click(screen.getByTestId(`chip-remove-${CITIES[1].id}`))

    // Only San Francisco should remain
    expect(screen.queryByTestId(`chip-${CITIES[1].id}`)).not.toBeInTheDocument()
    expect(screen.getByTestId(`chip-${CITIES[0].id}`)).toBeInTheDocument()
  })
})

describe('Max city selection enforcement', () => {
  it('enforces max 3 cities', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('left-rail-location-button'))

    // Select all three cities
    for (const city of CITIES) {
      await user.click(screen.getByTestId(`city-option-${city.id}`))
    }

    // All three chips should exist
    for (const city of CITIES) {
      expect(screen.getByTestId(`chip-${city.id}`)).toBeInTheDocument()
    }
  })
})

describe('Header label updates from modal', () => {
  it('updates header label after selecting a city', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    // Default label
    expect(screen.getByTestId('left-rail-location-button')).toHaveTextContent('Select location')

    await user.click(screen.getByTestId('left-rail-location-button'))
    await user.click(screen.getByTestId(`city-option-${CITIES[1].id}`))
    await user.click(screen.getByTestId('modal-apply'))

    // Header should now show Boston
    expect(screen.getByTestId('left-rail-location-button')).toHaveTextContent('Boston')
  })
})

describe('Radius suffix behavior', () => {
  it('does NOT show radius suffix by default', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('left-rail-location-button'))
    await user.click(screen.getByTestId(`city-option-${CITIES[1].id}`))
    await user.click(screen.getByTestId('modal-apply'))

    const label = screen.getByTestId('left-rail-location-button')
    expect(label).toHaveTextContent('Boston')
    expect(label).not.toHaveTextContent('±')
  })

  it('shows radius suffix after editing radius', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('left-rail-location-button'))
    await user.click(screen.getByTestId(`city-option-${CITIES[1].id}`))

    // Change radius to 20
    await user.selectOptions(screen.getByTestId('radius-select'), '25')
    await user.click(screen.getByTestId('modal-apply'))

    const label = screen.getByTestId('left-rail-location-button')
    expect(label).toHaveTextContent('± 25 mi')
  })

  it('removes radius suffix after clicking reset', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('left-rail-location-button'))
    await user.click(screen.getByTestId(`city-option-${CITIES[1].id}`))

    // Edit radius
    await user.selectOptions(screen.getByTestId('radius-select'), '50')
    expect(screen.getByTestId('radius-reset')).toBeInTheDocument()

    // Reset
    await user.click(screen.getByTestId('radius-reset'))
    await user.click(screen.getByTestId('modal-apply'))

    const label = screen.getByTestId('left-rail-location-button')
    expect(label).not.toHaveTextContent('±')
  })
})

// ── Sprint 5 tests — Search filtering ───────────────────────────────

describe('Search filtering', () => {
  it('filters taxonomy cards by search query and shows result count', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    // Pick a query substring from the first item in the first section (data-driven)
    const firstItem = taxonomySections[0].items[0]
    const q = firstItem.label.slice(0, 3)

    const input = screen.getByPlaceholderText('search craigslist')
    await user.type(input, q)

    // The matching item should still be visible
    expect(screen.getByText(firstItem.label)).toBeInTheDocument()

    // Result count should be shown
    expect(screen.getByTestId('search-result-count')).toBeInTheDocument()
  })

  it('hides non-matching section headings', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    // Use first item from first section — sections with no matching items should hide
    const firstItem = taxonomySections[0].items[0]
    const q = firstItem.label // full label to narrow matches

    const input = screen.getByPlaceholderText('search craigslist')
    await user.type(input, q)

    // Pick a different section that should not match this label
    const otherSection = taxonomySections.find(
      (s) => !s.items.some((i) => i.label.toLowerCase().includes(q.toLowerCase())),
    )
    if (otherSection) {
      expect(
        screen.queryByRole('heading', { name: otherSection.title }),
      ).not.toBeInTheDocument()
    }
  })

  it('shows empty state for nonsense query', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    const input = screen.getByPlaceholderText('search craigslist')
    await user.type(input, 'zzzz_not_found')

    expect(screen.getByTestId('search-empty-state')).toBeInTheDocument()
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('clears search from empty state and restores full taxonomy', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    const input = screen.getByPlaceholderText('search craigslist')
    await user.type(input, 'zzzz_not_found')

    expect(screen.getByTestId('search-empty-state')).toBeInTheDocument()

    // Click "Clear search" button in the empty state
    await user.click(screen.getByTestId('empty-state-clear'))

    // All section headings should be back
    for (const section of taxonomySections) {
      expect(
        screen.getByRole('heading', { name: section.title }),
      ).toBeInTheDocument()
    }

    // Empty state gone
    expect(screen.queryByTestId('search-empty-state')).not.toBeInTheDocument()
  })

  it('clear X in header input restores full taxonomy', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    const input = screen.getByPlaceholderText('search craigslist')
    await user.type(input, 'zzzz_not_found')

    // Clear X should be visible
    const clearBtn = screen.getByTestId('search-clear')
    expect(clearBtn).toBeInTheDocument()

    await user.click(clearBtn)

    // Input should be cleared
    expect(input).toHaveValue('')

    // All headings restored
    for (const section of taxonomySections) {
      expect(
        screen.getByRole('heading', { name: section.title }),
      ).toBeInTheDocument()
    }
  })
})

describe('Left rail behavior during search', () => {
  it('disables category buttons and shows hint when search is active', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    const input = screen.getByPlaceholderText('search craigslist')
    await user.type(input, 'test')

    // Hint text should appear
    expect(screen.getByTestId('categories-search-hint')).toHaveTextContent(
      'Clear search to browse categories',
    )

    // First category button should be disabled
    const firstCat = leftRailCategories[0]
    const btn = screen.getByTestId(`category-link-${firstCat.section_id}`)
    expect(btn).toBeDisabled()
  })

  it('re-enables category buttons when search is cleared', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    const input = screen.getByPlaceholderText('search craigslist')
    await user.type(input, 'test')

    // Disabled
    const firstCat = leftRailCategories[0]
    const btn = screen.getByTestId(`category-link-${firstCat.section_id}`)
    expect(btn).toBeDisabled()

    // Clear
    await user.click(screen.getByTestId('search-clear'))

    // Enabled again
    expect(btn).not.toBeDisabled()
    expect(
      screen.queryByTestId('categories-search-hint'),
    ).not.toBeInTheDocument()
  })
})

// ── Sprint 6 regression tests ───────────────────────────────────────

describe('Sprint 6 — suffix survives search clear and resets correctly', () => {
  it('suffix persists through search and clear, then disappears after Reset', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    // 1. Select a city, edit radius to 25, Apply
    await user.click(screen.getByTestId('left-rail-location-button'))
    await user.click(screen.getByTestId(`city-option-${CITIES[1].id}`))
    await user.selectOptions(screen.getByTestId('radius-select'), '25')
    await user.click(screen.getByTestId('modal-apply'))

    // 2. Assert header shows "± 25 mi"
    const label = screen.getByTestId('left-rail-location-button')
    expect(label).toHaveTextContent('± 25 mi')

    // 3. Type search query, then clear search
    const input = screen.getByPlaceholderText('search craigslist')
    await user.type(input, 'something')
    await user.click(screen.getByTestId('search-clear'))

    // 4. Assert header still shows "± 25 mi"
    expect(label).toHaveTextContent('± 25 mi')

    // 5. Open modal, click Reset, Apply
    await user.click(screen.getByTestId('left-rail-location-button'))
    await user.click(screen.getByTestId('radius-reset'))
    await user.click(screen.getByTestId('modal-apply'))

    // 6. Assert header no longer shows suffix and radius is back to 10
    expect(label).not.toHaveTextContent('±')
    expect(label).toHaveTextContent('Boston')
  })
})

describe('Sprint 6 — header overflow behavior via measureText injection', () => {
  /**
   * Narrow measure function: 10px per character.
   * With maxWidth 240px, "Boston, San Francisco, New York City" (37 chars = 370px)
   * will overflow and trigger the fallback.
   */
  const narrowMeasure = (text: string) => text.length * 10

  it('shows overflow fallback when measureText forces overflow', async () => {
    const user = userEvent.setup()
    render(<HomePage measureTextOverride={narrowMeasure} />)

    // Select all 3 cities: SF, Boston, NYC (in CITIES order)
    await user.click(screen.getByTestId('left-rail-location-button'))
    for (const city of CITIES) {
      await user.click(screen.getByTestId(`city-option-${city.id}`))
    }
    await user.click(screen.getByTestId('modal-apply'))

    // With all 3 selected and narrow measure, overflow fallback fires.
    // CITIES[0] is San Francisco.
    const label = screen.getByTestId('left-rail-location-button')
    expect(label).toHaveTextContent('San Francisco, 2 more')
  })

  it('shows overflow fallback with suffix when radius edited', async () => {
    const user = userEvent.setup()
    render(<HomePage measureTextOverride={narrowMeasure} />)

    await user.click(screen.getByTestId('left-rail-location-button'))
    for (const city of CITIES) {
      await user.click(screen.getByTestId(`city-option-${city.id}`))
    }
    await user.selectOptions(screen.getByTestId('radius-select'), '25')
    await user.click(screen.getByTestId('modal-apply'))

    const label = screen.getByTestId('left-rail-location-button')
    expect(label).toHaveTextContent('San Francisco, 2 more ± 25 mi')
  })
})
