# Lanka Stayz

A responsive accommodation discovery and booking-request prototype for the Xero Lanka / Lanka Stayz Web Developer Practical Technical Assessment.

**Backend decision: no backend is needed for this assessment.** Task 4 explicitly states: “A real payment gateway, live availability system and backend reservation database are not required.” This implementation validates a request in the browser and displays a demo confirmation. It never sends a request to a host, charges a guest, or claims a reservation exists.

## Run locally

Install **Node.js 26.13.0 LTS** (the version in `.nvmrc`) and npm. With nvm installed, run `nvm install 26.13.0` and `nvm use 26.13.0`. Windows users can use nvm-windows or the official Node installer.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). No environment variables, credentials, database, or API keys are required.

```sh
npm test          # Booking and contact validation tests
npm run build    # TypeScript checking and production build
npm run preview  # Serve the production build locally
npm audit        # Check the locked dependency tree for known advisories
```

The portable runtime in `.tools/` is a local development convenience only. It is ignored by Git and is not part of the submission or deployed site.

## Technology choices

| Technology | Purpose |
| --- | --- |
| React | Reusable UI and explicit state for searching, saved stays, booking and dialogs |
| TypeScript | Typed property data and component contracts |
| Vite | Local development and optimized static production output |
| CSS | Original responsive design without a UI framework; grid, flexbox and breakpoints |
| Lucide React | Consistent interface icons |
| Original SVG | Custom villa / leaf / wave logo and favicon |
| Node.js 26.13.0 LTS + npm | Development, building and tests; not a production application server |
| Node's built-in test runner | Tests for date, capacity and contact validation |
| Browser APIs | Accessible native dialogs, date inputs and optional saved-stay local storage |

Package versions resolved during setup are recorded exactly in `package-lock.json`. Use `npm ci` for reproducible installs. No `latest` dependency should be needed after the initial resolution.

Node 26.13.0 was selected after checking the official release lifecycle on 4 November 2026. Node 25 is end-of-life. Node 22 remains supported, but an old unpatched 22.16.0 runtime was rejected. The downloaded Node 26 archive was checked against the official SHA-256 manifest. A supported version and a clean audit reduce known risk; neither guarantees vulnerability-free software. Keep the runtime and lockfile patched.

