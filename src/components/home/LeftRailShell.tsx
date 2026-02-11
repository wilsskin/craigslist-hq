export function LeftRailShell() {
  return (
    <aside
      data-testid="left-rail-shell"
      className="shrink-0"
      style={{
        width: '240px',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '16px',
      }}
    >
      {/* Post an ad button placeholder area */}
      <div
        data-testid="left-rail-post-button"
        className="w-full py-2 text-center text-sm font-semibold text-white cursor-pointer"
        style={{
          backgroundColor: 'var(--color-link-default)',
          borderRadius: 'var(--radius-button)',
        }}
      >
        post an ad
      </div>

      {/* Event calendar button placeholder area */}
      <div className="mt-6">
        <p
          className="text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          event calendar
        </p>
        <div
          data-testid="left-rail-calendar-placeholder"
          className="w-full h-24 flex items-center justify-center text-xs"
          style={{
            backgroundColor: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-card)',
            color: 'var(--color-text-secondary)',
          }}
        >
          calendar placeholder
        </div>
      </div>

      {/* Additional left rail links placeholder area */}
      <div className="mt-6">
        <p
          className="text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          categories
        </p>
        <div className="flex flex-col gap-1">
          {[
            'community',
            'services',
            'discussion forums',
            'housing',
            'for sale',
            'jobs',
            'gigs',
            'resumes',
          ].map((label) => (
            <div
              key={label}
              className="py-1 text-sm cursor-pointer"
              style={{ color: 'var(--color-link-default)' }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
