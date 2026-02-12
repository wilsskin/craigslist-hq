import { leftRailCategories } from '@/data/taxonomy'
import { MapPin } from 'lucide-react'

/**
 * Left rail: fixed 240px width, 24px L/R padding, 16px top padding.
 * Sticky so it stays visible when scrolling. Content: Select location (primary button), then category list.
 */

interface LeftRailShellProps {
  /** Label for the location button (e.g. "select location" or "San Francisco, Boston"). */
  locationLabel: string
  /** Opens the location modal. */
  onLocationTriggerClick: () => void
  /** Callback when a category is clicked - clears search and scrolls to section. */
  onCategoryClick: (sectionId: string) => void
}

export function LeftRailShell({
  locationLabel,
  onLocationTriggerClick,
  onCategoryClick,
}: LeftRailShellProps) {
  return (
    <aside
      data-testid="left-rail-shell"
      className="shrink-0 self-start"
      style={{
        width: '240px',
        paddingRight: '24px',
        paddingLeft: '0px',
        position: 'sticky',
        top: '77px',
        backgroundColor: 'var(--color-bg-page)',
      }}
    >
      {/* Fixed spacer to maintain top padding regardless of scroll */}
      <div style={{ height: '16px', flexShrink: 0 }} aria-hidden="true" />
      {/* Select location — normal weight, black by default; hover: gray background */}
      <button
        data-testid="left-rail-location-button"
        type="button"
        className="flex items-center w-full text-left border-none transition-colors rounded-lg py-2 px-2 -mx-2 mb-3 min-w-0 cursor-pointer"
        style={{
          gap: '4px',
          fontSize: '16px',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          fontFamily: '"Open Sans", sans-serif',
          transitionDuration: 'var(--duration-fast)',
          transitionTimingFunction: 'var(--ease-primary)',
          backgroundColor: 'transparent',
          lineHeight: '1.5',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        onClick={onLocationTriggerClick}
      >
        <span className="shrink-0 flex items-center" style={{ color: 'inherit' }}>
          <MapPin size={20} style={{ color: 'currentColor' }} />
        </span>
        <span className="truncate leading-none" style={{ maxWidth: '192px' }}>
          {locationLabel}
        </span>
      </button>

      {/* Categories list — driven by taxonomy JSON left_rail_categories */}
      <div className="mt-2">
        <p
          className="text-sm font-semibold mb-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          categories
        </p>

        <div className="flex flex-col gap-0">
          {leftRailCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              data-testid={`category-link-${cat.section_id}`}
              className="flex items-center w-full text-left border-none transition-colors rounded-lg py-2 px-2 -mx-2"
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                fontFamily: '"Open Sans", sans-serif',
                transitionDuration: 'var(--duration-fast)',
                transitionTimingFunction: 'var(--ease-primary)',
                cursor: 'pointer',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              onClick={() => {
                onCategoryClick(cat.section_id)
              }}
            >
              <span className="min-w-0 truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
