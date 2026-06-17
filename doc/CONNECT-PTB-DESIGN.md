---
version: alpha
name: Connect-PTB-design-analysis
description: A vibrant, touch-friendly kiosk interface for the Connect Photobooth platform. The design is anchored by a warm, energetic orange primary color palette (#f54900) contrasted against clean white and light peach backgrounds. Interaction relies heavily on playful micro-animations (pop-ins, jumps, glows, active-scaling) to provide immediate tactile feedback suitable for physical kiosk touchscreens. Typography is driven by the modern and legible Be Vietnam Pro, ensuring clarity for diverse user demographics.

colors:
  primary: "#f54900"
  primary-hover: "#ffd5c1"
  primary-dark: "#aa4419"
  primary-light: "#ffece4"
  primary-superlight: "#fff6f4"
  secondary: "#f7921f"
  submain: "#e60076"
  background: "hsl(var(--background))"
  foreground: "hsl(var(--foreground))"
  muted: "hsl(var(--muted))"
  border: "#e5e7eb" /* Tailwind gray-200 assumption for border-border */

typography:
  font-sans: "'Be_Vietnam_Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  weights:
    light: 300
    regular: 400
    medium: 500
    bold: 700

rounded:
  full: 9999px
  /* Inherits standard Tailwind rounding (sm, md, lg, xl, 2xl, etc.) */

spacing:
  /* Inherits standard Tailwind spacing */

components:
  mobile-touch:
    transition: "duration-200"
    activeState: "scale-95"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "white"
    hoverBackgroundColor: "{colors.primary-dark}"
    activeState: "scale-95"
  border-border:
    borderWidth: "1px"
    borderStyle: "solid"
    borderColor: "gray-200"
    shadow: "shadow"

animations:
  fade-in: "fade-in 0.2s ease-out"
  pop-in: "pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
  shimmer: "shimmer 2s infinite linear"
  ping-slow: "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite"
  bounce-slow: "bounce-slow 1.5s ease-in-out infinite"
  pulse-glow: "pulse-glow 2s ease-in-out infinite"
  slide-up: "slide-up 0.3s ease-out"
  attractive-jump: "jump 4s infinite 4s forwards"
  glow: "glow 2s infinite"
  float: "float 3s ease-in-out infinite"
---

## Overview

Connect Photobooth (CONNECT-PTB) utilizes an energetic, touch-friendly interface designed primarily for Kiosk/Touchscreen environments. The base atmosphere revolves around a **clean light canvas** (often white or superlight peach `#fff6f4`) punctuated by **vibrant orange CTAs** (`#f54900`). The design prioritizes tactile feedback, legibility, and playful micro-animations to create a delightful user experience for photo customization and ordering.

Type voice is driven by **Be Vietnam Pro**, providing a modern, clean, and highly legible sans-serif experience tailored perfectly for Vietnamese content, with Roboto serving as a robust secondary/fallback font.

Component voltage comes from **interactive animations**. Elements don't just appear; they `pop-in`, `slide-up`, or `fade-in`. Buttons shrink slightly on press (`active:scale-95` via the `.mobile-touch` utility) to assure users that their touch registered, which is critical for physical kiosk screens.

**Key Characteristics:**

- Dominant energetic primary color (`{colors.primary}` — #f54900).
- Soft background tints for sectioning (`{colors.primary-light}` and `{colors.primary-superlight}`).
- Frequent use of micro-animations (pop-in, bounce, float, jump) to draw attention and guide the user.
- Explicitly designed for touch interfaces (`.mobile-touch` utility scaling down elements on active/press).
- Clean, modern typography with **Be Vietnam Pro**.
- Hidden or completely restyled custom scrollbars for a seamless app-like feel.

## Colors

### Brand & Accent

- **Main / Primary** (`{colors.primary}` — #f54900): All primary CTAs, active states, and important highlights.
- **Dark Main** (`{colors.primary-dark}` — #aa4419): Used for hover states or pressed states to convey depth.
- **Hover Main** (`{colors.primary-hover}` — #ffd5c1): Soft interaction feedback color.
- **Secondary** (`{colors.secondary}` — #f7921f): Yellow-orange accent for stars, highlights, or secondary CTAs.
- **Sub-main** (`{colors.submain}` — #e60076): Pink accent used for specific decorative elements or alternating focus.

### Surface

- **Superlight Main** (`{colors.primary-superlight}` — #fff6f4): Barely-there orange tint, perfect for card backgrounds or subtle banding.
- **Light Main** (`{colors.primary-light}` — #ffece4): Slightly stronger tint for distinct surface elevations.

## Typography

### Font Family

The system exclusively runs **Be Vietnam Pro** for its UI, maximizing legibility and modern aesthetics.
- Available weights: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold).
- Fallback stack: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

### Principles

Clear hierarchy is established through standard Tailwind sizing but heavily relies on **Be Vietnam Pro**'s crisp letterforms. Important labels use 500 or 700 weight. The system avoids extreme weights (like 100 or 900) to maintain a friendly, approachable tone.

## Layout & Interaction

### Touch-First Principles

Because this is a Photobooth app, the UI is primarily interacted with via touchscreens:
- **`.mobile-touch`**: A globally used utility that applies a `duration-200 active:scale-95` transition. Every button or clickable card must shrink slightly when touched to provide physical-feeling feedback.
- **Generous Touch Targets**: Buttons and interactive elements must be large enough for fingers.
- **No Native Scrollbars**: Web scrollbars are hidden (`.no-scrollbar`, `.gallery-scroll`, `.STYLE-hide-scrollbar`) or highly customized (`.STYLE-styled-scrollbar` with a tiny 4px thumb) to look native to an app rather than a webpage.

### Custom Breakpoints

The app utilizes a highly granular set of breakpoints to handle various kiosk, tablet, and mobile device sizes:
- Mobile: `xs` (376px), `sm` (396px), `sms` (475px).
- Tablet/Small Kiosk: `smd` (662px), `md` (724px), `spmd` (878px), `lg` (970px).
- Large Kiosk/Desktop: `xl` (1025px), `2xl` (1218px) up to `6xl` (1621px).

## Elevation, Depth & Animation

The project substitutes heavy drop-shadows with vibrant animations and subtle border styling to create depth.

### Signature Animations

- **Pop-in (`--animate-pop-in`)**: Using a spring-like cubic-bezier (`0.34, 1.56, 0.64, 1`), modals and popups burst onto the screen rather than statically appearing.
- **Attractive / Idle Animations**: Elements use `attractive-jump` or floating/glowing animations to catch a passerby's attention on the physical kiosk.
- **Intro Characters**: The `.NAME-intro-char` classes apply a staggered wave animation to text (`flexible-wave`), creating a playful welcoming screen.

### Borders

- **`.border-border`**: A utility class combining `border border-gray-200 shadow` to create clean, lightly elevated cards and containers.

## Do's and Don'ts

### Do
- Always use the `.mobile-touch` utility on buttons and clickable cards. The active scale-down is critical for kiosk UX.
- Stick to **Be Vietnam Pro** for all textual elements.
- Utilize the `var(--vcn-main-cl)` or `bg-main-cl` for primary actions to draw the eye.
- Use `pop-in` or `slide-up` animations for new content entering the viewport to make the interface feel alive.
- Hide or custom-style scrollbars for any scrolling containers.

### Don't
- Don't use standard generic web buttons without the `active:scale-95` press effect.
- Don't rely heavily on deep, dark shadows (`shadow-2xl`); use light borders and subtle shadows (`.border-border`) combined with color contrast.
- Don't use generic system fonts or mismatched typefaces.
- Don't overcrowd the UI. Touchscreen interfaces require whitespace to prevent accidental misclicks.

## Component Specifics

### Buttons
Standard buttons generally feature the main orange color (`var(--vcn-main-cl)`), bold text, rounded corners (typically `rounded-xl` or `rounded-lg`), and incorporate the `mobile-touch` utility for interaction.

### Loading States
Custom loading animations like `.STYLE-animation-loading-shapes` leverage modern CSS background gradients to create dynamic, non-intrusive loading indicators that feel bespoke to the brand.
