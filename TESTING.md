# Test plan and verification

Environment: Windows, Node.js 26.13.0 LTS, React 19, Vite 8. Verification performed on 4 November 2026.

## Automated suite

Run `npm ci` followed by `npm test`. The suite has two layers: Node's test runner for pure booking rules, and Vitest / Testing Library / jsdom for catalogue rules, rendered components and submission assets.

| Area | Cases |
| --- | --- |
| Calendar arithmetic | Month/year boundaries, leap years, valid leap day, impossible dates, malformed and missing ISO dates, invalid estimates |
| Stay rules | Missing dates, past check-in, reversed dates, same-day checkout, today as arrival, minimum one night |
| Guests | Zero, negative, fractional, blank and non-numeric counts; exact capacity; lower/upper stepper bounds |
| Contact | Empty/short name, malformed/overlong email, formatted international phone, invalid characters and digit count |
| Catalogue | All six destinations, default collection, capacity, multiple property types, combined filters, inclusive budget boundary, all selected amenities |
| Sorting | Price ascending/descending, rating, original catalogue not mutated |
| Saved stays | Save/unsave, pressed state, empty collection, unknown IDs, corrupt JSON, only IDs persisted |
| Pages | Home content and six cards, every detail route, three gallery photos, unknown property route |
| Search interaction | Destination control, type/facility filters, reset, no-results recovery, sort control, invalid date feedback |
| Booking interaction | Required contact fields, three-night estimate, successful demo receipt, same-day rejection, bad phone, no personal-data persistence |
| Dialog/navigation | Photo open/close, close callback, scroll lock, skip-link focus, menu expanded state |
| Assets/deployment | Three distinct local Sri Lankan images for each property, hero existence, source/creator/licence for displayed photos, Vercel settings, ignored generated directories |

The test clock for sample requests uses future fixed dates (December 2028) and explicit dates for domain rule tests. Update those UI fixtures if maintaining this assessment after 2028.

## Browser verification

The app was exercised in the available Chromium-based in-app browser, independently of jsdom:

1. Load the home page and check the Sri Lankan hero, branding, search and destination cards.
2. Open Explore: six results. Select Private pool: one matching property. Reset filters.
3. Search Ella and open its detail page; inspect the three-photo gallery and booking form.
4. Fill a sample guest name, email and contact number. Submit same-day arrival/departure: error explains that checkout must be after arrival.
5. Change to a three-night stay at LKR 18,500: confirmation shows LKR 55,500, correct dates, two guests and an explicitly labelled demo reference.
6. Open a gallery photo and dismiss with Escape: dialog closes.
7. Test mobile filter panel and navigation, tablet and desktop layouts; check document width against viewport width.
8. Inspect screenshots of home, results, details and mobile layout. Check local images decode and show Sri Lankan architecture/scenery.

Final results:

- **80 automated tests passed:** 24 Node domain tests plus 56 Vitest catalogue/component/asset tests across three files.
- **Production build passed:** strict TypeScript check and Vite build; application JavaScript approximately 82.2 kB gzip and CSS approximately 7.7 kB gzip, excluding images and fonts.
- **Production dependency audit:** zero known vulnerabilities reported by `npm audit --omit=dev`. The full installation audit also reported zero known vulnerabilities after test-tool installation.
- **Browser:** completed destination-to-request flow, same-day rejection, correct LKR 55,500 three-night Ella confirmation, gallery Escape dismissal, facility/type filters, tablet filter panel, mobile menu, About and Contact FAQ.
- **Responsive widths checked:** 320, 390, 768, 1024 and 1440 CSS pixels. Reported document widths did not exceed their corresponding viewport widths; screenshots were reviewed. These checks do not replace testing on physical devices.
- **Assets:** every displayed photograph has a local file plus creator/source/reusable-licence metadata. Credits page contains no blank records.

GitHub Actions and a personal Vercel deployment are prepared, not executed in the user's accounts.

## Regression issues caught and fixed

- Detail-page route parsing during the redesign used the wrong substring offset. All six detail-route tests failed; corrected the parser and reran them successfully.
- Date handling was strengthened to reject impossible calendar dates rather than JavaScript-normalized values.
- Mobile filters were moved to an accessible labelled panel with a Done control so they are reachable without scrolling past every result.
- Singular bedroom/bathroom wording was corrected for one-room stays.
- Development watcher ignores portable tools and output archives to avoid unrelated reloads.

## Verification limits

No test proves absence of all defects. jsdom mocks `showModal()` / `close()` and does not implement real layout, date pickers or native focus containment; the real-browser checks complement it. This is not a formal accessibility audit or an exhaustive Safari/Firefox/physical-device test. GitHub Actions is configured but cannot be reported as passed until it runs in the user's repository. Vercel configuration is checked locally; a deployment into the user's Vercel account has not been performed. No live availability, email, payment, database or real reservation is tested because those features are explicitly outside the assessment scope.
