# CollX Clone Build Prompt

Create a modern landing page app called `CollX` that matches the structure, tech stack, and behavior described below.

## Goal

Build a clean, premium, theme-aware homepage for a sports card app. The page should feel minimal, sharp, and app-like rather than marketing-template-heavy. The experience should work well on desktop and mobile and support light/dark theme switching across the full UI.

## Tech Stack

- Framework: Next.js 16 App Router
- Language: TypeScript
- UI Library: React 19
- Styling: Tailwind CSS v4 using `@import "tailwindcss"`
- Icons: `lucide-react`
- Fonts: `Geist` and `Geist Mono` from `next/font/google`
- Linting: ESLint with `eslint-config-next`

## Project Structure

Use this general structure:

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  layout/
    site-header.tsx
  theme/
    theme-toggle.tsx
  sections/
    hero-slider.tsx
    auth-cta.tsx
lib/
  theme.ts
  constants/
    navigation.ts
    slider.ts
public/
  slides/
    slide-1.svg
    slide-2.svg
    slide-3.svg
    slide-4.svg
```

## App Composition

The homepage should render these sections in this order:

1. Sticky header
2. Hero image slider
3. Auth CTA section

## Layout Rules

- Use a centered content container with `max-w-7xl`
- Apply horizontal padding similar to `px-4 sm:px-6 lg:px-12`
- Use large rounded surfaces such as `rounded-3xl` and `rounded-4xl`
- Keep spacing generous and modern
- Favor monochrome UI tokens with image-driven visual interest

## Theme System

Implement a lightweight custom theme system using `data-theme` on the root `<html>` element instead of adding an external theming package.

### Theme behavior

- Support only `light` and `dark`
- Default theme is `light`
- Persist theme in `localStorage`
- Expose helper functions in `lib/theme.ts`
- Toggle theme with a reusable `ThemeToggle` client component

### Theme tokens

In `app/globals.css`, define CSS variables like:

- `--background`
- `--foreground`
- `--scrollbar-track`
- `--scrollbar-thumb`
- `--scrollbar-thumb-hover`

Map them into Tailwind v4 theme variables with:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

Also add:

- smooth color transitions on `body`
- custom scrollbar styling
- global `box-sizing: border-box`

## Header

Create a sticky top header with:

- Brand text: `Coll X`
- Desktop nav links from a constants file
- `Download App` button
- Theme toggle button
- Mobile hamburger menu using `Menu` and `X` from `lucide-react`

### Navigation constants

Use a `navigation.ts` file that exports:

- `NAV_ITEMS`
- `DOWNLOAD_APP_LINK`

Example labels:

- Home
- Features
- Marketplace
- Collection

## Hero Slider

Create a client component hero slider with these behaviors:

- Full-width contained section inside `max-w-7xl`
- Rotating slides every 3 seconds using `setInterval`
- Data-driven slides from `lib/constants/slider.ts`
- Use `next/image`
- Smooth fade transition between slides
- Large bottom-aligned text overlay on each slide
- Dark gradient overlay for readability

### Slide data

Use 4 slides with:

- `id`
- `title`
- `description`
- `imageSrc`
- `imageAlt`

The content should represent a sports card app with scanning, marketplace, pricing, and collection management messaging.

## Auth CTA Section

Build a theme-aware CTA section below the slider.

### Visual style

- One large primary card on the left
- Two supporting feature cards on the right
- All cards must react properly to light/dark theme changes
- Use `bg-background`, `text-foreground`, `border-current/15`, and `bg-foreground/*` layering instead of hardcoded theme-specific component colors
- Include subtle gradients or overlays for depth, but keep them understated

### Left card content

- Badge text: `Join CollX`
- Headline about building an account in a theme-aware flow
- Short supporting paragraph
- Two buttons:
  - `Sign up`
  - `Login`

### Right cards

Card 1:
- Icon
- Title: `Multi-step email onboarding`
- Short description

Card 2:
- Icon
- Title: `Theme-aware surfaces`
- Short description

## Signup Modal Flow

When the user clicks `Sign up`, open a centered modal popup with backdrop blur.

### Modal shell

- Rounded large panel
- `Get started` heading
- Supporting line:
  `By continuing, you agree to CollX's policy and user agreement.`
- Close on backdrop click
- Close on `Escape`
- Lock body scroll while modal is open

### Step 1: Welcome options

Show 2 large buttons with icons:

- `Continue with Google`
- `Continue with Email`

The Google button can be visual only; no real auth is required.

### Step 2: Email signup form

When the user clicks `Continue with Email`, show a form with:

- Name
- Email
- Password
- Confirm password
- Continue button

Validation rules:

- all fields required
- password and confirm password must match
- disable continue button until passwords match

### Step 3: Verification

After clicking continue:

- simulate that a verification code was sent to the entered email
- show a message that an 8-digit verification code was sent
- display 8 OTP input boxes
- accept only numeric input
- support paste behavior
- auto-focus the next box after a digit is entered
- backspace should move focus backward when appropriate
- show a `Complete sign up` button
- disable completion until all 8 digits are filled

### Step 4: Success

After successful verification:

- show a success icon
- show a message that signup is complete
- allow closing the modal

## Interaction Requirements

- Use React client components where interactivity is needed
- Use `useState`, `useEffect`, `useRef`, and `useMemo` where appropriate
- Keep the flow local-state-driven only; no backend required
- Simulate verification only, do not integrate real email or auth APIs

## Styling Direction

- Minimal black/white visual system with strong contrast
- Theme-aware surfaces instead of separate duplicated light/dark designs
- Large radii, soft borders, subtle transparency
- Typography should feel polished and compact
- Keep the site premium and uncluttered

## Accessibility Expectations

- Buttons need clear labels
- Inputs should have visible labels
- Modal should support keyboard escape
- OTP fields should have per-digit accessible labels
- Keep contrast strong in both themes

## Implementation Notes

- Use constants files for nav items and slides
- Use App Router files (`app/layout.tsx`, `app/page.tsx`)
- Set metadata in `layout.tsx`
- Put theme utility functions in `lib/theme.ts`
- Prefer composable section components under `components/sections`
- Keep code clean and production-style, not demo-quality shortcuts

## Deliverable

Return a complete Next.js project implementing this exact structure and behavior, with responsive layout, theme toggle, autoplay hero slider, and the full multi-step signup modal experience.
