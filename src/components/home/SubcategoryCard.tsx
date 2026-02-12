import type { TaxonomyItem } from '@/data/types'

interface SubcategoryCardProps {
  item: TaxonomyItem
}

/**
 * A single subcategory card inside a taxonomy section grid.
 *
 * Design system tokens used:
 * - Border: 1px color.border.default (#EEEEEE)
 * - Radius: radius.card (8px)
 * - Padding: 12px (card default)
 * - Hover: fill color.bg.subtle (#EEEEEE)
 * - Text: type.body — Open Sans 16px, color.text.secondary
 * - Transition: motion.fast (100ms) with primary easing
 *
 * Non-clickable in Sprint 2. No navigation.
 */
export function SubcategoryCard({ item }: SubcategoryCardProps) {
  return (
    <div
      className="py-3 px-3 text-sm transition-colors"
      style={{
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-card)',
        color: 'var(--color-text-primary)',
        fontFamily: '"Open Sans", sans-serif',
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
      {item.label}
    </div>
  )
}
