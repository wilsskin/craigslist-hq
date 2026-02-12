Craigslist Redesign Homepage Prototype
Implementation and Architecture Spec for Cursor

Goal

A single-page prototype that recreates the Craigslist homepage with a modern visual hierarchy and multi-city location selection. The app preserves Craigslist taxonomy and density while improving scanability and structure. It is optimized for speed and clarity, not feature completeness. No backend, no routing, no network calls.

Purpose (original)

Build a single page prototype that recreates the Craigslist homepage with a modern visual hierarchy and a multi city location selection flow. The design must preserve Craigslist taxonomy and density while improving scanability and structure. This prototype is optimized for speed and clarity, not completeness.

Primary focus areas

1. Location selection, including multi city selection, chips, radius, and header summary behavior
2. Homepage hierarchy, including header layout, left rail, and McMaster style category sections

Application structure

- Single route: one page (HomePage). No router.
- State: All page-level state lives in HomePage and is passed down as props. No global store, no duplicated state.
- Layout: HeaderShell spans full page width (border extends edge-to-edge). Content container (24px horizontal padding) wraps two-column row (LeftRailShell 240px fixed, MainContentShell flex-1). LocationModal is portaled and controlled by HomePage.
- Data flow: craigslist_taxonomy.json → src/data/taxonomy.ts (validation, exports taxonomySections, leftRailCategories). Cities and radius options from src/data/constants.ts. HomePage owns selectedCities, radiusMiles, hasEditedRadius, isLocationModalOpen, headerSearchQuery, modalCityQuery.
- Key components:
  - HomePage: state owner, composes HeaderShell, LeftRailShell, MainContentShell, LocationModal; computes filteredSections/matchCount via filterSectionsByQuery(headerSearchQuery) and passes measureTextOverride when provided (e.g. tests).
  - HeaderShell: logo image, search input (with clear X when non-empty), "create post" button, action icons (Star, SquareUser) with circular hover effects. Header border extends full page width. Optional measureTextOverride for tests.
  - LeftRailShell: Location trigger (defaults to "Boston ±10 mi"), Categories list (always enabled, clicking clears search and scrolls to section).
  - MainContentShell: Empty state when zero matches, responsive grid of TaxonomySectionBlock per section (max 8 columns, wraps responsively).
  - LocationModal (shadcn Dialog): city search, city list, chips, radius select + Reset, Apply; right panel map placeholder.
- Pure logic (testable, no React): lib/locationLabel.ts (computeHeaderLocationLabel, createCanvasMeasureText), lib/searchTaxonomy.ts (normalizeQuery, itemMatchesQuery, filterSectionsByQuery).
- Assets: Logo is src/assets/craigslist-logo.png (imported in HeaderShell, height 32px, width auto).

Key decisions (implementation)

1. One page only: no routing, no backend, no API calls. All behavior is client-side and synchronous.
2. Taxonomy is read-only: craigslist_taxonomy.json is the single source of truth; imported and validated at runtime, never mutated.
3. State in HomePage only: selectedCities, radiusMiles, hasEditedRadius, isLocationModalOpen, headerSearchQuery, modalCityQuery. Child components are presentational or receive callbacks; no internal state for domain data.
4. Location label: Real text measurement (canvas) in production for overflow; measureText is injectable so tests can force overflow and assert fallback format without canvas.
5. Radius suffix: Shown when hasEditedRadius is true. Default state has Boston selected with hasEditedRadius=true, so "Boston ±10 mi" displays by default. Reset clears both value and flag.
6. Search: Client-side only; filters taxonomy by item.label (case-insensitive substring). Empty query shows full taxonomy; non-empty hides sections with no matches and shows empty state (no result count displayed). Clearing search does not affect location state.
7. Left rail during search: Category buttons remain enabled and clickable. Clicking a category clears the search query and scrolls to that section.
8. Design system: design_system.md is authoritative for tokens (colors, radius, typography). Header search input uses radius.input (4px); buttons, cards, modal use 8px; chips 16px. Icons from lucide-react.
9. Chips and selection order: Selected cities rendered in selection order; header overflow fallback is "{firstCity}, {n} more".
10. Logo: Header uses image asset (craigslist-logo.png) from src/assets; no text placeholder.
11. Testing: Vitest and React Testing Library; unit tests for lib/locationLabel and lib/searchTaxonomy; integration tests on HomePage for modal, search filtering, left rail disable, header label overflow (via measureTextOverride). No backend or E2E.

