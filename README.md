# GRANTLY — Production Scholarship Discovery & Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![WCAG 2.2 AA](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA_Target-16A779?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100%2F100-5145CD?style=flat-square)](https://developer.chrome.com/docs/lighthouse/)

> **Tagline:** *Every Opportunity Within Reach.*  
> **Repository:** [https://github.com/Raccoon-UX/Grantly.git](https://github.com/Raccoon-UX/Grantly.git)  
> **Theme:** Modern Premium SaaS (Light Theme with Deep Indigo, Violet & Lavender Accents)

---

## ✦ Overview

**GRANTLY** is an end-to-end scholarship discovery and management platform engineered for student success. It bridges the gap between ambitious students and fragmented educational funding sources by providing **transparent deterministic matching**, **proactive deadline alerts**, **a multi-stage application lifecycle tracker**, and a **centralized document readiness checklist**.

---

## ✦ Key Features

1. **Deterministic Smart Match AI Engine (`/smart-match`)**
   - Rule-based algorithmic matching based on verified education levels, academic streams, minimum marks, annual family income limits, and state domiciles.
   - Clear breakdown showing satisfied criteria vs. unmatched constraints.
   - **Interactive What-If Scenario Simulator:** Test hypothetical score improvements or income adjustments to preview instant eligibility shifts without altering live data.

2. **Faceted Scholarship Discovery (`/discover`)**
   - Multi-field keyword search across titles, providers (e.g. AICTE, Google, Infosys, PMRF), and disciplines.
   - Faceted multi-dimensional filters: Education Level, Academic Stream, Award Category, Location / State, Minimum Grant Amount, and Deadline Window.
   - Responsive Grid and List view modes with deterministic sorting.

3. **Detailed Opportunity Briefs (`/scholarships/[id]`)**
   - Official provider credentials, financial award structures, and step-by-step application instructions.
   - Document requirements cross-referenced with the student's local document readiness.
   - Direct links to official government and institutional portals (NSP, MahaDBT, AICTE).

4. **Multi-Stage Application Tracker (`/applications`)**
   - 7 lifecycle states: `Saved` ➔ `Preparing` ➔ `Ready to Apply` ➔ `Applied` ➔ `Under Review` ➔ `Approved` ➔ `Rejected`.
   - Visual progress indicators, editable filing notes, reference IDs, and submission logging.

5. **Document Readiness Center (`/documents`)**
   - Readiness checklist for standard credentials (Aadhaar, Income Certificate, Transcripts, Bonafide, Category Proof).
   - Instant calculation of portfolio readiness percentage.
   - **Privacy Preserving:** Zero sensitive personal documents or real biometrics collected.

6. **Validated Student Profile (`/profile`)**
   - Accessible form controls with screen-reader validation announcements.
   - Profile updates trigger instant re-calculation of all scholarship matches.

7. **Settings & Data Portability (`/settings`)**
   - Deadline radar notifications and weekly digest controls.
   - One-click JSON export of tracked applications, notes, and profile data.
   - Reset Demo Data CTA with confirmation modal for evaluators.

---

## ✦ Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router, Server Components & Client Islands)
- **Language:** TypeScript 5.6 (Strict Mode, 0 `any` types)
- **Styling & Tokens:** Tailwind CSS 3.4 with custom CSS custom properties (`--brand-primary`, `--app-bg`, etc.)
- **Icons:** Lucide React
- **Animations:** Framer Motion (respects `prefers-reduced-motion`)
- **State & Storage:** React Context + LocalStorage with CustomEvent cross-tab synchronization
- **Testing:** Axe Core 4.14, Lighthouse 13.6, Puppeteer Core

```text
src/
├── app/                  # Next.js App Router pages (12 core routes)
├── components/
│   ├── layout/           # AppShell, Header, Sidebar, responsive navigation
│   ├── shared/           # Smart Spark Logo SVG, ToastContainer
│   ├── dashboard/        # StatCard, metric components
│   └── scholarships/     # ScholarshipCard (grid & list views)
├── context/              # GrantlyContext (state & LocalStorage sync)
├── data/                 # 14+ Curated demo scholarships & initial profile
├── lib/                  # Deterministic matching, storage engine, formatters
└── types/                # Strict domain models & TypeScript interfaces
```

---

## ✦ Pre-Submission Verification & Audit Results

| Audit Suite | Tool | Measured Result |
| :--- | :--- | :--- |
| **TypeScript Typecheck** | `npx tsc --noEmit` | **0 Errors** (Strict compilation) |
| **ESLint Check** | `npm run lint` | **0 Warnings / 0 Errors** |
| **Production Build** | `npm run build` | **12/12 Routes prerendered** (87.1 kB shared JS) |
| **Accessibility (Axe)** | `axe-core` | **0 Violations** across all audited routes |
| **Lighthouse Accessibility** | Google Lighthouse 13 | **100 / 100** on `/`, `/dashboard`, `/discover`, `/smart-match` |
| **Lighthouse Best Practices** | Google Lighthouse 13 | **100 / 100** |
| **Lighthouse SEO** | Google Lighthouse 13 | **100 / 100** |

---

## ✦ Getting Started

### Prerequisites

- **Node.js:** v18.18+ or v20+ (tested on Node v22)
- **npm:** v9+ or v10+

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/Raccoon-UX/Grantly.git
cd Grantly

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
http://localhost:3000
```

### Production Build & Serve

```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

---

## ✦ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server at `http://localhost:3000` |
| `npm run build` | Generates optimized production build in `.next` |
| `npm run start` | Serves compiled production build |
| `npm run lint` | Runs Next.js ESLint verification |
| `npm run test:e2e` | Runs automated Chromium E2E user journey & Axe accessibility audit |
| `npm run test:modal` | Tests dialog accessibility, focus handling, and Escape key dismissal |

---

## ✦ Responsive Viewports

- **Desktop (1440px):** Fixed navigation sidebar, 3-column dashboard, sticky search/filter panel.
- **Tablet (1024px / 768px):** Adaptive 2-column cards, collapsible navigation drawer.
- **Mobile (390px):** Ergonomic bottom navigation bar, floating filter trigger, touch-friendly 44px tap targets, zero horizontal overflow.

---

## ✦ License & Hackathon Attribution

Built for **Frontend Arena — The Outpost Hackathon**.  
© 2026 GRANTLY Platform Team. All rights reserved.
