# CollX Frontend

CollX is a frontend-first prototype for a card collecting and marketplace experience. The app currently focuses on landing-page UX, dashboard flows, card scanning interactions, browsing, collection management, profile settings, and in-app chat using mocked frontend data.

This README is written for developers joining the project so they can quickly understand what is already built, how the frontend is organized, and where the current boundaries are.

## What This Frontend Includes

- Marketing homepage built with reusable section components
- Authentication modal flows for register, login, forgot password, and OTP verification
- Protected dashboard shell with sidebar and top navigation
- Card scanning UI using the browser camera API
- Collection, browse, chat, and profile screens
- Theme switching with light and dark mode persistence
- Toast notifications with `sonner`
- Mocked auth, chat, marketplace, and collection state stored locally in the browser

## Tech Stack

- `Next.js 16` with the App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `ESLint 9` with `eslint-config-next`
- `lucide-react` for icons
- `sonner` for toast feedback
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

## Demo Login

The current auth flow is mocked on the client.

- Email: `root@gmail.com`
- Password: `root`

Successful login writes the user into local storage and redirects to `/dashboard`.

## Project Structure

```text
app/
  page.tsx                     -> homepage entry
  layout.tsx                   -> root layout, fonts, toaster, theme shell
  globals.css                  -> global styles and theme tokens
  about/, privacy/, terms/     -> static legal/info pages
  data-privacy/
  dashboard/
    layout.tsx                 -> protected dashboard shell
    page.tsx                   -> scanner + trending cards
    collection/page.tsx        -> user collection view
    browse/page.tsx            -> marketplace browsing UI
    chat/page.tsx              -> messaging UI
    profile/page.tsx           -> account/profile UI

components/
  pages/home/                  -> homepage composition
  sections/home/               -> homepage sections
  shared/
    auth/                      -> auth UI pieces
    cards/                     -> reusable card UI
    layout/                    -> site header
    theme/                     -> theme toggle

lib/
  constants/                   -> navigation and static config
  hooks/use-auth.ts            -> mocked auth logic
  mock/                        -> mock cards and chat data
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

### Dashboard routes

- `/dashboard` scanner dashboard and trending cards
- `/dashboard/collection`
- `/dashboard/browse`
- `/dashboard/chat`
- `/dashboard/profile`

The dashboard is guarded client-side inside `app/dashboard/layout.tsx`. If no mocked user exists in local storage, the user is redirected back to `/`.

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
- Auth is mocked in `lib/hooks/use-auth.ts`
- Card and chat content live in `lib/mock/`
- Captured cards are stored in local storage through `lib/store/collection-store.ts`
- Dashboard protection is frontend-only and should be replaced with real auth before production use

### 4. Scanner flow

- The scanner screen uses `navigator.mediaDevices.getUserMedia(...)`
- Capturing a card currently simulates identification and creates a mocked card result
- Confirming the scan adds the card to local storage so it appears in the collection page

## Local Storage Keys

- `collx_user` -> current mocked logged-in user
- `collx_captured_cards` -> cards added from the scanner flow
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

- Replace `useAuth()` with a real auth provider/session source
- Move mock data fetching into server actions, route handlers, or external API clients
- Replace local-storage collection persistence with backend persistence
- Keep the current UI contracts where possible so visual work does not need to be rewritten

## Current Limitations

- No backend, database, or real authentication
- No environment variable setup yet
- Google auth button is visual only
- Register, OTP, and forgot-password flows are simulated
- Chat is local in-memory mock state only
- Marketplace data is mocked
- Profile actions such as password reset and delete account are UI-only
- Camera/card recognition is simulated after capture

## Notes For Incoming Developers

- Treat this repo as a polished frontend prototype, not a finished production client
- The best next step is usually to preserve the current UI structure while swapping mocked flows for real services
- If you introduce backend integration, document new env vars and setup steps here immediately
- Keep route and component boundaries clean, because the current structure is already good for scaling feature work

## Useful Files To Know First

- `app/layout.tsx`
- `app/globals.css`
- `app/dashboard/layout.tsx`
- `app/dashboard/page.tsx`
- `components/pages/home/home-page.tsx`
- `components/sections/home/auth-cta.tsx`
- `lib/hooks/use-auth.ts`
- `lib/store/collection-store.ts`
- `lib/mock/cards.ts`
- `lib/mock/chats.ts`

## Status Summary

The frontend is in a strong prototype phase: the UI system, screen flows, and component organization are already in place, but most product logic is still mocked locally. That makes the project good for rapid frontend iteration and also ready for gradual backend integration without needing a full UI rewrite.
