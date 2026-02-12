import type { TaxonomyItem } from '@/data/types'
import { getCategoryIconUrl } from '@/utils/categoryIcons'

interface SubcategoryCardProps {
  item: TaxonomyItem
  sectionId: string
}

/**
 * A single subcategory card inside a taxonomy section grid.
 *
 * McMaster-style layout: 64×64 icon container with 28×28 icon centered inside,
 * label directly below the box. Card max 272px. Wrapping: break at spaces and after slashes; no orphan letters.
 *
 * Design system tokens used:
 * - Icon box: 64×64, border color.border.default, radius.card (8px)
 * - Hover: fill color.bg.subtle on the icon box
 * - Label: Open Sans, color.text.secondary, below box (wraps, no cut-off)
 * - Transition: motion.fast with primary easing
 */
const ICON_BOX_SIZE = 64
const ICON_SIZE = 28
const CARD_MAX_WIDTH = 72

/** Zero-width space: allows break after slashes so "write/add/tran" wraps at "/" not mid-word */
const ZWSP = '\u200B'

/**
 * Inserts break opportunities after slashes so labels like "write/add/tran"
 * wrap as "write/" + "add/tran" (or "write/add/" + "tran") instead of "write/add/tra" + "n".
 */
function labelWithBreakOpportunities(label: string): string {
  return label
    .replace(/\//g, `/${ZWSP}`)
    .replace(/farm\+/gi, `farm+${ZWSP}`)
}

export function SubcategoryCard({ item, sectionId }: SubcategoryCardProps) {
  const iconUrl = getCategoryIconUrl(sectionId, item.id)
  const displayLabel = labelWithBreakOpportunities(item.label)

  return (
    <div
      className="flex flex-col items-center w-fit max-w-full cursor-pointer"
      style={{
        fontFamily: '"Open Sans", sans-serif',
        maxWidth: CARD_MAX_WIDTH,
      }}
    >
      {/* 64×64 box containing the 28×28 icon — McMaster-style image container */}
      <div
        className="flex items-center justify-center shrink-0 transition-colors"
        style={{
          width: ICON_BOX_SIZE,
          height: ICON_BOX_SIZE,
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-card)',
          transitionDuration: 'var(--duration-fast)',
          transitionTimingFunction: 'var(--ease-primary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="shrink-0"
            style={{
              filter: 'brightness(0) saturate(100%) invert(50%)',
            }}
            draggable={false}
          />
        ) : (
          <span
            className="text-xs opacity-40"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            —
          </span>
        )}
      </div>

      {/* Label: break at spaces (e.g. "farm plus" / "garden") and after slashes (e.g. "write/" / "add/tran") */}
      <span
        className="text-center leading-tight mt-1 block w-full min-w-0"
        style={{
          fontSize: '12px',
          lineHeight: 1.4,
          color: 'var(--color-text-secondary)',
          wordBreak: 'normal',
          overflowWrap: 'break-word',
        }}
      >
        {displayLabel}
      </span>
    </div>
  )
}
