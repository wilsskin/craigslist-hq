import type { TaxonomySection } from '@/data/types'
import { SubcategoryCard } from './SubcategoryCard'

interface TaxonomySectionBlockProps {
  section: TaxonomySection
}

/**
 * A single taxonomy section: heading + grid of subcategory cards.
 *
 * Design system tokens used:
 * - Heading: type.h2 — Times New Roman 24px, weight 700, line-height 1.25
 * - Gap after heading: small gap (8px per spacing rhythm)
 * - Grid gap: 8px (base grid unit)
 * - Between sections: 32px (handled by parent via gap)
 *
 * Sprint 3: id attribute on section for scroll-to targeting from left rail.
 * scroll-margin-top prevents the header from obscuring the heading.
 */
export function TaxonomySectionBlock({ section }: TaxonomySectionBlockProps) {
  return (
    <section
      id={section.id}
      data-testid={`section-anchor-${section.id}`}
      style={{ scrollMarginTop: '80px' }}
    >
      <h2
        className="text-2xl font-bold mb-2"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          color: 'var(--color-text-primary)',
          lineHeight: '1.25',
          fontSize: '24px',
          paddingLeft: '4px',
        }}
      >
        {section.title}
      </h2>

      <div
        className="grid justify-items-start"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(72px, max-content))',
          gap: '8px 8px', // row-gap column-gap: 16px vertical, 8px horizontal
          maxWidth: '800px',
        }}
      >
        {section.items.map((item) => (
          <SubcategoryCard key={item.id} item={item} sectionId={section.id} />
        ))}
      </div>
    </section>
  )
}
