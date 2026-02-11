Craigslist Redesign Homepage Prototype
Implementation and Architecture Spec for Cursor

Purpose

Build a single page prototype that recreates the Craigslist homepage with a modern visual hierarchy and a multi city location selection flow. The design must preserve Craigslist taxonomy and density while improving scanability and structure. This prototype is optimized for speed and clarity, not completeness.

Primary focus areas

1. Location selection, including multi city selection, chips, radius, and header summary behavior
2. Homepage hierarchy, including header layout, left rail, and McMaster style category sections

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
4. Selected locations chips row visible on the homepage
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

1. Use the design system page container and max width rules.
2. All spacing uses the design system spacing scale.
3. The left rail plus main content area sits below the header.

Header

Header has one primary row, plus a secondary row for selected location chips.

Header primary row regions

1. Left region
   a. Craigslist logo and identity

2. Center region
   a. A center container that holds
      i. Search input on the left
      ii. Location trigger on the right
   b. This center container is the primary hero element of the page.
   c. Search input includes a search icon inside the input.

3. Right region
   a. Three icon actions, equal visual weight
      i. Create post icon button
      ii. Favorites icon button
      iii. Account icon button
   b. Icon only, no labels.

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

Inputs

1. selectedCities array of city display names
2. radiusMiles number

Rules

1. Use comma and space to join city names for 1 or 2 cities.
2. For 3 cities, show the first city name, then a space, then a vertical bar, then a space, then the count of remaining cities, then a space, then more.
3. If a radius is set, append a space, then plus or minus, then a space, then the radius value, then a space, then mi.
4. No dot separators.

Examples

1. San Francisco
2. San Francisco, Boston
3. San Francisco | 2 more
4. San Francisco, Boston + or - 8 mi
5. San Francisco | 2 more + or - 8 mi

Search input behavior

1. Search input supports typing only.
2. No routing and no results page.
3. Optional: show a toast on submit that says Search submitted, prototype only.

Left rail contract

Sizing

1. Fixed width 240px, including internal padding.
2. Internal padding is 24px left and 24px right.
3. Top padding is 16px.

Left rail content order

1. Create post button
   a. Full width within the left rail padding
   b. Primary button styling from the design system

2. Event calendar block
   a. Title text Event calendar
   b. Calendar visual directly below the title
   c. Calendar is static and matches the general structure of Craigslist month grid

3. Divider or whitespace
   a. Use either a divider line or spacing per the design system

4. Categories block
   a. Label Categories in a secondary text style per the design system
   b. Category list with icon then label for each top level section in the taxonomy JSON
   c. Clicking is not functional in this prototype

Main content contract

McMaster style section layout

1. Render every top level section from the taxonomy JSON in order.
2. Each section includes
   a. A section heading using the design system heading style
   b. A grid of subcategory cards for that section items list

Subcategory cards

1. Cards are small and consistent.
2. Use primarily typographic styling, minimal borders, subtle hover per the design system.
3. Clicking is not functional in this prototype.

Data fixtures

Create a file in the codebase that contains the taxonomy JSON. Use it to render both the left rail categories list and the main content sections.

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

Default radius is 8.

State model

All state is local component state.

1. selectedCities
   a. Default value is an array containing San Francisco only.
   b. Max length is 3.
   c. No duplicates.

2. radiusMiles
   a. Default value is 8.

3. locationQuery
   a. Controls the modal search input.

4. searchQuery
   a. Controls the main search input.

5. isLocationModalOpen
   a. Controls the location modal.

Location modal component spec

Trigger

1. Open when user clicks the header location trigger.

Modal content order

1. Title Location
2. Search input
   a. Placeholder Search by city, neighborhood or ZIP code
   b. Predictive list appears directly under the input, filtered from the three city list
3. Selected locations label
   a. Text reads Selected locations
4. Selected location chips
   a. Render chips for selectedCities
   b. Each chip has a visible X remove control
5. Radius selector
   a. Dropdown showing the radius options
6. Map placeholder
   a. Static image or simple placeholder rectangle
7. Apply button
   a. Bottom right
   b. Closes the modal only

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

1. Clicking the top right close icon closes the modal.

Suggested list behavior

1. Never show cities that are already selected.
2. If all cities are selected, show an empty state message such as All available cities selected.

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
3. Left rail shows Create post button, Event calendar block, and Categories list with icons.
4. Header center shows search input and location trigger.
5. Location modal opens and closes.
6. Selecting a suggested city adds it to selectedCities immediately and updates chips and header label.
7. Removing a city via X updates chips and header label immediately.
8. Radius dropdown changes the header label suffix immediately.
9. Max selected cities is 3 and duplicates are prevented.
10. No backend and no routing is implemented.

Suggested build order

1. Add taxonomy JSON file and city list fixture.
2. Build layout skeleton, header, left rail, main content rendering.
3. Implement location modal with chips, suggested list, radius selector.
4. Wire state model and header label computation.
5. Add styling per the design system and polish spacing and hierarchy.
