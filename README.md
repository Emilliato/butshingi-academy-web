# S. Butshingi Academy — website

A fresh Angular (v21, standalone/zoneless) rebuild of the school's public site, modeled on the
content and brand of the original https://halls-of-learning.lovable.app one-pager, expanded into
a full multi-page school website with an admin panel.

## Stack

- Angular 21, standalone components, signals, zoneless change detection
- SCSS design system (`src/styles.scss`) — no UI kit dependency
- Client-side only. **News posts and intake applications persist in `localStorage`** via
  `NewsService` / `ApplicationService` so the demo works with zero backend setup.

## Brand

Colors, fonts and copy were pulled from the original site's live branding data:

- Cream `#F9F2DE`, forest green `#1E7A49`, amber `#F1A438`, ink `#26211D`
- Headings: **Fraunces** (serif) · Body: **Space Grotesk**

## Structure

- `pages/home|about|academics|news|admissions|contact` — public site
- `pages/admin/*` + `layouts/admin-layout` — admin panel (news CRUD, applications review)
- `core/services` — `NewsService`, `ApplicationService`, `AuthService`, `SeoService`, `StorageService`
- `core/directives` — `RevealDirective` (scroll-in animation), `CountUpDirective` (animated stats)
- `shared/components` — header, footer, Google Maps embed

## Admin panel

Visit `/admin/login`.

```
Username: admin
Password: ButshingiAcademy2026
```

**This is demo-only auth** (`core/services/auth.service.ts`) — credentials are checked
client-side. Before going live, replace `AuthService` and the two data services with calls to a
real backend (e.g. Supabase/Firebase Auth + a database) so applicant data isn't only stored in the
browser.

From the admin panel you can:

- Publish/unpublish/edit/delete **news posts** (shows instantly on the public `/news` page)
- Review **intake applications** submitted via `/admissions`, filter by status, add notes and move
  them through Submitted → Under Review → Accepted/Waitlisted/Declined

## SEO

- Per-route `<title>`, meta description, canonical URL, Open Graph/Twitter tags via `SeoService`
- JSON-LD structured data: `School` schema on the homepage, `NewsArticle` schema on news posts
- `public/robots.txt`, `public/sitemap.xml`, `public/manifest.webmanifest`
- Replace `public/og-cover.svg` with a real photo-based 1200×630 image before launch, and swap the
  placeholder domain `www.butshingiacademy.org.za` in `SeoService`/`index.html`/`sitemap.xml` for
  the real one.

## Google Maps

`shared/components/google-map` uses the no-API-key `google.com/maps?q=...&output=embed` endpoint,
searching for "S. Butshingi Academy, Mqonci, Chris Hani District, Eastern Cape". For a pinned
Google Business Profile location, replace the query with the verified place ID once the school's
Business Profile is set up.

## Run it

```bash
npm install
npm start        # dev server, http://localhost:4200
npm run build     # production build → dist/butshingi-academy
```
