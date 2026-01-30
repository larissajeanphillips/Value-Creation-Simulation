# McKinsey Style Guide

This document defines the design system and component patterns for McKinsey-branded applications.

## Quick Links

| Resource | Description |
|----------|-------------|
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | CSS variables, colors, and Tailwind config |
| [code-templates/](../code-templates/) | Component, Hook, and Store templates |

---

## 1. Brand Overview

McKinsey's visual identity is characterized by:
- **Deep navy backgrounds** (#051C2C) for authority and sophistication
- **Vibrant electric blue** (#2251FF) for calls-to-action and highlights
- **Serif display typography** (Bower) for headlines
- **Clean sans-serif** (McKinsey Sans or system fonts) for body text
- **High contrast** white text on dark backgrounds
- **Pill-shaped** buttons and inputs for a modern, approachable feel

---

## 2. Color Palette

### Primary Colors

| Color | Hex | HSL | Tailwind | Usage |
|-------|-----|-----|----------|-------|
| **McKinsey Blue** | `#2251FF` | `226 100% 57%` | `bg-mck-blue` | Primary CTAs, active links, highlights |
| **Electric Blue** | `#0060FF` | `218 100% 50%` | `bg-mck-electric` | Hover states, secondary blue |
| **Deep Navy** | `#051C2C` | `207 73% 10%` | `bg-mck-navy` | Primary dark backgrounds, header |
| **Dark Navy** | `#0A2540` | `209 76% 15%` | `bg-mck-dark-navy` | Secondary dark sections, cards on dark |

### Neutral Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **White** | `#FFFFFF` | Text on dark, light backgrounds |
| **Off White** | `#F7F7F7` | Light section backgrounds |
| **Light Gray** | `#E5E5E5` | Borders, dividers, input borders |
| **Muted Gray** | `#6B7280` | Secondary text, placeholders |
| **Slate** | `#64748B` | Tertiary text, labels |

### Status Colors

| Status | Color | Hex | Tailwind |
|--------|-------|-----|----------|
| Success | Emerald | `#059669` | `text-emerald-600` |
| Warning | Amber | `#F59E0B` | `text-amber-500` |
| Error | Red | `#DC2626` | `text-red-600` |
| Info | McKinsey Blue | `#2251FF` | `text-mck-blue` |

---

## 3. Typography

### Font Families

| Font | Fallbacks | Usage |
|------|-----------|-------|
| **Bower** | Georgia, Times New Roman, serif | Display headings (hero, section titles) |
| **McKinsey Sans** | Helvetica Neue, Arial, sans-serif | Body text, UI elements |

### Type Scale

| Element | Class | Size | Weight | Usage |
|---------|-------|------|--------|-------|
| **Hero Title** | `text-5xl md:text-7xl font-display` | 48-72px | Normal | Main page headlines |
| **Section Title** | `text-3xl md:text-4xl font-display` | 30-36px | Normal | Section headers |
| **Card Title** | `text-xl font-semibold` | 20px | 600 | Card/component headers |
| **Body Large** | `text-lg` | 18px | 400 | Featured paragraphs |
| **Body** | `text-base` | 16px | 400 | Standard text |
| **Body Small** | `text-sm` | 14px | 400 | Secondary text |
| **Caption** | `text-xs` | 12px | 400 | Labels, hints |
| **Label** | `text-xs font-bold uppercase tracking-wider` | 12px | 700 | Category labels |

### Typography Patterns

```tsx
// Hero Headline (serif display)
<h1 className="font-display text-5xl md:text-7xl text-white leading-tight">
  What's your next<br />
  <span className="text-mck-blue">brilliant</span> move?
</h1>

// Section Header
<h2 className="font-display text-3xl md:text-4xl text-foreground">
  How we help clients
</h2>

// Category Label (all caps)
<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
  CASE STUDY
</span>

// Body Text on Dark Background
<p className="text-lg text-white/80">
  Game-changing work. People-powered growth.
</p>
```

---

## 4. Spacing & Layout

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `p-4` / `gap-4` | 16px | Compact spacing |
| `p-6` / `gap-6` | 24px | Standard component padding |
| `p-8` / `gap-8` | 32px | Section padding (small) |
| `py-16` / `py-20` | 64-80px | Section vertical padding |
| `py-24` | 96px | Hero section vertical padding |

### Container & Max Width

```tsx
// Standard container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Narrow content (for reading)
<div className="max-w-3xl mx-auto px-4">
```

---

## 5. Component Patterns

### Buttons

McKinsey buttons are **pill-shaped** (fully rounded) with clear hierarchy.

```tsx
// Primary Button (Blue)
<button className="rounded-full px-6 py-3 bg-mck-blue text-white font-medium 
                   hover:bg-mck-electric transition-colors">
  Explore Careers
</button>

// Secondary Button (Outline on dark)
<button className="rounded-full px-6 py-3 bg-transparent border border-white 
                   text-white font-medium hover:bg-white/10 transition-colors">
  Learn More
</button>

// Dark Button (for light backgrounds)
<button className="rounded-full px-6 py-3 bg-mck-navy text-white font-medium 
                   hover:bg-mck-dark-navy transition-colors">
  Submit
</button>

// Ghost/Text Button with Arrow
<button className="inline-flex items-center font-semibold text-mck-blue 
                   hover:underline">
  Listen here
  <ArrowRight className="h-4 w-4 ml-2" />
</button>
```

### Inputs & Forms

```tsx
// Email Input (Pill Shape)
<input 
  type="email"
  placeholder="Email address"
  className="rounded-full border border-input bg-white px-4 py-3 w-full
             focus:ring-2 focus:ring-mck-blue focus:border-transparent 
             placeholder:text-muted-foreground"
/>

// Input with Submit Button
<div className="flex gap-2">
  <input className="rounded-full border border-input bg-white px-4 py-3 flex-1" />
  <button className="rounded-full px-6 py-3 bg-mck-blue text-white">
    <ArrowRight className="h-5 w-5" />
  </button>
</div>

// Search Input
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
  <input 
    type="search"
    placeholder="Search..."
    className="rounded-full border border-input bg-white pl-12 pr-4 py-3 w-full"
  />
</div>
```

### Cards

```tsx
// Light Card (on light background)
<div className="rounded-[22px] border border-border bg-card p-6 shadow-sm">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-muted-foreground">Card content goes here.</p>
</div>

// Dark Card (on dark background)
<div className="rounded-[22px] bg-mck-dark-navy p-6">
  <span className="text-xs font-bold uppercase tracking-wider text-white/60">
    ARTICLE
  </span>
  <h3 className="text-xl font-semibold text-white mt-2">Card Title</h3>
</div>

// Image Card with Overlay Text
<div className="relative rounded-[22px] overflow-hidden group">
  <img src="..." className="w-full h-64 object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
  <div className="absolute bottom-4 left-4 right-4">
    <span className="text-xs font-bold uppercase text-white/80">CASE STUDY</span>
    <h3 className="text-lg font-semibold text-white mt-1">
      Article Title Here
    </h3>
  </div>
</div>
```

### Navigation

```tsx
// Header (Dark)
<header className="bg-mck-navy">
  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button className="text-white">
        <Menu className="h-6 w-6" />
      </button>
      <McKinseyLogo className="h-[52px] text-white" />
    </div>
    <div className="flex items-center gap-4">
      <button className="text-white">
        <Search className="h-5 w-5" />
      </button>
    </div>
  </div>
</header>

// Footer Links
<footer className="bg-white border-t py-12">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h4 className="font-semibold mb-4">Careers</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-foreground">Explore Careers</a></li>
        </ul>
      </div>
    </div>
  </div>
</footer>
```

### Social Icons

```tsx
// Social Icon Button (Dark, Circular)
<a href="#" className="w-8 h-8 rounded-full bg-mck-navy flex items-center justify-center 
                       text-white hover:bg-mck-dark-navy transition-colors">
  <LinkedInIcon className="h-4 w-4" />
</a>

// Social Icon Row
<div className="flex gap-3">
  {['LinkedIn', 'Twitter', 'Facebook', 'YouTube'].map(social => (
    <a key={social} className="w-8 h-8 rounded-full bg-mck-navy text-white 
                               flex items-center justify-center hover:bg-mck-blue">
      <SocialIcon name={social} />
    </a>
  ))}
</div>
```

---

## 6. Section Patterns

### Hero Section (Dark Background)

```tsx
<section className="bg-mck-navy text-white py-20 md:py-32">
  <div className="max-w-7xl mx-auto px-4">
    <h1 className="font-display text-5xl md:text-7xl leading-tight max-w-3xl">
      What's your next<br />
      <span className="text-mck-blue">brilliant</span> move?
    </h1>
    <p className="mt-6 text-lg text-white/80 max-w-2xl">
      Game-changing work. People-powered growth. At McKinsey, we help you think 
      bigger, build stronger, and expand opportunity for all.
    </p>
    <button className="mt-8 rounded-full bg-white text-mck-navy px-8 py-4 
                       font-medium hover:bg-white/90 transition-colors">
      <ArrowRight className="h-5 w-5" />
    </button>
  </div>
</section>
```

### Blue Accent Section

```tsx
<section className="bg-mck-blue text-white py-16">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="font-display text-3xl md:text-4xl">
      Looking for your next move?
    </h2>
    <p className="mt-4 text-lg text-white/90">
      We look for people who are energized by the same things as our clients.
    </p>
    <button className="mt-6 rounded-full bg-white text-mck-blue px-6 py-3 
                       font-medium hover:bg-white/90 transition-colors">
      Explore Careers
    </button>
  </div>
</section>
```

### Light Content Section

```tsx
<section className="bg-white py-16">
  <div className="max-w-7xl mx-auto px-4">
    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
      HOW WE HELP CLIENTS
    </span>
    <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">
      Let's turn your biggest opportunities into your next big moves.
    </h2>
    {/* Content grid */}
  </div>
</section>
```

---

## 7. Icons & Imagery

### Icon Style
- Use **outline/stroke** icons (not filled)
- Standard size: `h-5 w-5` for inline, `h-6 w-6` for buttons
- Color matches text (white on dark, gray on light)

### Image Patterns
- **Aspect Ratio**: 16:9 for cards, 1:1 for avatars
- **Border Radius**: `rounded-[22px]` for large images, `rounded-lg` for thumbnails
- **Overlay**: Gradient overlay (`from-black/80 to-transparent`) for text legibility

---

## 8. Shadows & Borders

### Shadows

| Usage | Class |
|-------|-------|
| Cards (light bg) | `shadow-sm` |
| Elevated cards | `shadow-md` |
| Modals/Dialogs | `shadow-xl` |

### Borders

| Usage | Class |
|-------|-------|
| Standard border | `border border-border` |
| Input border | `border border-input` |
| Separator | `border-t border-border` |

### Border Radius

| Element | Value | Class |
|---------|-------|-------|
| Cards/Sections | 22px | `rounded-[22px]` |
| Buttons/Inputs | 9999px (pill) | `rounded-full` |
| Small elements | 8px | `rounded-lg` |
| Images | 16px | `rounded-2xl` |

---

## 9. Logo Usage

### McKinsey Logo

The official McKinsey & Company logo:
- **Dimensions**: Approximately 143px (w) × 52px (h) at standard size
- **Typography**: Serif font (similar to Bower)
- **Layout**: "McKinsey" on first line, "& Company" below with slight indent
- **Minimum clear space**: Equal to the height of the "M"

### Logo Variations

| Variation | Usage |
|-----------|-------|
| White logo | Dark backgrounds (navy, blue) |
| Dark logo (#051C2C) | Light backgrounds (white, off-white) |

### Logo Component

```tsx
// Logo for Header (White on Dark)
<a href="/" aria-label="McKinsey and Company Home">
  <img 
    src="/logo-mckinsey-white.svg" 
    alt="McKinsey & Company" 
    className="h-[52px] w-auto"
  />
</a>

// Logo for Footer (Dark on Light)
<img 
  src="/logo-mckinsey-dark.svg" 
  alt="McKinsey & Company" 
  className="h-[40px] w-auto"
/>
```

---

## 10. Accessibility

- **Color Contrast**: All text meets WCAG AA contrast requirements
- **Focus States**: Use `focus:ring-2 focus:ring-mck-blue` for keyboard navigation
- **ARIA Labels**: Include on icon-only buttons and links
- **Skip Links**: Provide "Skip to main content" link

```tsx
// Skip Link
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 
                           focus:left-4 focus:z-50 focus:px-4 focus:py-2 
                           focus:bg-mck-blue focus:text-white focus:rounded">
  Skip to main content
</a>
```

---

## 11. Animation & Transitions

### Standard Transitions

```tsx
// Button hover
className="transition-colors duration-200"

// Card hover
className="transition-transform duration-300 hover:scale-[1.02]"

// Fade in
className="animate-fadeIn"
```

### Tailwind Animation Config

```js
// Add to tailwind.config.js
animation: {
  fadeIn: 'fadeIn 0.3s ease-out',
  slideUp: 'slideUp 0.3s ease-out',
},
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
},
```

---

## 12. Code Templates

For consistent implementation, use templates from `code-templates/`:

- **COMPONENT_TEMPLATE.tsx**: Standard functional component with `cn` utility
- **HOOK_TEMPLATE.ts**: Hook with loading/error states
- **ZUSTAND_STORE_TEMPLATE.ts**: State management with persistence
