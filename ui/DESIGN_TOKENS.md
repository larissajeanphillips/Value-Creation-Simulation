# Design Tokens

This document defines the CSS variables and Tailwind configuration for consistent McKinsey-branded theming.

## McKinsey Brand Colors

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| **McKinsey Blue** | `#2251FF` | `226 100% 57%` | Primary CTAs, links, highlights |
| **Electric Blue** | `#0060FF` | `218 100% 50%` | Alternative primary blue |
| **Deep Navy** | `#051C2C` | `207 73% 10%` | Primary dark background, header |
| **Dark Navy** | `#0A2540` | `209 76% 15%` | Secondary dark sections |
| **Pure White** | `#FFFFFF` | `0 0% 100%` | Text on dark, light backgrounds |
| **Off White** | `#F7F7F7` | `0 0% 97%` | Light section backgrounds |
| **Light Gray** | `#E5E5E5` | `0 0% 90%` | Borders, dividers |
| **Muted Gray** | `#6B7280` | `220 9% 46%` | Secondary text, placeholders |

## CSS Variables (add to `src/index.css`)

```css
@layer base {
  :root {
    /* McKinsey Brand Colors */
    --mck-blue: 226 100% 57%;           /* #2251FF - Primary blue */
    --mck-electric-blue: 218 100% 50%;  /* #0060FF - Alternative blue */
    --mck-deep-navy: 207 73% 10%;       /* #051C2C - Dark background */
    --mck-dark-navy: 209 76% 15%;       /* #0A2540 - Secondary dark */
    
    /* Semantic Colors */
    --background: 0 0% 100%;
    --foreground: 207 73% 10%;          /* Deep Navy for text */
    
    --card: 0 0% 100%;
    --card-foreground: 207 73% 10%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 207 73% 10%;
    
    --primary: 226 100% 57%;            /* McKinsey Blue */
    --primary-foreground: 0 0% 100%;    /* White */
    
    --secondary: 0 0% 97%;              /* Off White */
    --secondary-foreground: 207 73% 10%;
    
    --muted: 0 0% 97%;
    --muted-foreground: 220 9% 46%;     /* Muted Gray */
    
    --accent: 226 100% 57%;             /* McKinsey Blue */
    --accent-foreground: 0 0% 100%;
    
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    
    --border: 0 0% 90%;                 /* Light Gray */
    --input: 0 0% 90%;
    --ring: 226 100% 57%;               /* McKinsey Blue */
    
    --radius: 0.75rem;
    
    /* Chart colors */
    --chart-1: 226 100% 57%;            /* McKinsey Blue */
    --chart-2: 173 58% 39%;             /* Teal */
    --chart-3: 207 73% 10%;             /* Deep Navy */
    --chart-4: 43 74% 66%;              /* Gold */
    --chart-5: 145 63% 42%;             /* Green */
  }

  /* Dark mode - McKinsey Dark Theme */
  .dark {
    --background: 207 73% 10%;          /* Deep Navy */
    --foreground: 0 0% 100%;            /* White */
    
    --card: 209 76% 15%;                /* Dark Navy */
    --card-foreground: 0 0% 100%;
    
    --popover: 209 76% 15%;
    --popover-foreground: 0 0% 100%;
    
    --primary: 226 100% 57%;            /* McKinsey Blue */
    --primary-foreground: 0 0% 100%;
    
    --secondary: 209 76% 20%;
    --secondary-foreground: 0 0% 100%;
    
    --muted: 209 76% 20%;
    --muted-foreground: 0 0% 70%;
    
    --accent: 226 100% 57%;
    --accent-foreground: 0 0% 100%;
    
    --destructive: 0 62% 50%;
    --destructive-foreground: 0 0% 100%;
    
    --border: 209 30% 25%;
    --input: 209 30% 25%;
    --ring: 226 100% 57%;
  }
}
```

## Tailwind Configuration

