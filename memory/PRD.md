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
