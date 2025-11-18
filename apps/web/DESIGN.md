# Home Store Design System

> Modern, vibrant design system using OKLCH color space for perceptually uniform colors.

## Table of Contents

- [Color Philosophy](#color-philosophy)
- [JPC Color Palette](#jpc-color-palette)
- [Semantic Colors](#semantic-colors)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Component Patterns](#component-patterns)
- [Usage Guidelines](#usage-guidelines)

## Color Philosophy

The Home Store design system uses **OKLCH** (Oklch color space) for all colors, providing:

- **Perceptual uniformity**: Colors with the same lightness value appear equally bright
- **Wider color gamut**: More vibrant, saturated colors than RGB/HSL
- **Predictable behavior**: Consistent results across different displays

### Design Principles

1. **Vibrant & Energetic**: Bold, saturated colors for visual impact
2. **Warm Light Backgrounds**: Soft, warm off-white tones for comfort
3. **Clear Visual Hierarchy**: Color coding for transaction types and states
4. **Accessibility First**: Sufficient contrast ratios for readability

## JPC Color Palette

Complete custom color palette with full shade ranges (50-950).

### Cyan (Primary/Signature)

Mint-cyan color used for primary actions, focus rings, and branding.

```css
--color-jpc-cyan-50: oklch(0.98 0.02 175);
--color-jpc-cyan-100: oklch(0.95 0.05 175);
--color-jpc-cyan-200: oklch(0.92 0.08 175);
--color-jpc-cyan-300: oklch(0.88 0.11 175);
--color-jpc-cyan-400: oklch(0.85 0.14 175); /* Primary */
--color-jpc-cyan-500: oklch(0.75 0.12 175);
--color-jpc-cyan-600: oklch(0.65 0.1 175);
--color-jpc-cyan-700: oklch(0.55 0.08 175);
--color-jpc-cyan-800: oklch(0.45 0.06 175);
--color-jpc-cyan-900: oklch(0.35 0.04 175);
--color-jpc-cyan-950: oklch(0.25 0.02 175);
```

**Usage:**

- Primary buttons and CTAs
- Focus rings and active states
- Logo gradient
- Navigation active items

### Emerald (Success/Positive)

Vibrant green used for success states and received transactions.

```css
--color-jpc-emerald-50: oklch(0.96 0.04 160);
--color-jpc-emerald-100: oklch(0.92 0.08 160);
--color-jpc-emerald-200: oklch(0.88 0.12 160);
--color-jpc-emerald-300: oklch(0.84 0.14 160);
--color-jpc-emerald-400: oklch(0.8 0.16 160);
--color-jpc-emerald-500: oklch(0.68 0.17 160); /* Primary */
--color-jpc-emerald-600: oklch(0.58 0.13 160);
--color-jpc-emerald-700: oklch(0.48 0.1 160);
--color-jpc-emerald-800: oklch(0.38 0.08 160);
--color-jpc-emerald-900: oklch(0.28 0.06 160);
--color-jpc-emerald-950: oklch(0.18 0.04 160);
```

**Usage:**

- "TE PAGÓ" (received) transaction cards
- Success messages and notifications
- Positive balance indicators
- Chart data for income

### Orange (Warning/Alert)

Peachy-coral orange for warnings and paid transactions.

```css
--color-jpc-orange-50: oklch(0.96 0.05 35);
--color-jpc-orange-100: oklch(0.92 0.1 35);
--color-jpc-orange-200: oklch(0.88 0.14 35);
--color-jpc-orange-300: oklch(0.76 0.18 35);
--color-jpc-orange-400: oklch(0.64 0.22 35); /* Primary */
--color-jpc-orange-500: oklch(0.6 0.19 35);
--color-jpc-orange-600: oklch(0.52 0.16 35);
--color-jpc-orange-700: oklch(0.44 0.13 35);
--color-jpc-orange-800: oklch(0.36 0.1 35);
--color-jpc-orange-900: oklch(0.28 0.08 35);
--color-jpc-orange-950: oklch(0.2 0.05 35);
```

**Usage:**

- "PAGASTE" (paid) transaction cards
- Warning messages
- Expense indicators
- Chart data for spending

### Sky Blue (Accent)

Bright sky blue for secondary accents and interactive elements.

```css
--color-jpc-sky-50: oklch(0.97 0.03 210);
--color-jpc-sky-100: oklch(0.94 0.06 210);
--color-jpc-sky-200: oklch(0.9 0.09 210);
--color-jpc-sky-300: oklch(0.86 0.12 210);
--color-jpc-sky-400: oklch(0.82 0.15 210); /* Primary */
--color-jpc-sky-500: oklch(0.72 0.13 210);
--color-jpc-sky-600: oklch(0.62 0.11 210);
--color-jpc-sky-700: oklch(0.52 0.09 210);
--color-jpc-sky-800: oklch(0.42 0.07 210);
--color-jpc-sky-900: oklch(0.32 0.05 210);
--color-jpc-sky-950: oklch(0.22 0.03 210);
```

**Usage:**

- Secondary buttons
- Information badges
- Hover states
- Interactive elements

### Purple (Priority/Special)

Vibrant purple for priority items and special highlights.

```css
--color-jpc-purple-50: oklch(0.96 0.04 300);
--color-jpc-purple-100: oklch(0.92 0.08 300);
--color-jpc-purple-200: oklch(0.88 0.12 300);
--color-jpc-purple-300: oklch(0.82 0.16 300);
--color-jpc-purple-400: oklch(0.76 0.2 300); /* Primary */
--color-jpc-purple-500: oklch(0.66 0.18 300);
--color-jpc-purple-600: oklch(0.56 0.15 300);
--color-jpc-purple-700: oklch(0.46 0.12 300);
--color-jpc-purple-800: oklch(0.36 0.09 300);
--color-jpc-purple-900: oklch(0.26 0.06 300);
--color-jpc-purple-950: oklch(0.16 0.04 300);
```

**Usage:**

- Priority transactions
- Special offers
- Premium features
- Chart data series

### Pink (Destructive/CTA)

Hot pink for destructive actions and strong CTAs.

```css
--color-jpc-pink-50: oklch(0.96 0.06 320);
--color-jpc-pink-100: oklch(0.92 0.12 320);
--color-jpc-pink-200: oklch(0.88 0.18 320);
--color-jpc-pink-300: oklch(0.8 0.24 320);
--color-jpc-pink-400: oklch(0.72 0.28 320);
--color-jpc-pink-500: oklch(0.65 0.26 320); /* Primary */
--color-jpc-pink-600: oklch(0.55 0.22 320);
--color-jpc-pink-700: oklch(0.45 0.18 320);
--color-jpc-pink-800: oklch(0.35 0.14 320);
--color-jpc-pink-900: oklch(0.25 0.1 320);
--color-jpc-pink-950: oklch(0.15 0.06 320);
```

**Usage:**

- Delete buttons
- Error messages
- Destructive actions
- Strong call-to-action buttons

## Semantic Colors

Theme-aware semantic colors for consistent UI elements.

### Light Theme (Default)

```css
--background: oklch(0.985 0.002 85); /* Warm off-white */
--foreground: oklch(0.25 0.005 60); /* Warm dark gray */
--card: oklch(1 0.001 85); /* White cards */
--card-foreground: oklch(0.3 0.005 60); /* Warm dark text */
--primary: oklch(0.65 0.18 180); /* Signature cyan */
--primary-foreground: oklch(0.99 0.001 85); /* Near white */
--secondary: oklch(0.96 0.003 85); /* Warm light gray */
--secondary-foreground: oklch(0.25 0.005 60);
--muted: oklch(0.95 0.01 200); /* Subtle mint */
--muted-foreground: oklch(0.5 0.005 60); /* Medium gray */
--accent: oklch(0.82 0.15 210); /* Sky blue */
--accent-foreground: oklch(0.99 0.001 85);
--destructive: oklch(0.65 0.26 350); /* Pink */
--destructive-foreground: oklch(0.99 0.001 85);
--border: oklch(0.9 0.003 85); /* Light warm border */
--input: oklch(0.9 0.003 85);
--ring: oklch(0.65 0.18 180); /* Cyan focus ring */
```

### Sidebar Colors

```css
--sidebar: oklch(0.96 0.01 200); /* Light mint background */
--sidebar-foreground: oklch(0.12 0 0); /* Dark text */
--sidebar-primary: oklch(0.65 0.18 180); /* Cyan active item */
--sidebar-primary-foreground: oklch(1 0 0); /* White text */
--sidebar-accent: oklch(0.96 0.003 85); /* Light gray accent */
--sidebar-accent-foreground: oklch(0.25 0.005 60);
--sidebar-border: oklch(0.9 0.02 200); /* Subtle border */
--sidebar-ring: oklch(0.65 0.18 180); /* Cyan focus ring */
```

### Chart Colors

```css
--chart-1: oklch(0.76 0.2 300); /* Purple */
--chart-2: oklch(0.85 0.14 175); /* Cyan */
--chart-3: oklch(0.8 0.16 160); /* Emerald */
--chart-4: oklch(0.72 0.28 320); /* Pink */
--chart-5: oklch(0.64 0.22 35); /* Orange */
```

## Typography

### Font Families

```css
--font-sans: 'Geist Sans', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'Geist Mono', ui-monospace, monospace;
```

Both fonts use variable font technology for smooth weight transitions.

### Font Weights

- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Type Scale

Use Tailwind's default type scale:

- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)

## Spacing & Layout

### Border Radius

```css
--radius: 0.625rem; /* 10px base */
--radius-sm: calc(var(--radius) - 4px); /* 6px */
--radius-md: calc(var(--radius) - 2px); /* 8px */
--radius-lg: var(--radius); /* 10px */
--radius-xl: calc(var(--radius) + 4px); /* 14px */
```

### Spacing System

Use Tailwind's default spacing scale (0.25rem = 4px increments):

- `p-2`: 0.5rem (8px)
- `p-4`: 1rem (16px)
- `p-6`: 1.5rem (24px)
- `p-8`: 2rem (32px)

## Component Patterns

### Transaction Cards

#### TE PAGÓ (Received)

```tsx
<div
  className="
  border-jpc-emerald-500/20
  bg-jpc-emerald-500/5
  hover:bg-jpc-emerald-500/8
"
>
  <div className="bg-jpc-emerald-500/10">
    <ArrowUpRight className="text-jpc-emerald-500" />
  </div>
  <span className="bg-jpc-emerald-500/10 text-jpc-emerald-500">TE PAGÓ</span>
  <span className="text-jpc-emerald-500">+S/ 150.00</span>
</div>
```

#### PAGASTE (Paid)

```tsx
<div
  className="
  border-jpc-orange-400/20
  bg-jpc-orange-400/5
  hover:bg-jpc-orange-400/8
"
>
  <div className="bg-jpc-orange-400/10">
    <ArrowDownLeft className="text-jpc-orange-400" />
  </div>
  <span className="bg-jpc-orange-400/10 text-jpc-orange-400">PAGASTE</span>
  <span className="text-jpc-orange-400">-S/ 50.00</span>
</div>
```

### Statistics Cards

```tsx
<Card className="border-jpc-cyan-400/20 bg-gradient-to-br from-jpc-cyan-50 to-white">
  <div className="w-12 h-12 rounded-xl bg-jpc-cyan-400/10 flex items-center justify-center">
    <Activity className="w-6 h-6 text-jpc-cyan-400" />
  </div>
  <p className="text-sm text-muted-foreground">Total Transacciones</p>
  <p className="text-3xl font-bold text-foreground">245</p>
</Card>
```

### Buttons

#### Primary

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Crear Transacción
</button>
```

#### Destructive

```tsx
<button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  Eliminar
</button>
```

## Usage Guidelines

### Color Opacity Patterns

- **Backgrounds**: Use `/5` for very subtle tints, `/10` for badges
- **Borders**: Use `/20` for subtle borders, `/30` for more defined
- **Hover States**: Increase opacity by 3-5% (e.g., `/5` → `/8`)
- **Icons/Text**: Use full opacity or high values (`/80`, `/90`)

### Choosing Color Shades

- **-400**: Text, icons, high visibility elements
- **-500**: Borders (with opacity), primary variant
- **-50 to -200**: Very light backgrounds, subtle tints
- **-600 to -900**: Darker variants (rarely used in light theme)

### Accessibility

- Ensure minimum 4.5:1 contrast ratio for text
- Use `-500` variants for text on light backgrounds
- Use `-400` or `-300` for large text (18px+)
- Test colors with contrast checkers

### Do's and Don'ts

✅ **DO:**

- Use semantic colors for theme-aware components
- Use JPC colors for branding and visual hierarchy
- Maintain consistent opacity patterns
- Use OKLCH format for all custom colors

❌ **DON'T:**

- Mix hex colors with OKLCH
- Use random opacity values
- Override semantic colors in components
- Use RGB/HSL for new colors

## Migration Notes

### Deprecated Hex Palette

The old hex-based color system has been replaced with OKLCH:

- ~~`#00FFFF`~~ → `oklch(0.85 0.14 175)` (cyan-400)
- ~~`#50C878`~~ → `oklch(0.68 0.17 160)` (emerald-500)
- ~~`#FF7F00`~~ → `oklch(0.64 0.22 35)` (orange-400)
- ~~`#9D00FF`~~ → `oklch(0.76 0.20 300)` (purple-400)

The hex values have been commented out in `globals.css` (lines 276-356) for reference.

---

**Last Updated**: 2025-11-18
**Maintained By**: Juan Perez Castro
