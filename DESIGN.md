# Design Brief — NFT Platform Hub

## Direction

Brutalist Minimalism evolved into **Platform Hub** — Typography-led multi-section interface with zero decoration, category-forward navigation.

## Tone

No-nonsense, tech-focused, intentional. Four distinct sections (Mint, Marketplace, Rating, Gallery) unified under dark, card-based hub. Every pixel serves function.

## Differentiation

Typographic hierarchy via size and weight; hub grid with card hover/scale; teal accent signals blockchain action; section pages inherit hub tokens for consistency.

## Color Palette

| Token              | OKLCH         | Role                      |
| ------------------ | ------------- | ------------------------- |
| background         | 0.11 0 0      | Near-black, main surface  |
| foreground         | 0.88 0 0      | Near-white, text          |
| card               | 0.15 0 0      | Elevated surface          |
| card-hover         | 0.18 0 0      | Card hover lift           |
| hub-card-border    | 0.25 0 0      | Subtle divider            |
| primary / accent   | 0.65 0.18 200 | Teal CTA, category label  |
| muted              | 0.2 0 0       | Subtle text               |
| destructive        | 0.55 0.22 25  | Red logout / delete       |

## Typography

- Display: Space Grotesk — headings, hub titles, section headers
- Body: DM Sans — descriptions, form inputs, gallery captions
- Scale: Hub title `text-2xl font-bold`, hub-card-title `text-xl md:text-2xl`, hub-card-accent `text-sm uppercase`, body `text-base`

## Elevation & Depth

Three surface levels: background (0.11), card (0.15), card-hover (0.18). No shadows; lightness alone creates hierarchy. Hub cards scale on hover for interactive feedback.

## Structural Zones

| Zone             | Background      | Border           | Notes                          |
| ---------------- | --------------- | ---------------- | ------------------------------ |
| Header           | card (0.15)     | border           | User principal, logout button  |
| Hub Grid         | background      | —                | 2x2 category cards, responsive |
| Hub Card         | card (0.15)     | hub-card-border  | Icon, title, desc, hover scale |
| Section Header   | card (0.15)     | border-b         | Section title, breadcrumb      |
| Section Content  | background      | —                | Form/gallery per section       |

## Component Patterns

- Hub Cards: bg-card, 1px hub-card-border, hover:bg-card-hover hover:scale-105, teal accent label
- Buttons: Teal fill, no radius, white text, hover darkens
- Badges: Uppercase `text-xs`, muted background, monospace
- Inputs: bg-input, border-border, monospace for addresses
- Section Cards: Inherit hub-card styling for consistency across Mint/Marketplace/Rating/Gallery

## Motion

- Hub Card Hover: scale(1.05) + bg-card-hover on 0.2s ease
- Entrance: Fade-in on gallery items (300ms)
- Hover: Interactive elements signal responsiveness via scale or color shift
- Decorative: None — motion is functional only

## Constraints

- No rounded corners on hub cards (sharp, intentional)
- No gradients, textures, or decorative elements
- Contrast >= 4.5:1 on all text
- Mobile-first: hub 1-col on sm, 2x2 on md+; section pages stack form above gallery

## Signature Detail

Hub-first navigation via dark card grid with teal labels. Each section inherits the card aesthetic for cohesion. Hover feedback (scale + lightness lift) signals platform unity.
