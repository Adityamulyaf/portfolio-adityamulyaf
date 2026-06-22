# Project Brief & PRD: Firizqi Aditya Mulya — Intentional Builder Portfolio

**Status:** Draft | **Author:** Stitch (AI Design Assistant) | **Date:** October 2023

---

## 1. Executive Summary
A high-fidelity personal portfolio for Firizqi Aditya Mulya, a "builder who codes and designs." The project moves away from generic, loud portfolio trends toward a "confident, quiet" aesthetic that prioritizes the work itself. The site serves as a central hub for multi-domain projects spanning robotics, mobile apps, and machine learning.

---

## 2. Project Goals
- **Establish Authority:** Position the builder as a cross-disciplinary engineer with high intentionality.
- **Unified Identity:** Create a cohesive visual thread across diverse project domains (hardware vs. web vs. ML).
- **Premium User Experience:** Use whitespace and typography to signal quality and attention to detail.
- **Performance:** Achieve near-instant load times and smooth, orchestrated entrance animations.

---

## 3. Target Audience
- **Tech Recruiters:** Looking for technical depth and documented project outcomes.
- **Engineering Managers:** Looking for builders who understand the "why" behind the code.
- **Design Collaborators:** Looking for a peer who respects visual systems and hierarchy.

---

## 4. Visual Identity (Design System)
Based on the established `DESIGN_SYSTEM_1` and `DESIGN.md`:
- **Base Palette:** Warm cream (`#F2EDE4`) background with forest green (`#2D5016`) accents.
- **Typography:** 
    - Display: *Instrument Serif* (italic) for identity only.
    - Body: *DM Sans* for all functional text.
    - Mono: *JetBrains Mono* for technical metadata.
- **Layout Principle:** Left-anchored hierarchy, 12-column grid, intentional 192px vertical spacing.

---

## 5. Functional Requirements (MVP)

### 5.1. Hero Section
- **Nameplate:** Large display typography.
- **Value Prop:** One-line descriptor of role and current status.
- **Direct Action:** Minimal text-based link to work section.

### 5.2. Project Showcase
- **Asymmetric Grid:** Featured projects take priority; others follow in a structured grid.
- **Metadata-First:** Each project must display Domain, Stack, and a one-line description.
- **Hover States:** Subtle image scaling to indicate interactivity without visual noise.

### 5.3. "About" Section
- **Narrative:** Focus on philosophy ("Intentionality over domain").
- **Asset Integration:** Support for a professional headshot or studio photo.
- **Specialization List:** Categorized technical expertise.

### 5.4. Contact/Connect
- **Direct Links:** Email, LinkedIn, and GitHub as primary contact vectors.
- **Typography-driven:** Large, interactive links without traditional button containers.

---

## 6. Technical Specifications
- **Framework:** Next.js (App Router).
- **Styling:** Tailwind CSS for utility-first styling and custom CSS variables.
- **Motion:** Framer Motion or GSAP for orchestrated entrance sequences and scroll triggers.
- **Assets:** WebP format for all project images with lazy-loading and blur placeholders.
- **Performance Goal:** 95+ Lighthouse score across all categories.

---

## 7. Project Roadmap
- **Phase 1:** Core structure and Design System implementation.
- **Phase 2:** Project asset gathering and copywriting.
- **Phase 3:** Animation orchestration and scroll-trigger refinements.
- **Phase 4:** Mobile responsiveness audit and final polish.

---

## 8. Anti-Patterns (Out of Scope)
- No dark mode (intentional light-only warm aesthetic).
- No social media icons or logos (keep it text-focused).
- No testimonial or "clients" section.
- No technology logos (use monospaced text instead).
