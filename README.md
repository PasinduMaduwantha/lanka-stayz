# Lanka Stayz

A responsive accommodation booking prototype for Sri Lanka. Explore six sample properties, filter by destination, and submit a validated booking request.

[Live demo](https://lanka-stayz-sooty.vercel.app) · [Development summary](DEVELOPMENT-SUMMARY.md) · [Test notes](TESTING.md)

## Run locally

Use Node.js 26.13.0 (pinned in `.nvmrc`) and npm. From the repository root:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. Local setup requires only Node.js and npm.

```sh
npm test         # Run the automated suite
npm run build    # Type-check and build into dist/
npm run preview  # Serve the production build locally
```

## Technologies

- **React and TypeScript** for the interface, components, and typed property catalogue.
- **Vite, Node.js and npm** for development, dependency installation, and production builds.
- **CSS, SVG and Lucide** for responsive layouts, original branding, and icons.
- **Node's test runner, Vitest and Testing Library** for business rules and UI tests.
- **GitHub Actions and Vercel** for automated checks and hosting.

## Prototype scope

- Booking requests show a demo confirmation and estimated total. Live availability, payments, and persistent reservations are outside this prototype.
- Host Studio demonstrates listing drafts and request review within one session. Google sign-in and public listing publication remain future work.
- Listings use fictional property data and credited Sri Lankan photography. [Photo credits](public/images/SRI-LANKA-SOURCES.md)

OpenAI Codex assisted with design, implementation, testing, and documentation.
