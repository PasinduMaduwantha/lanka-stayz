# Lanka Stayz Development Summary

I designed the prototype around a traveller’s decision process. The homepage introduces six sample stays, the search and filters narrow the options, and property galleries and amenities help visitors decide before opening the booking form. The original SVG logo, credited Sri Lankan photography and responsive layout give the site a consistent visual identity across desktop, tablet and phone.

## Implementation decisions

- **One catalogue for every view.** Typed property data drives the featured stays, search results, detail pages and comparison. Reusable React components keep prices, capacity and controls consistent. Direct links open property details on the static deployment.
- **Business rules outside the interface.** Separate filtering and validation functions make the rules easy to test. The booking form checks contact details, calendar dates and guest capacity, then shows a clear demo confirmation and a total based on the nightly rate and number of nights.
- **Scope matched to the brief.** The assessment called for a sample booking request. The app validates it in the browser and runs on a static Vercel deployment that reviewers can access without an account. Live inventory, payments and persistent reservations are planned for a commercial release.
- **Verification.** The local suite passed 97 automated tests covering catalogue rules, date and contact validation, booking interactions and assets. Chromium checks covered the main booking flow and five viewport widths from 320px to 1440px. [Test notes](TESTING.md)

## Additional features

Visitors can save stays and compare up to three properties by price, capacity and amenities. Budget, property type and facility filters make the search more useful. The separate Host Studio demonstrates listing drafts, local photo previews and accepting or declining demo requests. Drafts and request statuses are kept for the current session. The host prototype does not publish listings or provide Google sign-in.

## Commercial next steps

1. **Live inventory and reservations.** Add an API and relational database for properties, units, rates and bookings. Recheck dates, capacity and price on the server. Use a database transaction to prevent double bookings and make retries safe.
2. **Owner tools.** Add Google sign-in, server-side ownership checks, persistent drafts and photo storage. Define a review process before listings go public.
3. **Booking operations.** Add guest notifications, cancellation policies and provider-hosted payments. Extend monitoring and browser tests to cover the full reservation flow.