Source of truth

1. Use the provided Craigslist design system document as the source of truth for all tokens, typography, colors, spacing, component styling, and interaction styling.
2. Use the taxonomy JSON file produced alongside this document for all category data.

Do not invent new fonts, colors, token values, or component patterns that conflict with the design system.

Tech approach

1. React with TypeScript
2. Tailwind for styling
3. shadcn components for Input, Button, Dialog, and basic primitives
4. lucide icons for all icons

Scope boundaries

In scope

1. One page only, the homepage
2. Header with three regions
3. Location modal with suggested list, selected chips, radius selector, map placeholder, Apply close behavior
4. Selected locations chips row visible on the homepage (not yet implemented; chips currently only inside modal)
5. Left rail with Create post button, Event calendar block, and Categories list
6. Main content sections rendered from the taxonomy JSON with McMaster style headings and subcategory card grids

Out of scope

1. Backend, database, or network calls
2. Real Craigslist routing or new pages
3. Real search results pages
4. Map API integration
5. Keyboard focus customization beyond defaults

User experience and hierarchy goals

1. Keep Craigslist utilitarian and trustworthy. Avoid a glossy marketplace aesthetic.
2. Make primary actions obvious without adding visual noise.
3. Reduce cognitive load by grouping related content and using whitespace and consistent typographic hierarchy.
4. Keep link styling explicit and consistent per the design system.

Page layout contract

Global container

1. Header spans full page width (border extends edge-to-edge). Header content has 24px horizontal padding (px-6).
2. Content container: full width layout, left aligned content, with 24px horizontal padding on desktop (px-6). No centered max width container.
3. All spacing uses the design system spacing scale.
4. The left rail plus main content area sits below the header.

Header

Header has one primary row, plus a secondary row for selected location chips.

Header primary row regions

1. Left region
   a. Craigslist logo: image from src/assets/craigslist-logo.png (height 32px, width auto). Same spacing as prior text logo; data-testid="header-logo-area".

2. Center region
   a. Search input centered in header
      i. Max-width: 400px, width: 100%
      ii. Border-radius: 8px (radius.button)
      iii. Background: #FAFAFA (lighter than page background)
      iv. Border: 1px solid #D0D0D0 (lighter than emphasis border)
      v. Placeholder: "Search anything"
      vi. Search icon (20px) inside input, left-aligned
      vii. Clear button (X icon, 18px) appears when query is non-empty

