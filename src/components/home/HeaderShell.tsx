import { Search, SquarePen, Star, User, X } from 'lucide-react'
import craigslistLogo from '@/assets/craigslist-logo.png'
import { Button } from '@/components/ui/button'

interface HeaderShellProps {
  headerSearchQuery: string
  onSearchQueryChange: (query: string) => void
}

export function HeaderShell({
  headerSearchQuery,
  onSearchQueryChange,
}: HeaderShellProps) {
  return (
    <header
      data-testid="header-shell"
      className="w-full border-b"
      style={{
        borderColor: 'var(--color-border-default)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'var(--color-bg-page)',
      }}
    >
      <div className="flex items-center justify-between py-4 gap-6 px-6">
        {/* Logo area */}
        <div className="shrink-0" data-testid="header-logo-area">
          <img
            src={craigslistLogo}
            alt="craigslist"
            className="block"
            style={{
              height: '32px',
              width: 'auto',
            }}
          />
        </div>

        {/* Center region: search only */}
        <div className="flex flex-1 items-center justify-center">
          <div
            className="flex items-center min-h-[44px]"
            data-testid="header-search-area"
            style={{
              width: '100%',
              maxWidth: '400px',
              border: '1px solid #D0D0D0',
              borderRadius: 'var(--radius-button)',
              backgroundColor: '#FAFAFA',
            }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              data-testid="search-icon"
              style={{
                paddingLeft: '12px',
                color: 'var(--color-icon-default)',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search size={20} />
            </span>
            <input
              type="text"
              placeholder="search anything"
              value={headerSearchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full py-2 text-base outline-none bg-transparent box-border"
              style={{
                paddingLeft: '8px',
                paddingRight: headerSearchQuery ? '4px' : '12px',
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '16px',
                lineHeight: 1,
                color: 'var(--color-text-primary)',
                border: 'none',
              }}
            />
            {headerSearchQuery && (
              <button
                type="button"
                data-testid="search-clear"
                className="flex items-center justify-center shrink-0 cursor-pointer bg-transparent border-none p-0"
                style={{
                  paddingRight: '10px',
                  color: 'var(--color-icon-default)',
                }}
                onClick={() => onSearchQueryChange('')}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Post an ad (primary button) + action icons; 24px gap between items */}
        <div
          className="shrink-0 flex items-center gap-6"
          data-testid="header-actions-area"
        >
          <Button
            variant="outline"
            size="default"
            data-testid="header-post-ad-button"
            className="h-9 cursor-pointer rounded-lg border bg-transparent px-4 py-2 font-semibold text-[var(--color-text-primary)] shadow-none hover:bg-[var(--color-bg-subtle)] [&_svg]:size-4 [&_svg]:shrink-0 flex items-center gap-2"
            style={{
              borderColor: 'var(--color-border-default)',
              fontFamily: '"Open Sans", sans-serif',
              lineHeight: 1,
              transition:
                'background-color var(--duration-fast) var(--ease-primary), border-color var(--duration-fast) var(--ease-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D0D0D0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-default)'
            }}
            onClick={() => console.log('[header] Post an ad clicked')}
          >
            <SquarePen style={{ lineHeight: 1 }} />
            <span style={{ lineHeight: 1 }}>create post</span>
          </Button>
          <button
            type="button"
            className="relative flex cursor-pointer items-center justify-center border-none p-0"
            title="Favorites"
            style={{
              color: 'var(--color-text-primary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              const circle = e.currentTarget.querySelector('.hover-circle') as HTMLElement
              if (circle) circle.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const circle = e.currentTarget.querySelector('.hover-circle') as HTMLElement
              if (circle) circle.style.opacity = '0'
            }}
            onClick={() => console.log('[header] Favorites clicked')}
          >
            <span
              className="hover-circle absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                opacity: 0,
                transition: 'opacity var(--duration-fast) var(--ease-primary)',
                pointerEvents: 'none',
              }}
            />
            <Star size={20} className="relative z-10" />
          </button>
          <button
            type="button"
            className="relative flex cursor-pointer items-center justify-center border-none p-0"
            title="Account"
            style={{
              color: 'var(--color-text-primary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              const circle = e.currentTarget.querySelector('.hover-circle') as HTMLElement
              if (circle) circle.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const circle = e.currentTarget.querySelector('.hover-circle') as HTMLElement
              if (circle) circle.style.opacity = '0'
            }}
            onClick={() => console.log('[header] Account clicked')}
          >
            <span
              className="hover-circle absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                opacity: 0,
                transition: 'opacity var(--duration-fast) var(--ease-primary)',
                pointerEvents: 'none',
              }}
            />
            <User size={20} className="relative z-10" />
          </button>
        </div>
      </div>
    </header>
  )
}
