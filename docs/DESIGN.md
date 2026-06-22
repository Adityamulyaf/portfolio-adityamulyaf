---
name: Intentional Builder Portfolio
colors:
  surface: '#EAE4D9'
  surface-dim: '#ded9d1'
  surface-bright: '#fef9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ea'
  surface-container: '#f2ede4'
  surface-container-high: '#ece8df'
  surface-container-highest: '#e7e2d9'
  on-surface: '#1d1c16'
  on-surface-variant: '#43493d'
  inverse-surface: '#32302a'
  inverse-on-surface: '#f5f0e7'
  outline: '#73796c'
  outline-variant: '#c3c9b9'
  surface-tint: '#43682b'
  primary: '#173901'
  on-primary: '#ffffff'
  primary-container: '#2d5016'
  on-primary-container: '#98c27b'
  inverse-primary: '#a8d38a'
  secondary: '#675d4f'
  on-secondary: '#ffffff'
  secondary-container: '#ecdecc'
  on-secondary-container: '#6b6153'
  tertiary: '#551b3f'
  on-tertiary: '#ffffff'
  tertiary-container: '#703256'
  on-tertiary-container: '#ee9ec8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4efa3'
  primary-fixed-dim: '#a8d38a'
  on-primary-fixed: '#0a2100'
  on-primary-fixed-variant: '#2c4f15'
  secondary-fixed: '#efe0cf'
  secondary-fixed-dim: '#d2c5b4'
  on-secondary-fixed: '#211b10'
  on-secondary-fixed-variant: '#4e4539'
  tertiary-fixed: '#ffd8e9'
  tertiary-fixed-dim: '#ffafd8'
  on-tertiary-fixed: '#3a0428'
  on-tertiary-fixed-variant: '#6f3155'
  background: '#fef9f0'
  on-background: '#1d1c16'
  surface-variant: '#e7e2d9'
  border: '#D6CEBC'
  text-primary: '#1C1712'
  text-muted: '#A8998A'
  accent-hover: '#3D6B1F'
typography:
  display-hero:
    fontFamily: Instrument Serif
    fontSize: 96px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: dmSans
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg-mobile:
    fontFamily: dmSans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-md:
    fontFamily: dmSans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md-mobile:
    fontFamily: dmSans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  label-lg:
    fontFamily: dmSans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: dmSans
    fontSize: 16px
    fontWeight: '300'
    lineHeight: '1.6'
  body-sm:
    fontFamily: dmSans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  metadata:
    fontFamily: dmSans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.6'
  mono-label:
    fontFamily: jetbrainsMono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  xxl: 64px
  section-v: 192px
  max-width: 1200px
  gutter: 24px
---

# DESIGN.md
# Personal Portfolio — Firizqi Aditya Mulya

---

## Overview

Builder who codes and designs. Projects span robotics hardware, mobile apps, machine learning, and web tools. The portfolio needs to hold all of that without feeling scattered — the common thread is intentionality, not domain.

Tone: confident, quiet. Not a resume. Not a showcase reel. A place where the work speaks.

Reference energy: Fauna Robotics — but the specific decisions below are derived from this brief, not copied from them.

---

## Color

```
--color-bg:          #F2EDE4   /* warm cream, not white — the base everything sits on */
--color-surface:     #EAE4D9   /* slightly darker cream for cards, nav fills */
--color-border:      #D6CEBC   /* subtle dividers, never decorative */
--color-text-primary: #1C1712  /* warm near-black, not pure #000 */
--color-text-secondary: #6B6153 /* warm mid-tone for metadata, captions */
--color-text-muted:  #A8998A   /* timestamps, labels, fine print */
--color-accent:      #2D5016   /* deep forest green — single accent, used sparingly */
--color-accent-hover: #3D6B1F
```

Rationale: Fauna's warmth comes from the cream-not-white background. The oranye/terra cotta accent is theirs — this portfolio uses forest green to signal a different world (field, hardware, nature of engineering) while keeping the same warm-background logic. One accent. No gradients.

---

## Typography

### Typefaces

```
Display  : "Instrument Serif" — for hero name only
           italic weight, large, used once
           fallback: Georgia, serif

Body     : "DM Sans" — all other text
           weights: 300 (light body), 400 (regular), 500 (medium labels), 700 (section headers)
           fallback: system-ui, sans-serif

Mono     : "JetBrains Mono" — code snippets, tech tags, stack labels
           weight: 400 only
           fallback: monospace
```

### Scale

```
--text-hero:    clamp(56px, 8vw, 96px)   /* name in hero, Instrument Serif italic */
--text-h1:      clamp(40px, 5vw, 64px)   /* section titles */
--text-h2:      clamp(24px, 3vw, 36px)   /* project card titles */
--text-h3:      18px                      /* sub-labels, card categories */
--text-body:    16px                      /* all body copy */
--text-small:   13px                      /* metadata, tags, captions */
--text-micro:   11px                      /* timestamps, footnotes */
```

### Rules

- Line height: 1.6 for body, 1.1 for display text
- Letter spacing: -0.02em on display sizes, 0.04em on ALL CAPS labels only
- Never center-align body text
- No underline on nav links — use weight change on hover instead
- Section headers: DM Sans 700, sentence case (not title case, not all caps)

