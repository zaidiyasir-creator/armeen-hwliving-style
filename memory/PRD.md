# Armeen HW Enterprise — Marketing Website PRD

## Original Problem Statement
"Build me a modern and classy website based on the co profile attached, the website theme need to follow St Regis hotel website https://www.marriott.com/en-us/hotels/kulxr-the-st-regis-kuala-lumpur/overview/, but use black as background, grey text and other logo / with yellow accent. add also offering of it solution summary solution as per attached (remove izh padu)."

## User Choices (verbatim)
- Bilingual website (Dwibahasa BM + EN)
- Contact: display info only, no form submission
- Imagery: pulled from company profile PDF
- Projects: mix of real PDF project list + generic showcase

## Personas
1. **Government procurement officer** — checks credentials (CIDB G2, MOF, MEDAC) & past projects
2. **Private enterprise client** — explores construction OR IT solutions, needs single point of contact
3. **Architect / consultant** — verifying capability claims and team

## Architecture / Stack
- React 19 + Tailwind 3 + lucide-react (frontend only, static marketing site)
- Single-page anchor scroll site (#about, #services, #capabilities, #portfolio, #certifications, #contact, #leadership, #industries)
- LanguageContext (React Context) for EN/BM toggle, content in /app/frontend/src/i18n.js
- Project photos extracted from PDF and stored in /app/frontend/public/armeen/

## Sections Implemented (2025-12)
1. Cinematic hero with serif headline + dual CTA
2. About: vision, mission, 4 stats
3. Services: 2 tabs — Construction (6 items) & IT Solutions (17 items, rebranded, no IZH Padu mention)
4. Capabilities: 6 differentiators
5. Portfolio: 6 project cards using real PDF photos
6. Industries: 8 sectors
7. Certifications: SSM, CIDB G2, MOF, MEDAC, LHDN TCC, NIOSH
8. Leadership: 6 team members
9. Contact: phone, email, address, hours
10. Footer: registration, brand tagline

## Testing
- iteration_1.json — 100% frontend pass, 0 console errors, all 12 functional checks pass.

## Backlog / Future Phases
- P1: Add project detail pages (currently 6 thumbnails link to #contact)
- P1: Add downloadable PDF Company Profile button in About
- P2: Add WhatsApp floating CTA (since Malaysia market loves it)
- P2: Add testimonials / client logos strip
- P2: Add Google Maps embed in Contact
- P3: Hook contact form (if user later wants enquiries to be captured)

## Iteration 2 (2025-12) — Completed
- ✅ P1: Individual project detail pages at /projects/:slug (11 real projects from PDF with full meta, highlights, multi-image gallery, prev/next navigation)
- ✅ P1: Downloadable Company Profile PDF button in About section (file: /armeen/company-profile.pdf)
- ✅ P2: Testimonials section (3 editorial quote cards) + Selected Clients & Partners wall (7 client names)
- ✅ P2: Google Maps embed in Contact section (Seremban office location)
- ✅ Smart enhancement: WhatsApp floating CTA button (bottom-right, expandable card with pre-filled bilingual message, links to wa.me/60193367316)

Architecture changes:
- Added react-router-dom (BrowserRouter + ScrollToHash hash handler)
- New routes: `/` (Home) and `/projects/:slug` (ProjectDetail)
- WhatsAppFAB always mounted at App root (works on all routes)
- 11 projects in /app/frontend/src/data/projects.js with bilingual content

Test results:
- iteration_2.json — 14/14 frontend checks PASS, zero console errors

## Iteration 3 (2025-12) — Services Restructure
- ✅ Replaced 2-tab Services section with elegant 7-division accordion
- Seven divisions (bilingual EN/BM with summary + 4 capability bullets each):
  1. Construction & Interior Design
  2. Electrical & Mechanical Engineering
  3. IT Solutions & Digital Infrastructure
  4. Production & Equipment Rental (with "Reel — Coming Soon" placeholder for video)
  5. Corporate Gifts & Printing
  6. EV Charger Supply & Installation
  7. Professional Laundry Solutions
- Single-open accordion with smooth grid-rows transition
- Each division uses a unique lucide icon (HardHat, Zap, ServerCog, Video, Gift, PlugZap, Shirt)
- iteration_3.json — 100% PASS, no regressions

## Iteration 5 (2025-12) — CMS + Production assets
**Production division enhancements:**
- ✅ 2 showreel videos compressed (417MB→17MB, 347MB→16MB) and embedded inline (PRODUCTION SHOWREEL · VOL 1/2)
- ✅ 3 PDF catalogs (Audio/Lens/Camera) compressed (~170MB → ~1.5MB) with elegant download buttons

**Full CMS Implementation:**
- ✅ JWT-based auth (24h tokens, bcrypt password hashing, single admin seeded from env)
- ✅ Backend: FastAPI endpoints — auth, news CRUD, projects CRUD (11 seeded), services-overrides upsert, file uploads
- ✅ Admin UI at /admin: News manager (CRUD + image upload), Projects manager (CRUD + gallery), Services editor (per-division override with reset)
- ✅ Home: News section between Portfolio & Industries (only shows when published items exist)
- ✅ Portfolio, ProjectDetail now fetch from /api/projects
- ✅ Services accordion merges DB overrides on-the-fly
- ✅ WhatsApp FAB hidden on /admin routes

**Architecture:**
- Bearer token auth (localStorage) — CORS allow_origin_regex=".*"
- File uploads → /app/backend/uploads served via StaticFiles at /api/uploads
- Mongo collections: users, news, projects, services_overrides (all with unique indexes)

**Credentials (test_credentials.md):** admin@armeenhw.com / nYVD628EDNIF8B

**Test results:**
- iteration_4.json — Backend 20/20 PASS, Frontend 100% critical flows PASS, zero console errors

## Iteration 6 (2025-12) — Header Dropdowns + EV Showcase
- ✅ EV Charger division: EVOLVE EV Charger image showcase with "Enquire About Installation" CTA
- ✅ Header restructured with dropdown submenus:
  - **About** → The Practice, Leadership
  - **Services** → all 7 divisions (2-column 01-07 layout)
  - **Credentials** → Certifications, Testimonials
- ✅ Hash-based auto-open: clicking a Services submenu item navigates to /#services-<key>, scrolls to that division and opens its accordion
- ✅ Mobile menu nested with expandable sub-drawers
- ✅ Silenced harmless 401 console noise on public pages (AuthContext only probes /me when token exists)
- iteration_5.json — 12/12 frontend PASS on desktop + mobile
