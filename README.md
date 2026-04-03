# CollX Frontend

CollX is a frontend-first prototype for a card collecting and marketplace experience. The app currently focuses on a polished landing page, static info pages, theme switching, and local collection-style interactions using mocked frontend data.

This README is written for developers joining the project so they can quickly understand what is already built, how the frontend is organized, and where the current boundaries are.

## What This Frontend Includes

- Marketing homepage built with reusable section components
- Theme switching with light and dark mode persistence
- Mocked marketplace and collection data stored locally in the browser

## Tech Stack

- `Next.js 16` with the App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `ESLint 9` with `eslint-config-next`
- `lucide-react` for icons
- `next/font` with Geist and Geist Mono

## Quick Start

### Prerequisites

- `Node.js` 20+ recommended
- `npm`

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
app/
  page.tsx                     -> homepage entry
  layout.tsx                   -> root layout, fonts, theme shell
  globals.css                  -> global styles and theme tokens
  about/, privacy/, terms/     -> static legal/info pages
  data-privacy/

components/
  pages/home/                  -> homepage composition
  sections/home/               -> homepage sections
  shared/
    cards/                     -> reusable card UI
    layout/                    -> site header
    theme/                     -> theme toggle

lib/
  constants/                   -> navigation and static config
  mock/                        -> mock card data
  store/collection-store.ts    -> localStorage helpers
  theme.ts                     -> theme persistence helpers
```

## Routing Overview

### Public routes

- `/` home page
- `/about`
- `/privacy`
- `/terms`
- `/data-privacy`

## How The Frontend Works Today

### 1. App architecture

- Uses the Next.js App Router with route folders under `app/`
- Most interactive screens are client components because they depend on local state, browser APIs, or local storage
- Shared layout and feature UI are split into `components/pages`, `components/sections`, and `components/shared`

### 2. Styling

- Tailwind CSS v4 is loaded through `@import "tailwindcss"` in `app/globals.css`
- Theme colors are driven by CSS variables on `:root` and `[data-theme="dark"]`
- The active theme is stored in local storage and applied to `document.documentElement.dataset.theme`

### 3. State and data

- There is no backend integration yet
- Card content lives in `lib/mock/`
- Liked, saved, and sale-state interactions are stored in local storage through `lib/store/collection-store.ts`

## Local Storage Keys

- `collx_liked_cards` -> liked card ids
- `collx_saved_cards` -> saved card ids
- `collx_cards_for_sale` -> cards marked for sale
- `theme` -> saved theme preference

If you want to reset the app quickly during development, clear these keys in the browser.

## Developer Workflow

### When adding a new page

1. Create the route under `app/`
2. Keep layout-level concerns in route `layout.tsx` files
3. Put reusable UI into `components/shared` or feature-specific sections into `components/sections`
4. Keep hardcoded sample data in `lib/mock` until a real API is introduced

### When adding frontend state

- Prefer local component state for screen-local interactions
- Put browser persistence helpers in `lib/`
- Keep mocked business data separate from UI components

### When replacing mocks with real APIs

- Move mock data fetching into server actions, route handlers, or external API clients
- Replace local-storage collection persistence with backend persistence
- Keep the current UI contracts where possible so visual work does not need to be rewritten

## Current Limitations

- No backend or database integration
- No environment variable setup yet
- Marketplace data is mocked

## Notes For Incoming Developers

- Treat this repo as a polished frontend prototype, not a finished production client
- The best next step is usually to preserve the current UI structure while wiring real services behind the existing sections and card interactions
- If you introduce backend integration, document new env vars and setup steps here immediately
- Keep route and component boundaries clean, because the current structure is already good for scaling feature work

## Useful Files To Know First

- `app/layout.tsx`
- `app/globals.css`
- `components/pages/home/home-page.tsx`
- `lib/store/collection-store.ts`
- `lib/mock/cards.ts`

## Status Summary

The frontend is in a strong prototype phase: the UI system, landing-page composition, and component organization are already in place, but most product logic is still mocked locally. That makes the project good for rapid frontend iteration and ready for gradual backend integration without needing a full UI rewrite.