---

## Spacing

Base unit: 8px. Everything is a multiple.

```
--space-1:   8px
--space-2:   16px
--space-3:   24px
--space-4:   32px
--space-6:   48px
--space-8:   64px
--space-12:  96px
--space-16:  128px
--space-24:  192px
```

Section vertical padding: --space-24 top and bottom. This is the breathing room that makes the layout feel premium. Do not reduce it.

Content max-width: 1200px. Horizontal padding: --space-6 on desktop, --space-3 on mobile.

---

## Layout

### Grid

12-column grid. Column gap: 24px. Most content uses 10 of 12 columns, centered.

Project cards use an asymmetric 2-column layout:
- Featured project: 8 cols content + 4 cols image
- Regular projects: 2 per row (6 cols each) on desktop, 1 per row on mobile

No full-bleed cards. Cards sit within the content column. The background itself creates the breathing room.

### Section structure

Each section follows the same skeleton:

```
[section label — small, muted, monospaced, left-aligned]
[section title — large, primary, left-aligned]
[content]
```

No centered headings. Everything left-anchors. This is the structural decision that separates it from default portfolio layouts.

---

## Navigation

- Fixed top, no background on initial load
- On scroll past 80px: background becomes --color-surface with 0.95 opacity, backdrop-filter blur(8px)
- Height: 64px
- Left: name (DM Sans 500, 15px)
- Right: links (DM Sans 400, 14px) — About, Projects, Contact
- No CTA button in nav. No hamburger icon on desktop.
- Mobile: full-screen overlay on menu tap, links in large type

---

## Hero Section

```
[top padding: 192px]

  Firizqi Aditya Mulya          ← Instrument Serif italic, --text-hero, --color-text-primary
  
  [16px gap]
  
  Builder. Informatika student  ← DM Sans 300, 20px, --color-text-secondary
  at Universitas Sebelas Maret.
  
  [48px gap]
  
  [→ See my work]               ← DM Sans 500, 15px, --color-accent, no button box
                                   arrow is text character "→", not an icon

[bottom padding: 192px]
```

---

## Project Cards

Each card contains:

```
[full-width image or screenshot, aspect-ratio 16/10, border-radius: 8px]
[16px gap]
[domain tag — monospace, 11px, --color-text-muted, uppercase]
[8px gap]
[project name — DM Sans 700, 22px]
[8px gap]
[one-line description — DM Sans 400, 15px, --color-text-secondary]
[16px gap]
[stack tags — monospace, 11px, spaced horizontally]
```

Hover state on card:
- Image: scale(1.02), transition 300ms ease
- No shadow added on hover
- No border appears
- Cursor: pointer

---

## Projects to Include

Listed in recommended display order:

```
RoboBoat / Bengawan UV ASV
  domain: Robotics
  stack: ROS, Python, Jetson, YOLOv4
  visual: foto fisik boat atau setup lapangan

Automawhat?
  domain: Web Tool
  stack: React, TypeScript, Tailwind, SVG
  visual: screenshot DFA/NFA simulator

HaloMBG
  domain: Mobile App
  stack: Kotlin, Android Studio, Laravel, Sanctum
  visual: screenshot app UI

Stroke Prediction ML
  domain: Machine Learning
  stack: Python, Random Forest, SHAP, SMOTE
  visual: SHAP plot atau diagram pipeline

LectInfor
  domain: Android App
  stack: Jetpack Compose, StateFlow
  visual: screenshot app

Bengawan UV Website
  domain: Web
  stack: Next.js, Tailwind, GSAP
  visual: mockup atau screenshot (if available)
```

---

## Animation

Principle: one orchestrated entrance, then stillness.

### Page load
- Hero text fades in and slides up 24px, staggered per line
- Duration: 600ms, ease: cubic-bezier(0.16, 1, 0.3, 1)
- Delay between lines: 80ms

### Scroll-triggered
- Project cards: fade in + translate Y 32px → 0, triggered at 80% viewport threshold
- Duration: 500ms, same easing
- Stagger between cards: 60ms

### Hover
- Nav links: color transition to --color-text-primary, 150ms
- Project images: scale(1.02), 300ms ease
- Accent links: underline slide-in from left, 200ms

---

## CSS Custom Properties (globals.css skeleton)

```css
:root {
  --color-bg:             #F2EDE4;
  --color-surface:        #EAE4D9;
  --color-border:         #D6CEBC;
  --color-text-primary:   #1C1712;
  --color-text-secondary: #6B6153;
  --color-text-muted:     #A8998A;
  --color-accent:         #2D5016;
  --color-accent-hover:   #3D6B1F;

  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --text-hero: clamp(56px, 8vw, 96px);
  --text-h1:   clamp(40px, 5vw, 64px);
  --text-h2:   clamp(24px, 3vw, 36px);
  --text-h3:   18px;
  --text-body: 16px;
  --text-small: 13px;
  --text-micro: 11px;

  --space-1:  8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-6:  48px;
  --space-8:  64px;
  --space-12: 96px;
  --space-16: 128px;
  --space-24: 192px;

  --radius-card: 8px;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```