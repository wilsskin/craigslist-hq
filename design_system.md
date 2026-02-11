# Craigslist Redesign Design System (Cursor Spec)
## Goal
Modernize Craigslist by improving readability, hierarchy, and interaction clarity while preserving
the familiar Craigslist layout and information architecture.
Design adjectives:
- Utilitarian
- Trustworthy
- Fast
Non goals:
- Do not redesign all of Craigslist.
- Do not introduce “marketplace modern” visuals like heavy cards, large imagery, glossy
gradients, or prominent shadows.
- Do not change the mental model of the homepage layout. Keep it recognizable as Craigslist.
## Visual Principles
1. Familiar first
Keep Craigslist’s structure and hierarchy recognizable. Improvements should feel like cleanup
and refinement, not a rebrand.
2. Readability over decoration
Improve spacing rhythm, typography clarity, and scanability. Avoid visual noise.
3. Interaction is explicit
Links look like links. Hover states are obvious but subtle. No ambiguous click targets.
## Tokens
### Color
Surface and neutral system:
- `color.bg.page`: `#FFFFFF` (entire page background)
- `color.bg.subtle`: `#EEEEEE` (subtle section background when needed)
- `color.border.default`: `#EEEEEE` (default borders)
- `color.border.emphasis`: `#727272` (use sparingly, only where explicitly allowed)
- `color.text.primary`: `#191919`
- `color.text.secondary`: `#727272`
- `color.icon.default`: `#727272`
Brand and interaction colors:
- `color.link.default`: `#0020E5` (Craigslist blue)
- `color.link.visited`: `#800080` (Craigslist purple, also logo purple)
- `color.logo.purple`: `#800080` (logo only)
Usage rules:
- Page background is always white.
- Cards have no default fill.
- Subtle background blocks use `#EEEEEE` sparingly.
- Default borders are `#EEEEEE`. Emphasis borders are `#727272` only for search inputs.
- No drop shadows unless extremely subtle and necessary. Default is none.
### Typography
Font families:
- Headings:
- H1, H2: Times New Roman
- H3: Open Sans
- Body: Open Sans
Desktop type scale:
- `type.h1`: 32px, line height 1.2, weight 700, color primary
- `type.h2`: 24px, line height 1.25, weight 700, color primary
- `type.h3`: 18px, line height 1.3, weight 700, color primary, font Open Sans
- `type.body`: 16px, line height 1.5, weight 400, color secondary
- `type.note`: 13px, line height 1.4, weight 400, color secondary
Mobile scale (450px and below):
- `type.h1`: 28px
- `type.h2`: 20px
- `type.h3`: 16px
- Body stays readable, do not go below 13px for any body like text.
### Spacing
Base grid:
- Use an 8px spacing system.
- Prefer spacing values: 8, 16, 24, 32, 40.
Rhythm rules:
- After headings: use a small gap before content.
- Between paragraphs: 16px.
- Between category blocks: 32px.
- Major section separation: 40px.
### Layout
- Full width layout.
- Left aligned content.
- Horizontal padding:
- Desktop: 24px
- Mobile: 16px
### Radius
- `radius.input`: 4px
- `radius.card`: 8px
- `radius.button`: 8px
- `radius.chip`: 16px
No pill buttons.
### Motion
Durations:
- `motion.fast`: 100ms
- `motion.default`: 200ms
Easing:
- Primary (modern ease out for most transitions): `cubic-bezier(0.16, 1, 0.3, 1)`
- Secondary (standard UI curve for non hover transitions): `cubic-bezier(0.4, 0, 0.2, 1)`
Usage:
- Hover transitions: fast or default with primary easing.
- Open close and subtle fades: default with secondary easing.
- Avoid bouncy or playful animation.
## Interaction Rules
### Links
- Default state: blue `#0020E5`, no underline.
- Hover state: underline appears.
- Visited state: purple `#800080`.
- Links should remain clearly identifiable as links. Avoid turning links into buttons visually.
### Focus states
- No global focus ring system.
- Do not add a 2px focus ring.
- Rely on hover and pressed states for clarity.
- Accessibility: ensure keyboard focus is still visible using subtle, non ring changes where
required by the platform, but do not introduce a prominent ring design language.
### Hover and pressed states
Buttons:
- Hover uses a black overlay at 20 percent while preserving readability and contrast.
- Pressed state can be slightly stronger than hover.
Cards:
- Default has no fill.
- On hover, background fill becomes `#EEEEEE`.
## Components
### Search Input
Purpose:
Primary functional element on homepage.
Specs:
- Height: minimum 44px.
- Border: 1px `#727272` emphasis border.
- Radius: 4px.
- Text: Open Sans 16px.
- Icon: magnifying glass, left aligned inside the field, color `#727272`.
- No search icon button. The icon is inside the input.
### Buttons
Primary button:
- Fill: `#0020E5`
- Text: white
- Radius: 8px
- Hover: black overlay at 20 percent
Secondary button:
- Fill: white
- Border: 1px `#191919`
- Text: `#191919`
- Radius: 8px
- Hover: black overlay at 20 percent
### Chips
- Outline chips with subtle fill on hover.
- Radius: 16px
- Default: border `#EEEEEE`, text `#191919` or `#727272` depending on hierarchy.
- Hover: subtle fill, use `#EEEEEE`.
### Cards
- Default: no fill
- Border: 1px `#EEEEEE`
- Radius: 8px
- Padding: 12px default, 16px for larger card sections
- Hover: fill `#EEEEEE`
- If a card is clickable, ensure hover indicates clickability.
### Icons
- Use lucide icons.
- Default size: 20px.
- Default color: `#727272`.
- Active state may use `#0020E5` sparingly.
## Do and Do Not
Do:
- Keep homepage structure recognizable.
- Prioritize scanability and clear link styling.
- Use whitespace and subtle borders for separation.
Do not:
- No hero imagery, no decorative illustrations.
- No glossy gradients, no strong shadows, no modern marketplace card heavy layout.
- No pill buttons.
- No global focus ring design language.