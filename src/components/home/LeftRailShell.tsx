import { leftRailCategories } from '@/data/taxonomy'
import { SquarePen, CalendarDays } from 'lucide-react'

/**
 * Left rail: fixed 240px width, 24px L/R padding, 16px top padding.
 *
 * Content order per spec:
 * 1. Post an ad button (primary, full width, SquarePen icon)
 * 2. Event calendar button (secondary, full width, CalendarDays icon)
 * 3. Categories list (driven by left_rail_categories from taxonomy JSON)
 *
 * Sprint 3: categories are clickable buttons that scroll to the matching section.
 * Sprint 5: categories are disabled while a search query is active.
 */

interface LeftRailShellProps {
  /** When true, category buttons are disabled and a hint is shown. */
  isSearchActive?: boolean
}

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function LeftRailShell({ isSearchActive = false }: LeftRailShellProps) {
  return (
    <aside
      data-testid="left-rail-shell"
      className="shrink-0"
      style={{
        width: '240px',
        paddingRight: '24px',
        paddingTop: '16px',
      }}
    >
      {/* Post an ad — primary button per design system */}
      <button
        data-testid="left-rail-post-button"
        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white cursor-pointer transition-colors"
        style={{
          backgroundColor: 'var(--color-link-default)',
          borderRadius: 'var(--radius-button)',
          border: 'none',
          fontFamily: '"Open Sans", sans-serif',
          transitionDuration: 'var(--duration-fast)',
          transitionTimingFunction: 'var(--ease-primary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'brightness(0.8)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'none'
        }}
        onClick={() => console.log('[left-rail] Post an ad clicked')}
      >
        <span data-testid="post-ad-icon" className="flex items-center">
          <SquarePen size={16} />
        </span>
        post an ad
      </button>

      {/* Event calendar — secondary button per design system */}
      <button
        data-testid="left-rail-calendar-button"
        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold cursor-pointer transition-colors mt-2"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-text-primary)',
          borderRadius: 'var(--radius-button)',
          color: 'var(--color-text-primary)',
          fontFamily: '"Open Sans", sans-serif',
          transitionDuration: 'var(--duration-fast)',
          transitionTimingFunction: 'var(--ease-primary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'brightness(0.8)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'none'
        }}
        onClick={() => console.log('[left-rail] Event calendar clicked')}
      >
        <span data-testid="event-calendar-icon" className="flex items-center">
          <CalendarDays size={16} />
        </span>
        event calendar
      </button>

      {/* Categories list — driven by taxonomy JSON left_rail_categories */}
      <div className="mt-6">
        <p
          className="text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          categories
        </p>

        {isSearchActive && (
          <p
            data-testid="categories-search-hint"
            className="text-xs mb-2"
            style={{
              color: 'var(--color-text-secondary)',
              fontFamily: '"Open Sans", sans-serif',
            }}
          >
            Clear search to browse categories
          </p>
        )}

        <div className="flex flex-col gap-1">
          {leftRailCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              data-testid={`category-link-${cat.section_id}`}
              disabled={isSearchActive}
              aria-disabled={isSearchActive}
              className="py-1 text-sm text-left bg-transparent border-none transition-colors p-0"
              style={{
                color: isSearchActive
                  ? 'var(--color-text-secondary)'
                  : 'var(--color-link-default)',
                fontFamily: '"Open Sans", sans-serif',
                transitionDuration: 'var(--duration-fast)',
                transitionTimingFunction: 'var(--ease-primary)',
                cursor: isSearchActive ? 'default' : 'pointer',
                opacity: isSearchActive ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSearchActive)
                  e.currentTarget.style.textDecoration = 'underline'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none'
              }}
              onClick={() => {
                if (!isSearchActive) scrollToSection(cat.section_id)
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