References: [Node release lifecycle](https://nodejs.org/en/about/previous-releases), [26.13.0 LTS release](https://nodejs.org/en/blog/release/v26.13.0), [October security fixes](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).

## Assessment coverage

| Requirement | Implementation |
| --- | --- |
| Homepage branding and navigation | Custom illustrated logo; Home, Explore Stays, About Us, Contact |
| Large holiday accommodation banner | Full-width poolside image, island positioning and discovery heading |
| Destination, dates and guest search | Search form on home and explore pages; date-order checks; capacity filtering |
| At least six sample properties | Galle, Ella, Mirissa, Kandy, Colombo and Nuwara Eliya |
| Listing data | Photo, name, destination, LKR price/night, capacity, property type and View Details |
| Destination filtering | Working destination select and destination discovery links |
| Property detail page | All six properties have their own route and three illustrative photographs |
| Amenities, price and capacity | Detail descriptions, comfort lists, house rules and booking sidebar |
| Booking request form | Name, email, contact number, dates, guests and submit button |
| Validation and confirmation | Required inputs, name/email/phone rules, no past arrival, checkout after arrival, integer guest capacity; demo reference and price summary |
| Mobile responsiveness | Navigation menu, adaptive card grids, stacked search and form, flexible gallery |
| Footer contact and social links | Clearly marked sample email, Sri Lankan location and external social platform links |
| Extra usability | Saved stays, price sorting, empty results, photo lightbox, not-found page |

All six cards appear with the initial default filters. Selecting a property type or guest count can narrow the collection. Date input does **not** filter live availability; this is intentionally outside the brief. Prices are illustrative nightly rates; the estimated total is nightly rate × nights, with no invented taxes or fees.

## Implementation steps and decisions

1. Read the entire supplied assignment and mapped the five tasks, technical constraints and deliverables.
2. Confirmed the frontend-only scope using the explicit reservation database exemption. Chose a static build to keep evaluation simple and avoid credentials or unnecessary infrastructure.
3. Checked the current Node lifecycle and security releases. Selected and pinned Node 26.13.0 LTS; verified the official archive checksum.
4. Established the React / TypeScript / Vite project, npm scripts and strict TypeScript configuration.
5. Designed the visual direction: forest green, warm ivory, restrained gold, expressive type, editorial spacing and large accommodation photography.
6. Drew an original vector brand mark. The roof suggests a welcoming villa; the leaf evokes tropical nature; the wave connects it to the island. The same artwork is used for the favicon.
7. Created six fictional, typed property records across the requested Sri Lankan destinations, with prices, capacity, amenities and imagery.
8. Built the homepage, shared navigation, footer, destination discovery, and About and Contact pages.
9. Built the listing view with destination, property type, capacity, saved-state filtering, price sorting and useful empty results.
10. Built individual detail views, three-photo galleries and an enlarging photo dialog.
11. Built the booking request dialog with shared stay state, nightly totals and independent domain validation. Success displays a clearly labelled demo confirmation.
12. Added optional local storage for saved **property IDs only**. Guest names, email addresses, contact numbers and requests are never stored or transmitted.
13. Added keyboard focus styles, labelled inputs, native dialog focus trapping, Escape dismissal, focus restoration, a skip link, meaningful image alternatives and reduced-motion support.
14. Added responsive rules for desktop, tablet and mobile; kept touch targets and long forms usable on narrow screens.
15. Added automated validation tests, production build checks and deployment configuration. See verification notes for actual results and remaining checks.
16. Documented setup, scope, limitations, image sources, AI assistance, commercial improvements and the submission checklist.

## Project structure

```text
public/
  logo.svg          Original logo and favicon
  _headers          Headers supported by compatible static hosts
src/
  main.tsx          React application entry
  App.tsx           Page views, reusable dialogs, search and booking state
  data.ts           Typed fictional accommodation catalogue
  booking.mjs       Pure date, guest and contact rules shared with tests
  styles.css        Design tokens, layouts and responsive styling
tests/
  booking.test.mjs  Domain validation tests
index.html          Metadata and application entry
vite.config.ts      React build configuration
netlify.toml        Static hosting build settings
.nvmrc              Node version pin
```

Routes use URL hashes (`#/`, `#/explore`, `#/stays/palm-house`, `#/about`, `#/contact`). This makes direct property links and refreshes work on ordinary static hosting without rewrite configuration. A commercial site should adopt a proper route library and server-rendered property pages for SEO.

## Branding and images

The logo is original SVG artwork, not a text-only placeholder or a third-party logo. SVG is used because the mark must stay sharp at header and favicon sizes and remain easy to edit.

Photos were downloaded from Unsplash's image CDN and are bundled in `public/images/` for reliable evaluation. They are stock mood references, **not verified photos of the fictional Sri Lankan properties**. Source URLs are recorded in `public/images/SOURCES.md`; captions and the About page disclose the illustrative use. Before commercial use, replace them with property-owner-approved photography and record the exact creator, source and licence for each image. [Unsplash licence](https://unsplash.com/license).

Typefaces: DM Sans and Manrope via Google Fonts, with system and Georgia fallbacks. Icons: Lucide (ISC licence). External font loading requires an internet connection; the photos are served locally. Social links lead to the public Instagram and Facebook platforms; no official brand profiles have been invented. The `.example` contact address is reserved demonstration information and will not deliver mail.

## Accessibility and privacy

The booking and photo dialogs use the native `<dialog>` element for modal semantics, focus containment and keyboard support. Closing restores focus to the invoking control. Validation errors are announced and focused; confirmations are live status regions. Inputs have visible labels, and buttons have accessible names. Favourite buttons expose pressed state. Responsive layouts and motion preferences are handled in CSS.

The site does not use analytics, cookies, tracking SDKs, authentication or payment collection. Only saved property IDs go into local storage; private browsing/storage failures are handled. Form values exist in memory until the dialog closes. External fonts create normal requests to their provider. A production version needs a privacy notice and a decision about self-hosting fonts.

## Deployment and submission

The production output is the `dist/` directory. Deploy it on a static host such as Netlify, Cloudflare Pages or Vercel. Use the build command `npm run build`, output directory `dist`, and Node 26.13.0 where supported. If a host has not yet added Node 26, build locally with the pinned version and upload `dist/` rather than silently changing the project runtime.

For Netlify, the repository includes `netlify.toml`. You can also run `npm ci && npm run build` locally and upload `dist/` using the host's static deploy interface. Hash routing requires no SPA rewrite. `_headers` is applied only on hosts that support that file format.

Do not submit an owner-private preview URL as the public demo. Confirm the final URL works in an incognito window without sign-in. Do not put `.tools/`, `node_modules/`, temporary files or credentials in a source ZIP. Include the lockfile and README. This chat has not sent any recruitment email.

Submission deadline in the supplied assignment: **7 November 2026, 12:00 noon**. Confirm the timezone with the recruiter if needed.

## Development summary

The prototype emphasizes the complete discovery-to-request journey and an original visual identity. Structured sample data powers all property views, while pure booking rules keep validation explainable and testable. Static deployment avoids infrastructure that the assignment explicitly does not require. Added features support discovery without expanding into a commercial reservation system.

For a full commercial product I would add a backend API and relational database for properties, hosts, inventory and booking requests; server-side validation; transactional availability checks; email delivery; request idempotency; staff administration; role-based authentication; rate limiting and spam controls. Payments would use a provider-hosted checkout with verified webhooks. Further work would include a property CMS, licensed photography, server rendering/SEO, localization, actual location maps, pricing/tax policies, cancellation workflows, monitoring, automated accessibility checks and end-to-end tests in CI.

## AI assistance disclosure

This project was created with substantial AI assistance using OpenAI Codex for assignment analysis, design direction, SVG branding, implementation, tests and documentation. The candidate should review every file, personalize the result, and be prepared to explain or modify it during the interview. No claim is made that this was written without AI assistance.

Suggested interview walkthrough: explain why no backend is required; trace `properties` into listing/detail views; demonstrate filtering and saving; open a request; show invalid dates and capacity enforcement; explain the distinction between a demo confirmation and a persisted reservation; describe how a real API would replace the final submit action.

## Verification and limitations

Verified on 4 November 2026 using Node 26.13.0:

- `npm run build`: TypeScript check and optimized Vite production build passed.
- `npm test`: all five domain validation tests passed (date arithmetic, invalid date ordering/past dates, guest capacity, guest contact rules, date format).
- Dependency installation audit: zero known vulnerabilities across the installed dependency tree.
- Browser: six default listings rendered; selecting Galle returned The Palm House; saving a stay updated the saved count; property details opened the request dialog.
- Browser: a valid three-night request for The Palm House displayed a demo confirmation and LKR 126,000 estimate. Browser testing found and fixed date input event handling.
- Browser: mobile navigation opened and linked correctly; page width did not exceed the viewport at 390px mobile and 768px tablet widths.
- Local logo and hero image loaded successfully after bundling stock photos.

These are focused checks, not a full accessibility certification or exhaustive cross-browser test suite. Intentional exclusions: live inventory, payments, accounts, database, email delivery and real reservations. All accommodation content and review counts are sample data. The public hosting and repository submission must be verified separately from local functionality.