3. Right region
   a. "create post" button (SquarePen icon + text, lowercase)
      i. Transparent background, border #EEEEEE
      ii. Hover: background #EEEEEE, border #D0D0D0
      iii. Height: 36px, border-radius 8px
   b. Two icon actions with circular hover effects:
      i. Favorites icon (Star, 20px) - circular hover background #EEEEEE, 36px circle
      ii. Account icon (SquareUser, 20px) - circular hover background #EEEEEE, 36px circle
   c. Icons use color.text.primary (#191919). Hover circles are absolutely positioned and don't affect spacing.

Header secondary row

1. Show a label that reads Selected locations
2. Show the selected location chips row with X remove controls
3. This row is aligned under the center region so it feels connected to search and location.

Header location trigger

1. The trigger includes a location icon plus the computed label.
2. The label has a maximum width of 240px.
3. When the label would overflow, use a fallback string that preserves meaning.
4. The trigger opens the Location modal.

Header location label formatting

Implemented in lib/locationLabel.ts as computeHeaderLocationLabel.

Inputs

1. selectedCities array of City objects (id and name)
2. radiusMiles number
3. hasEditedRadius boolean, controls whether the radius suffix appears
4. maxWidthPx number (240 from the header), used for measurement based overflow
5. measureText function injected as a dependency so tests stay deterministic

Rules

1. If selectedCities is empty, return "select location" (lowercase).
2. Join all city names with comma and space.
3. If the measured label width exceeds maxWidthPx, use the overflow fallback: first city name, comma, space, then the count of remaining cities, then space, then "more".
4. Radius suffix only appears when hasEditedRadius is true. Format: space, then the plus minus symbol, then space, then the radius value, then space, then "mi".
5. No dot separators.

Examples

1. select location (empty selection)
2. San Francisco
3. San Francisco, Boston
4. San Francisco, 2 more (overflow fallback)
5. San Francisco, Boston ± 10 mi (radius edited)
6. San Francisco, 2 more ± 20 mi (overflow plus radius)
7. Boston ± 10 mi (default state with Boston selected and hasEditedRadius=true)

Search input behavior

1. Search input filters taxonomy content in real time via headerSearchQuery state.
2. When headerSearchQuery is non-empty, a trailing clear button (lucide X icon, 18px) appears inside the input. Clicking it clears the query and restores the full taxonomy view.
3. Matching rule: case-insensitive substring match against item.label only. Query is trimmed before matching.
4. No routing and no results page. Filtering is performed client-side against the taxonomy JSON.
5. Pure filtering logic lives in lib/searchTaxonomy.ts (normalizeQuery, itemMatchesQuery, filterSectionsByQuery).

Left rail contract

Sizing

1. Fixed width 240px, including internal padding.
2. Internal padding is 24px left and 24px right.
3. Top padding is 16px.

Left rail content order

1. Location trigger button
   a. Displays computed location label (defaults to "Boston ±10 mi")
   b. MapPin icon (20px) with 4px gap to text
   c. Font weight: 400 (normal), font size: 16px
   d. Hover: background fill #EEEEEE (same as category hover)
   e. Bottom margin: 12px (mb-3)
   f. Height matches category buttons for consistent hover box appearance

2. Categories block
   a. Label "categories" in secondary text style, no bottom margin (mb-0)
   b. Category list driven by the left_rail_categories array in the taxonomy JSON
   c. Each entry uses its own stable id as the React key
   d. Category buttons are always enabled and clickable, even during search
   e. Clicking a category clears the search query and scrolls to the matching section
   f. Font weight: 700 (bold), font size: 16px
   g. Hover: background fill #EEEEEE
   h. Height matches location button for consistent hover appearance

Main content contract

McMaster style section layout

1. When headerSearchQuery is empty, render every top level section from the taxonomy JSON in order (full taxonomy view).
2. When headerSearchQuery is non-empty, render only sections that contain matching items (sections with zero matches are hidden entirely). No result count is displayed.
3. When non-empty query produces zero total matches, show an empty state: heading "No results", subtext "Try a different search.", and a "Clear search" primary button that resets the query.
4. Each visible section includes
   a. A section heading using the design system heading style
   b. A responsive grid of subcategory cards for that section's (possibly filtered) items list
   c. Grid: repeat(auto-fit, minmax(72px, max-content)) with max-width 744px (8 columns maximum)
   d. Grid wraps responsively to fewer columns on smaller screens but never exceeds 8 columns per row

Subcategory cards

1. Cards are small and consistent.
2. Use primarily typographic styling, minimal borders, subtle hover per the design system.
3. Clicking is not functional in this prototype.

Data fixtures

The taxonomy JSON lives at the repo root as craigslist_taxonomy.json and must not be modified. It is imported via src/data/taxonomy.ts, which types it, runs a lightweight runtime validation (id uniqueness, shape, left rail coherence), and exports taxonomySections and leftRailCategories for use by components.

City list fixture

Hardcode exactly three cities in a constant

1. San Francisco
2. Boston
3. New York City

Each city item should have a unique id that is not derived from the display label.

Radius fixture

Provide these options

1. 5
2. 8
3. 10
4. 25
5. 50
6. 100

Default radius is 10.

State model

All state is local component state owned by HomePage. No state is duplicated elsewhere.

1. selectedCities
   a. Type: array of City objects (id and name).
   b. Default value is [{ id: 'city_boston', name: 'Boston' }].
   c. Max length is 3.
   d. No duplicates.

2. radiusMiles
   a. Type: number.
   b. Default value is 10.

3. hasEditedRadius
   a. Type: boolean.
   b. Default value is true (so radius displays by default with Boston).
   c. Controls whether the radius suffix appears in the header location label.

4. isLocationModalOpen
   a. Type: boolean.
   b. Default value is false.
   c. Controls the location modal open and close state.

5. headerSearchQuery
   a. Type: string.
   b. Default value is empty string.
   c. Controls the main search input in the header.

6. modalCityQuery
   a. Type: string.
   b. Default value is empty string.
   c. Controls the search input inside the location modal.

Location modal component spec

Trigger

1. Open when user clicks the header location trigger.

Modal layout

Two column layout inside the shadcn Dialog (max width 680px, 8px radius).

Left panel (flex 1, 24px padding, border right separator)
1. Title Location (DialogTitle, Open Sans bold)
2. City search input
   a. Placeholder Search by city, neighborhood or ZIP code
   b. Leading Search icon (16px), emphasis border, 8px radius
   c. Wired to modalCityQuery state, filters city list by case insensitive substring
3. City list
   a. Shows unselected cities that match the query
   b. Each row is a button with a leading MapPin icon
   c. Clicking a row adds the city to selectedCities (appended, preserving order)
   d. Rows are disabled when max 3 cities are already selected
   e. When no unselected cities match, shows "No matching cities"
4. Selected locations label and chips
   a. Label reads Selected locations (secondary text)
   b. Chips rendered for each selectedCities entry in selection order
   c. Each chip has a visible X remove button (lucide X icon, 14px)
   d. Chip styling uses radius.chip (16px), border color.border.default
   e. When no cities are selected, shows "No locations selected"
5. Radius control
   a. Label reads Radius (secondary text)
   b. A native select dropdown showing the radius options from RADIUS_OPTIONS
   c. Changing the value sets radiusMiles and sets hasEditedRadius to true
   d. A Reset action appears only when hasEditedRadius is true. Clicking Reset sets radiusMiles back to 10 and hasEditedRadius back to false.
6. Apply button
   a. Full width primary button at the bottom of the left panel (mt-auto)
   b. Closes the modal only, does not change state

Right panel (fixed 260px width, subtle background)
1. Title reads Map preview (secondary text)
2. A bordered placeholder rectangle (8px radius, white background)
3. When cities are selected, displays their names stacked with MapPin icons and shows the radius if hasEditedRadius is true
4. When no cities are selected, shows "No locations selected"

Modal interactions

City add flow

1. User types in the search input.
2. Suggested list filters to matching cities.
3. User clicks a suggested city.
4. City is added immediately to selectedCities.
5. Chips list updates immediately.
6. Header label updates immediately.
7. The modal remains open.

City remove flow

1. User clicks X on a chip.
2. City is removed immediately.
3. Chips list updates immediately.
4. Header label updates immediately.

Apply behavior

1. Clicking Apply closes the modal.
2. It does not change any state, since state already updated on selection.

Cancel close behavior

1. Clicking the top right close icon (shadcn DialogClose) closes the modal.
2. Escape key and overlay click also close the modal (provided by Radix Dialog).
3. Cancel does not revert state because all changes apply immediately.

Suggested list behavior

1. Never show cities that are already selected.
2. If no unselected cities match the current query, show "No matching cities".

Implementation details that avoid common errors

Unique keys

1. Use the id fields from the taxonomy JSON for React keys.
2. Labels can repeat across sections, do not use label as the key.

Duplicate labels across sections

1. Allow identical labels across different sections.
2. Ensure each item id is unique.

City id handling

1. Use ids such as city_sf, city_boston, city_nyc.
2. Display names remain San Francisco, Boston, New York City.

Header label truncation

1. Set the label container max width to 240px with overflow hidden and no wrap.
2. Use the computed fallback format for 3 cities so the label is less likely to overflow.
3. If you later add more cities, keep the fallback rule based on count.

Mobile behavior

Mobile is not a core deliverable. Implement a simple responsive behavior that prevents layout breakage.

1. Collapse the left rail into a secondary row below the header.
2. Reduce the left rail elements into compact icon controls if needed.
3. Keep search and location accessible.

Acceptance criteria

The prototype is done when all items below are true.

1. Homepage renders with header, left rail, and main content.
2. Main content shows all top level sections and all subcategory cards from taxonomy JSON.
3. Left rail shows Create post button, Event calendar block, and Categories list (icons are a future sprint item).
4. Header center shows search input and location trigger.
5. Location modal opens and closes.
6. Selecting a suggested city adds it to selectedCities immediately and updates chips and header label.
7. Removing a city via X updates chips and header label immediately.
8. Radius dropdown changes the header label suffix immediately.
9. Max selected cities is 3 and duplicates are prevented.
10. No backend and no routing is implemented.

Build progress

Sprint 1 (complete): App scaffold, page shell with three layout regions, page level state, computeHeaderLocationLabel utility with unit tests, smoke tests.

Sprint 2 (complete): Real taxonomy driven content in main content (all sections and cards from JSON), left rail categories list from left_rail_categories with coherence fallback, runtime id validation, rendering smoke tests.

Sprint 3 (complete): Header search input with leading Search icon wired to headerSearchQuery state. Left rail Post an ad (SquarePen, primary) and Event calendar (CalendarDays, secondary) buttons with icons. Header action icons replaced with real lucide icons (SquarePen, Heart, User). Location trigger includes MapPin icon. Left rail categories converted to buttons that scroll to matching main content section via scrollIntoView. Section anchors with scroll-margin-top for header clearance. Tests for search input, button rendering, and scroll mapping.

Sprint 4 (complete): Location modal implemented using shadcn Dialog (Radix). Two column layout: left panel with city search, city list, selected chips, radius dropdown with Reset, and Apply button; right panel with map preview placeholder showing selected cities. All state fully controlled from HomePage (no internal modal state). City add and remove flows update selectedCities, chips, and header label immediately. Max 3 cities enforced. Radius editing sets hasEditedRadius true; Reset returns to default 10 and clears the flag. Modal closes via Apply, close icon, overlay click, or Escape. Tests cover modal open/close, city selection order, chip removal, max enforcement, header label updates, and radius suffix behavior.

Sprint 5 (complete): Header search now filters taxonomy content in real time. Pure filtering utilities in lib/searchTaxonomy.ts (normalizeQuery, itemMatchesQuery, filterSectionsByQuery). MainContentShell accepts filtered sections, displays "Results: N" count, and shows an empty state with "No results" and a "Clear search" button when matchCount is 0. HeaderShell shows a trailing X clear button inside the search input when query is non-empty. Left rail category buttons are disabled with a "Clear search to browse categories" hint while search is active; re-enable when cleared. Tests cover filtering logic (unit), section hiding, clear search, empty state, and left rail disable behavior (integration). Location modal behavior unchanged from Sprint 4.

Sprint 6 (complete): Final polish and spec hardening. Header search input radius corrected to 4px (radius.input per design system). HeaderShell and HomePage accept optional measureTextOverride prop for deterministic overflow testing in jsdom. Confirmed all other radii match design system (buttons 8px, cards 8px, chips 16px, modal dialog 8px). Verified computeHeaderLocationLabel implements all locked rules: empty default, selection order join, overflow fallback "{firstCity}, {n} more", radius suffix only when hasEditedRadius true. Verified suffix stability: editing radius sets flag, Reset clears flag and value, clearing search does not affect location state, opening and closing modal without changes does not toggle suffix. Keyboard sanity pass confirmed: Radix Dialog handles focus trapping and Escape close, all buttons reachable via Tab, disabled category buttons skipped by assistive technology. New unit tests for Sprint 6 locked formatting rules (forced overflow, overflow plus suffix, no default suffix, selection order). New integration tests for suffix persistence through search and clear then disappearance after Reset, and header overflow behavior via measureText injection. All 64 tests pass. No TypeScript errors, no ESLint violations, no runtime console errors.

Post–Sprint 6: Header logo replaced with image asset (src/assets/craigslist-logo.png, 32px height, auto width) instead of text placeholder.

Sprint 7 (complete): UI refinement and polish. Header search bar updated: max-width 400px, border-radius 8px (matches buttons), background #FAFAFA, border #D0D0D0, placeholder "Search anything". Post add button: text changed to "create post" (lowercase), transparent background, border #EEEEEE, hover background #EEEEEE with border #D0D0D0. Header icons: Star and SquareUser with circular hover effects (36px circle, #EEEEEE background, absolutely positioned). Header border extends full page width. Left rail: location button hover uses gray background instead of blue text, gap reduced to 4px, default location set to Boston with 10mi radius displayed (hasEditedRadius=true). Categories always enabled during search, clicking clears search and scrolls to section. Category grid: responsive layout with max 8 columns (744px max-width), wraps responsively. Location label defaults to lowercase "select location". Search results: removed result count display. All buttons and icons properly aligned and centered.

Current implementation state

The application is fully functional with the following features implemented:
- Header with logo, search bar, "create post" button, and action icons
- Left rail with location trigger (defaults to Boston ±10 mi) and category navigation
- Responsive category grid (max 8 columns, wraps on smaller screens)
- Search functionality that filters taxonomy content
- Location modal for multi-city selection with radius control
- All hover states and interactions polished and consistent

Remaining work

1. Add header secondary row for selected location chips (chips currently only inside modal).
2. Event calendar block: currently not implemented; a static month grid calendar is a future item.
