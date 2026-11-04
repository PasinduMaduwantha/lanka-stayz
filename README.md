# Lanka Stayz

A Sri Lankan accommodation discovery prototype for the Xero Lanka / Lanka Stayz Web Developer Practical Technical Assessment. The design uses familiar booking-site patterns—prominent destination/date search, a filter sidebar, comparison-friendly results and a clear request flow—while retaining original Lanka Stayz branding.

Live demo: **https://lanka-stayz-island-escapes.resolutedace.chatgpt.site**

## Does this assignment require a backend?

**No.** Task 4 explicitly states: “A real payment gateway, live availability system and backend reservation database are not required.” It asks for required-field validation and a confirmation after a sample booking submission. The brief also calls this a prototype, not a complete commercial platform, and excludes accounts and reservation management.

This project implements that scope in the browser. It validates contact details, dates and capacity, calculates an estimate and displays a labelled demo confirmation. It does not send an email, check inventory, store a booking or claim that a real reservation exists. A backend would become necessary for real availability, durable reservations, host administration, email delivery and payments. The submit handler is the point where a future API integration would be added.

## Run locally

Use **Node.js 26.13.0 LTS** (pinned in `.nvmrc`) and npm. With nvm / nvm-windows installed:

```sh
nvm install 26.13.0
nvm use 26.13.0
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. No environment variables, credentials, API keys or database are needed.

```sh
npm test          # All domain, catalogue, component and asset tests
npm run test:unit # Pure booking rules, using Node's test runner
npm run test:ui   # Vitest: catalogue, React interactions and asset/config checks
npm run build    # Strict TypeScript check and optimized static build
npm run preview  # Preview the production dist/ build
npm run format   # Consistent source and test formatting
npm audit        # Current known dependency advisories
```

The ignored `.tools/` directory is only a portable runtime used on the original development machine. It must not be committed, uploaded to Vercel, or included in the submission ZIP. Install Node normally on other machines.

## Tech stack

| Tool | Reason |
| --- | --- |
| React 19 + TypeScript | Typed data and reusable search, listing, detail and dialog components |
| Vite 8 | Fast local development and optimized static output |
| Plain CSS | Original responsive design without a template or UI framework |
| Lucide React | Consistent interface icons |
| Original SVG logo | Villa roof, tropical leaf and wave; scalable logo and favicon |
| Node 26 LTS + npm | Build and test tooling; no runtime application server |
| Node test runner | Pure date, capacity and contact validation tests |
| Vitest + Testing Library + jsdom | Catalogue and rendered React interaction tests |
| Prettier | Readable and consistent source formatting |
| GitHub Actions | Run tests and production build on pushes and pull requests |
| Vercel | Ready-to-import Vite configuration in `vercel.json` |

Exact dependency versions are committed in `package.json` and `package-lock.json`; use `npm ci` for reproducible installs. The Node 26.13.0 archive was verified against the official SHA-256 manifest. Node 25 is end-of-life; the project uses the supported Node 26 LTS branch. A clean dependency audit is a point-in-time check, not a guarantee against every vulnerability.

Official references: [Node release lifecycle](https://nodejs.org/en/about/previous-releases), [Node 26.13.0](https://nodejs.org/en/blog/release/v26.13.0), [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite), [Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## What is implemented

| Assessment requirement | Where to find it |
| --- | --- |
| Brand and logo | Original SVG in header, footer and favicon |
| Home, Explore Stays, About Us, Contact | Shared responsive navigation |
| Sri Lankan holiday accommodation banner | Homepage with authentic Sri Lankan coastal imagery |
| Destination, check-in/out, guest search | Homepage and Explore search forms |
| Six sample properties | Galle, Ella, Mirissa, Kandy, Colombo and Nuwara Eliya |
| Photo, name, location, LKR price, capacity, type | Homepage property cards and listing result cards |
| Destination filtering | Search select and homepage destination links |
| Property details with three photos | Every property has a separate hash route and photo lightbox |
| Description, amenities, capacity, price, dates | Property details and booking sidebar |
| Request booking form | Guest name, email, phone, arrival, departure and guest count |
| Validation and confirmation | Required fields plus calendar/date-order/capacity/contact rules; demo receipt |
| Responsive layout | Mobile navigation, filter panel, adaptive grids and stacked forms |
| Contact and social links | Clearly labelled sample contact and external social platform links |
| Extra discovery features | Nightly budget, multiple property types, facilities, saved stays, price/rating sorting and empty results |

Dates are used for request planning and total estimates, **not live availability filtering**. All prices, names, descriptions and review counts are fictional. Review scores are illustrative, not scraped guest reviews. Estimated totals are nightly rate × nights; no fabricated taxes or service fees are added.

## Implementation steps

1. Read the complete assignment and mapped each task and deliverable into the prototype scope.
2. Confirmed that a frontend implementation satisfies the explicit database, payment and inventory exemptions.
3. Selected React, TypeScript and Vite; verified the current Node lifecycle and pinned Node 26.13.0 LTS.
4. Created an original villa / leaf / wave SVG mark. Updated it to the blue, white and warm-yellow visual system.
5. Structured six fictional properties with locations, nightly prices, capacity, descriptions, facilities and three photos each.
6. Built the homepage, original branding, shared navigation, footer, About and Contact pages.
7. Reworked the design toward Booking.com-style booking UX: navy header, strong search, yellow search outline, destination tiles, filter sidebar and horizontal result cards. No Booking.com logo, proprietary UI assets or backend are used.
8. Researched real Sri Lankan photographs on Wikimedia Commons; checked reusable licences; downloaded assets and recorded creators, original subjects, sources and display modifications.
9. Built destination and guest search, nightly budget, type/facility filters, sorting and empty-result recovery using a pure catalogue selector.
10. Added optional saved property IDs in local storage with corrupt/blocked-storage recovery. No guest details are stored there.
11. Built all six detail routes, three-photo galleries, amenities, house rules and booking sidebars.
12. Built the booking dialog, shared stay state, date and guest checks, phone/email/name validation, nightly estimates and clear demo confirmation.
13. Improved validation to reject impossible ISO calendar dates such as 30 February, rather than accepting JavaScript's normalized dates.
14. Added native dialog semantics, Escape dismissal, focus restoration, visible labels, error/status announcements, a skip link and reduced-motion support.
15. Adapted layouts for narrow phones, tablets and desktop. Added a collapsible mobile filter panel and mobile navigation.
16. Wrote automated business-rule, catalogue, React interaction and local asset tests. Tests caught a route parsing regression during the redesign; it was corrected before delivery.
17. Added `vercel.json`, `.vercelignore`, GitHub CI and reproducible install instructions. The preview platform is optional; the app has no dependency on Sites APIs.
18. Formatted source, ran tests and the production build, performed browser checks, and recorded actual results in `TESTING.md`.

## Project structure

```text
src/
  main.tsx          React mount point
  App.tsx           Pages, search, filters, result cards and application state
  BookingModal.tsx  Native dialog wrapper and booking request flow
  catalogue.ts      Pure combined filtering and sorting logic
  booking.mjs       Pure calendar, stay and contact validation
  data.ts           Typed fictional property catalogue
  types.ts          Shared stay type
  styles.css        Visual system and responsive layouts
