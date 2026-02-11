export function MainContentShell() {
  return (
    <main data-testid="main-content-shell" className="flex-1 min-w-0 pt-4">
      {/* Taxonomy sections placeholder container */}
      <div className="flex flex-col" style={{ gap: '32px' }}>
        {/* Placeholder skeleton showing multiple section blocks */}
        {['community', 'services', 'discussion forums', 'housing', 'for sale', 'jobs', 'gigs', 'resumes'].map(
          (section) => (
            <div key={section}>
              {/* Section heading */}
              <h2
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  color: 'var(--color-text-primary)',
                  lineHeight: '1.25',
                }}
              >
                {section}
              </h2>

              {/* Subcategory cards placeholder grid */}
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`${section}-placeholder-${i}`}
                    className="py-2 px-3 text-sm"
                    style={{
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-card)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    &mdash;
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </main>
  )
}
