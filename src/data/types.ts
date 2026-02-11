/** A single item within a taxonomy section */
export interface TaxonomyItem {
  id: string
  label: string
}

/** A top-level section in the taxonomy */
export interface TaxonomySection {
  id: string
  title: string
  items: TaxonomyItem[]
}

/** A left-rail category navigation entry */
export interface LeftRailCategory {
  id: string
  label: string
  section_id: string
}

/** The full taxonomy JSON shape */
export interface TaxonomyData {
  sections: TaxonomySection[]
  left_rail_categories: LeftRailCategory[]
  meta: {
    notes: string[]
  }
}

/** A selectable city */
export interface City {
  id: string
  name: string
}