tests/
  booking.test.mjs  Date, capacity and guest contact rules
  catalogue.test.ts Filtering, sorting and catalogue immutability
  app.test.tsx      Rendered React interactions and booking flow
  assets.test.ts    Local photo and deployment config checks
  setup.ts         DOM test setup; native dialog methods are mocked in jsdom
public/
  logo.svg          Original vector logo
  images/srilanka/  Authentic Sri Lankan photography and licence metadata
  images/SRI-LANKA-SOURCES.md
.github/workflows/ci.yml
vercel.json
README.md
TESTING.md
```

Routes use hashes: `#/`, `#/explore`, `#/stays/palm-house`, `#/about`, `#/contact`. This allows direct detail links and reloads on static hosts without rewrite rules. A commercial implementation should use a route library and server rendering for property SEO.

## Put it on GitHub

Create an empty GitHub repository, then open a terminal in this project. If the local repository already exists (as in the original development workspace), commit your current source and add your GitHub repository as a separate remote:

```sh
git status
git add .
git commit -m "Build Lanka Stayz accommodation prototype"
git remote add github https://github.com/YOUR_USERNAME/lanka-stayz.git
git push -u github main
```

If `github` is already configured, inspect `git remote -v` and use the existing correct remote. For a fresh extracted ZIP, run `git init -b main` before these commands. GitHub authentication is handled by your Git installation or credential manager; never put a token in project files or a remote URL.

Do not include `.tools`, `node_modules`, `outputs`, `.env` secrets or local credentials. `.gitignore` excludes generated files; `.openai/hosting.json` contains only a preview project identifier, not credentials. The app works without it on Vercel.

