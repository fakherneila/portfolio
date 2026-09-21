# Portfolio

A personal portfolio for Fakher Neila, a final-year Software Engineering
student looking for a PFE internship. Built as a single-page-app with a
3D hero, full bilingual support (English and French), a light and dark
theme, and a small content-driven architecture that makes adding new
projects or experience a five-minute job.

The design brief was simple: it should not look like a template. It
should feel like something a product studio would ship.

---

## What's in it

The site is a single-page application with a homepage composed of eight
sections, plus three supporting routes.

Homepage sections, in order:

- Hero with a 3D animated scene and a role typewriter
- About with a photo, short bio, four animated counters, and languages
- Experience rendered as a gold timeline that draws itself as you scroll
- Skills grouped by category with tilt cards and real brand logos
- Projects preview showing three featured case studies
- Education including degrees, leadership roles, and hackathons
- Contact with a validated form and clickable email and phone
- A fixed 3D background that drifts behind everything, theme-aware

Supporting routes:

- `/projects` — full list with filters
- `/projects/:slug` — a dedicated case study per project
- `/blog` — a coming-soon placeholder (the blog itself is on hold)

Navigation is bilingual. Every route has `/en` and `/fr` variants. The
theme switches between a soft ivory light mode and a deep black dark
mode, with a signature gold accent running through both.

---

## Tech stack

- Vite 5 for the build
- React 18 with TypeScript in strict mode
- Tailwind CSS v3 for styling, with CSS variables driving the theme
- Framer Motion for animations and page transitions
- GSAP with ScrollTrigger for the experience timeline draw-in
- React Three Fiber and drei for the 3D hero and the fixed background
- react-router-dom v6 for routing with locale-prefixed URLs
- i18next with react-i18next for internationalization
- react-hook-form and zod for form validation
- lucide-react for iconography
- react-helmet-async for per-page metadata
- Resend for the contact form, delivered through a Vercel serverless
  function

There is no CMS, no database, and no backend beyond the single contact
endpoint. Everything else is static content served from the repository.

---

## Getting started

You need Node 18.17 or newer, and npm.

Clone the repository and install dependencies:

    npm install

Copy the environment template and fill it in:

    cp .env.example .env.local

Then start the dev server:

    npm run dev

The site will be available at `http://localhost:5173`. It redirects
automatically to `/en` or `/fr` based on your browser language.

---

## Environment variables

Only two variables are strictly required for local development. The
rest are for deployment and optional features.

Required for a full local experience:

- `SITE_URL` — the deployed domain, used for canonical URLs, Open Graph
  tags, and the sitemap. In dev you can leave it as
  `http://localhost:5173`.
- `VITE_SITE_URL` — same value, exposed to the browser.

Required for the contact form to actually send email:

- `RESEND_API_KEY` — your Resend API key. Get one at resend.com.
- `CONTACT_TO_EMAIL` — the inbox that receives form submissions.
- `CONTACT_FROM_EMAIL` — a verified sender address on Resend.
- `CONTACT_CC_EMAIL` — optional second inbox to CC every submission.

Optional:

- `VITE_ANALYTICS_ENABLED` — set to `true` to enable analytics. Off by
  default.
- `VITE_PLAUSIBLE_DOMAIN` — your Plausible domain if you use it.

See `.env.example` for the full list with comments.

---

## Project structure

The folder layout follows the router, not the other way around. Anything
that produces a URL lives in `src/app`. Everything else is imported.

    src/
      app/               routes, layouts, and pages
      components/
        layout/          navbar, footer, mobile menu, chrome
        sections/        homepage sections
        ui/              reusable primitives (button, card, etc.)
        three/           WebGL scenes
        providers/       theme and helmet providers
      data/              typed content (experience, skills, projects)
      hooks/             custom React hooks
      i18n/              translation setup and locale files
      lib/               utilities, formatters, schemas
      styles/            global CSS with theme variables
      types/             shared TypeScript types

Content lives separately from code. There is no reason to touch
`src/components` when adding a new project or a new internship. You edit
`src/data` and the site updates.