Add these colors to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // McKinsey Brand
        'mck-blue': '#2251FF',
        'mck-electric': '#0060FF',
        'mck-navy': '#051C2C',
        'mck-dark-navy': '#0A2540',
        
        // Semantic mappings
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        // McKinsey Typography
        display: ['Bower', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['McKinseySans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['McKinseySans', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'card': '22px',
        'pill': '9999px',
      },
    },
  },
}
```

## Status Colors

| Status | Color | Tailwind Class | Hex |
|--------|-------|----------------|-----|
| Success/Active | Green | `text-emerald-600` | #059669 |
| Warning | Yellow | `text-amber-500` | #F59E0B |
| Error/Critical | Red | `text-red-600` | #DC2626 |
| Info/Primary | McKinsey Blue | `text-mck-blue` | #2251FF |
| Neutral/Muted | Gray | `text-slate-500` | #64748B |

## Component Patterns

### Cards

```tsx
// Standard Card
className="rounded-[22px] border border-border bg-card p-6 shadow-sm"

// Dark Section Card
className="rounded-[22px] bg-mck-navy p-6 text-white"
```

### Buttons

```tsx
// Primary Button (McKinsey Blue)
className="rounded-full px-6 py-3 bg-mck-blue text-white font-medium hover:bg-mck-electric transition-colors"

// Secondary/Outline Button
className="rounded-full px-6 py-3 bg-transparent border border-white text-white font-medium hover:bg-white/10 transition-colors"

// Dark Button (for light backgrounds)
className="rounded-full px-6 py-3 bg-mck-navy text-white font-medium hover:bg-mck-dark-navy transition-colors"
```

### Inputs

```tsx
// Standard Input (Pill Shape)
className="rounded-full border border-input bg-white px-4 py-3 w-full focus:ring-2 focus:ring-mck-blue focus:border-transparent"

// Search Input with Icon
<div className="relative">
  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
  <input className="rounded-full border border-input bg-white pl-12 pr-4 py-3 w-full" />
</div>
```

### Badges / Labels

```tsx
// Category Label (uppercase)
className="text-xs font-bold uppercase tracking-wider text-muted-foreground"

// Tag Badge
className="rounded-full px-3 py-1 text-xs font-medium bg-mck-blue/10 text-mck-blue"
```

### Links with Arrows

```tsx
// Navigation Link with Chevron
className="inline-flex items-center font-semibold text-white hover:underline"
// With: <span>Link Text</span> <ChevronRight className="h-4 w-4 ml-1" />
```

## Logo Reference

The McKinsey logo consists of:
- **"McKinsey"** on line 1 (serif font, similar to Bower or Georgia)
- **"& Company"** on line 2, slightly indented (same serif font)
- Standard logo dimensions: ~143px width × 52px height
- White version for dark backgrounds
- Dark version (#051C2C) for light backgrounds

### Logo Usage in React

```tsx
// SVG Logo Component (white version for dark backgrounds)
export const McKinseyLogo = ({ className = "h-[52px] w-auto" }) => (
  <svg viewBox="0 0 143 52" className={className} fill="currentColor">
    {/* Add official SVG paths here */}
  </svg>
);

// Or using an image
<img 
  src="/logo-mckinsey-white.svg" 
  alt="McKinsey & Company" 
  className="h-[52px] w-auto"
/>
```

## Dark Theme Sections

McKinsey uses deep navy backgrounds prominently:

```tsx
// Hero Section (Dark)
<section className="bg-mck-navy text-white py-20">
  <h1 className="font-display text-5xl md:text-7xl">
    What's your next<br />
    <span className="text-mck-blue">brilliant</span> move?
  </h1>
</section>

// Content Section (Dark)
<section className="bg-mck-dark-navy text-white py-16">
  <p className="text-lg text-white/80">Body text with slight transparency</p>
</section>

// Blue Accent Section
<section className="bg-mck-blue text-white py-16">
  {/* Content */}
</section>
```
