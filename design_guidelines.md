# Vet2Ceo Mission Generator - Design Guidelines

## Design Approach
**System:** Military-Tactical aesthetic inspired by Linear's precision + Notion's functionality, optimized for dark mode. Focused on clarity, efficiency, and mission-oriented design language.

**Core Principles:**
- Military precision: Clean lines, tactical layout organization
- Mission-first: Every element supports quick action
- Veteran-friendly: Simple, direct, no-nonsense interface

## Typography
**Font Stack:** 
- Primary: Inter (via Google Fonts) - clean, highly legible
- Monospace: JetBrains Mono - for mission codes/timestamps

**Hierarchy:**
- Hero/Titles: text-4xl to text-6xl, font-bold (48-60px)
- Section Headers: text-2xl to text-3xl, font-semibold (24-30px)
- Mission Text: text-lg, font-medium (18px) - high visibility
- Body: text-base (16px)
- Metadata: text-sm, text-gray-400 (14px)

## Layout System
**Spacing Units:** Tailwind scale of 4, 6, 8, 12, 16 (consistent military precision)
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16
- Container: max-w-6xl for main content, max-w-4xl for mission generator

## Component Library

**Mission Generator (Hero Section):**
- Centered card design with tactical border accent
- Three-input system: Time dropdown, Goal selector, Platform picker
- Large "Generate Mission" primary button
- Display area for generated mission with copy-to-clipboard functionality
- Mission counter badge ("Mission #47 Today")

**Template Library:**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Cards with mission template preview, category tag, estimated time
- Quick-action buttons: "Use Template" and "Preview"
- Filter bar: Category tags (Business, Fitness, Learning, Networking)

**Photo Gallery:**
- Masonry grid layout for veteran success photos
- Lightbox overlay on click
- Caption overlay on hover with veteran name + mission accomplished
- Upload new photo CTA for community contribution

**Navigation:**
- Top bar: Logo left, main nav center (Generator, Templates, Gallery, Profile), account right
- Sticky positioning for easy access
- Active state with accent underline

**Footer:**
- Mission statement, quick links, veteran resources
- Social proof: "Missions Completed Today" counter
- Newsletter signup for daily mission inspiration

## Images

**Hero Image:** NO large hero image. The mission generator interface IS the hero - functional first.

**Gallery Images:**
- Required: Veteran success photos (professional headshots, business milestones, achievement moments)
- Placement: Dedicated Photo Gallery page
- Style: High-quality, authentic veteran stories
- Grid: Responsive masonry with 2-4 columns based on viewport

**Template Cards:**
- Small thumbnail icons representing mission categories (business briefcase, fitness weights, book for learning)
- Use Heroicons for consistency
- 24x24px icon size

**Background Elements:**
- Subtle tactical grid pattern overlay (very low opacity)
- Minimal use - maintain focus on functionality

## Accessibility
- WCAG AAA contrast ratios for dark mode (white/light text on dark backgrounds)
- Clear focus states with visible outlines
- Keyboard navigation for all interactive elements
- Screen reader labels for mission generator controls

## Animations
**Minimal & Purposeful:**
- Mission generation: Brief loading state (military-style progress bar)
- Button states: Subtle scale on click (scale-95)
- Page transitions: None - instant navigation
- Gallery lightbox: Simple fade-in (200ms)

**No scroll animations, parallax, or decorative motion** - veterans need straightforward, distraction-free experience.