---

## Content guide

### Adding a project

Open `src/data/projects.ts` and add an entry to the `PROJECTS` array.
Every project needs the following fields:

- `slug` — the URL segment (e.g. `my-new-project`)
- `title` — an object with `en` and `fr` strings
- `description` — same bilingual shape
- `longDescription` — optional, used on the detail page
- `cover` — path to an image in `/public/projects/`
- `stack` — an array of technology names
- `categories` — an array of category ids for filtering
- `year` — the year of the project
- `featured` — boolean, controls whether it appears on the homepage
- `metrics` — optional array of `{ label, value }` for the impact grid
- `liveUrl`, `repoUrl` — optional links

Drop the cover image at `public/projects/<slug>.webp`. The recommended
size is 1600 by 900 pixels, saved as WebP. If the image is missing, the
card shows a gold gradient placeholder instead of breaking.

### Adding an internship

Open `src/data/experience.ts` and add an entry to `EXPERIENCE`. Order
does not matter in the file — the section sorts by date. Each entry
needs a company name, role in both languages, location, start and end
dates in `YYYY-MM` format, a short summary, a list of bullet points, and
the tech stack. An optional `achievement` field renders as a highlighted
callout.

Use `end: 'present'` for ongoing roles.

### Updating translations

All UI strings live in `src/i18n/locales/en.json` and `fr.json`. Keys
must match exactly between the two files. If you add a key to one, add
it to the other or the site will fall back to the key name itself and
you will see something like `nav.newSection` on the page.

Content that belongs to a specific project or experience entry is not in
these files. It lives inline in the data files, in the `{ en, fr }`
shape.

### Adding an image

Static images go in `public/`. Reference them from components with a
leading slash:

    <img src="/projects/my-project.webp" />

Do not put images in `src/`. Everything in `public/` is served as-is at
the matching URL.

---

## Deployment

The site is designed to deploy to Vercel, but it will work on any static
host that supports serverless functions for the contact endpoint.

The flow:

1. Push the repository to GitHub.
2. Import the project on vercel.com.
3. Add the environment variables from `.env.example` in the Vercel
   dashboard.
4. Deploy. Vercel will detect Vite automatically.

The `vercel.json` file handles two things: rewriting all non-API routes
to `/index.html` (because this is a single-page app), and adding a small
set of security headers.

After the first deploy, update the `Sitemap` line in `public/robots.txt`
with your real domain, and set `SITE_URL` in Vercel to the same value.
The sitemap is regenerated on every build by `scripts/generate-sitemap.ts`.

---

## Available scripts

- `npm run dev` — start the dev server
- `npm run build` — generate the sitemap and produce a production build
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint
- `npm run format` — format the source with Prettier
- `npm run fetch:tech` — download technology logos into `public/tech`
- `npm run check:assets` — list missing or present images

The `fetch:tech` script only needs to be run once, and only if you want
to refresh the technology logos. The SVGs are already committed.

---

## Design notes

The palette is gold and black. In light mode the background is a warm
ivory and the accent is a deep, restrained gold. In dark mode the
background is true black and the accent becomes a bright, almost
metallic gold that glows softly against the surface.

Everything respects `prefers-reduced-motion`. On low-end devices or when
the user has asked for reduced motion, the 3D scenes do not render.
They are replaced by static gradients. Nothing breaks, it just calms
down.

The 3D scenes are code-split. They do not load until they are visible,
and the main bundle stays lean as a result. If you look at the production
build output you will see the hero scene and the background scene as
separate chunks.

---

## Browser support

Modern evergreen browsers only. Specifically Chrome, Firefox, Safari,
and Edge in their last two major versions. The 3D scenes require WebGL,
which has been supported everywhere for years. The static fallback
covers the rare case where WebGL is unavailable.

The site is responsive and has been tested down to 360 pixels of width.

---

## Credits

Fonts: Clash Display from Fontshare, and Inter from Google Fonts.
Technology logos: Simple Icons. Icons: Lucide.

---

## License

Personal project. All rights reserved.