## Publish on Vercel

1. Push the source and lockfile to your GitHub repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Select **Vite**, project root `.`, install command `npm ci`, build command `npm run build`, output directory `dist`.
4. Use Node **26.x**. Vercel currently supports it and automatically applies patch updates; `.nvmrc` pins the locally verified version.
5. No environment variables, database or server functions are required. Deploy.
6. Open the resulting URL in a signed-out/incognito window. Disable Vercel Deployment Protection for the submission deployment if it requests authentication; verify the production URL is accessible to the interviewer.
7. Test a direct link such as `https://YOUR_PROJECT.vercel.app/#/stays/palm-house` and refresh it.

`vercel.json` contains the static build settings and supported security headers. There is no catch-all rewrite because hash routing does not require one. `.vercelignore` excludes the original preview platform metadata and local tools. The included GitHub Actions workflow tests/builds the source; Vercel's Git integration handles deployment separately.

The chat has prepared this configuration but has not created a repository or deployed into your personal GitHub/Vercel account.

## Photos, branding and licences

The current UI uses photographs of **real Sri Lankan places**: southern coastal hotels and architecture, Ella hill-country accommodation, Kandy, Colombo/Mount Lavinia and Nuwara Eliya. They are reused under the licences recorded in [the photo credits](public/images/SRI-LANKA-SOURCES.md) and `public/images/srilanka/metadata.json`. A public visual credits page is linked in the footer. Credits name the actual photographed places; the fictional listings are not affiliations or verified offers from those hotels.

Only Wikimedia thumbnail resizing and CSS display cropping were applied. Each photograph retains its original CC licence, including attribution/share-alike where applicable. Keep the credits with redistributed assets. For a real platform, replace this inspiration collection with approved photos of each actual property.

The original logo uses a villa roof for hospitality, a leaf for tropical nature and a wave for the island. SVG keeps it sharp at favicon and header sizes. Lucide icons use the ISC licence. DM Sans and Manrope load through Google Fonts with system fallbacks; all photos are local. The `.example` contact address is demonstration-only. Social links lead to the public platforms; no official profiles have been invented.

## Testing, accessibility and privacy

See **[TESTING.md](TESTING.md)** for cases, results, browser checks and limits. jsdom tests validate component behaviour but cannot certify real browser layout, image decoding, native date pickers or focus trapping; those need browser verification as well.

Dialogs use native `<dialog>` semantics and focus management. Inputs have visible labels, favourites expose pressed state, errors/status messages are announced, keyboard focus is visible and reduced motion is respected. These measures are not a formal accessibility certification.

No analytics, cookies, login or payment collection are included. Local storage contains saved **property IDs only**. Guest details live in component memory until the booking dialog closes. Fonts make ordinary external requests to Google; photos are bundled locally. A production version needs a privacy notice and a considered consent/data-retention policy.

## Development summary and commercial improvements

The prototype delivers a complete discovery-to-request journey with a Sri Lankan visual identity. Typed data powers every view, pure business rules make validation testable, and a static build keeps reviewer access simple. Booking-site conventions make filtering and comparison familiar while preserving honest demo boundaries.

A commercial version would add a server API and relational database for inventory, pricing, guests, hosts and reservations; server-side validation; transactional availability checks; idempotent request handling; host administration; email notifications; authentication/authorization; abuse protection and rate limiting. Payments would use a provider-hosted checkout with verified webhooks. Other priorities include licensed owner photography, SEO/server rendering, localization, actual maps, taxes/cancellation policies, monitoring and cross-browser accessibility/end-to-end tests in CI.

## AI assistance disclosure

OpenAI Codex substantially assisted with requirement analysis, design, SVG branding, source implementation, image research, tests and documentation. The candidate should review and personalize the code, understand every decision and be prepared to modify it during the interview. The project does not claim to be written without AI assistance.

Suggested interview walkthrough: explain the brief's backend exemption; trace `data.ts` through `selectProperties` into results/detail views; demonstrate filters and saved stays; submit invalid and valid dates; show the tests; explain why the confirmation does not represent a persisted reservation; identify the submit handler as the future API boundary.

Submission deadline in the supplied assessment: **7 November 2026, 12:00 noon**. Submit the public production URL, GitHub repository or source ZIP, this README and the development summary. No recruitment email has been sent by this chat.
