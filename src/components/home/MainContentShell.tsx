import type { TaxonomySection } from '@/data/types'
import { TaxonomySectionBlock } from './TaxonomySectionBlock'

interface MainContentShellProps {
  /** Sections to render (filtered or full). */
  sections: TaxonomySection[]
  /** Total match count from filtering. -1 means no search is active. */
  matchCount: number
  /** Callback to clear the search query (used in empty state). */
  onClearSearch: () => void
}

/**
 * Main content column: renders taxonomy sections.
 *
 * Design system spacing:
 * - Between category blocks: 32px
 * - Top padding: 16px (aligns with left rail top padding)
 */
export function MainContentShell({
  sections,
  matchCount,
  onClearSearch,
}: MainContentShellProps) {
  const isSearching = matchCount !== -1

  return (
    <main
      data-testid="main-content-shell"
      className="flex-1 min-w-0 pt-4"
      style={{ paddingBottom: '64px' }}
    >
      {/* Empty state */}
      {isSearching && matchCount === 0 && (
        <div
          data-testid="search-empty-state"
          className="flex flex-col items-center justify-center py-16"
        >
          <h3
            className="text-lg font-bold mb-2"
            style={{
              fontFamily: '"Open Sans", sans-serif',
              color: 'var(--color-text-primary)',
            }}
          >
            No results
          </h3>
          <p
            className="text-sm mb-4"
            style={{
              color: 'var(--color-text-secondary)',
              fontFamily: '"Open Sans", sans-serif',
            }}
          >
            Try a different search.
          </p>
          <button
            type="button"
            data-testid="empty-state-clear"
            className="px-4 py-2 text-sm font-semibold text-white cursor-pointer"
            style={{
              backgroundColor: 'var(--color-link-default)',
              borderRadius: 'var(--radius-button)',
              border: 'none',
              fontFamily: '"Open Sans", sans-serif',
            }}
            onClick={onClearSearch}
          >
            Clear search
          </button>
        </div>
      )}

      {/* Taxonomy sections */}
      {sections.length > 0 && (
        <div className="flex flex-col" style={{ gap: '32px' }}>
          {sections.map((section) => (
            <TaxonomySectionBlock key={section.id} section={section} />
          ))}
        </div>
      )}
    </main>
  )
}
