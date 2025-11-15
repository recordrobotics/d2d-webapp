**Door 2 Door (D2D)** is a lightweight, offline‑first web app by Record Robotics for tracking donations during door‑to‑door fundraising. It lets students capture donation details on the spot, totals everything locally, and syncs to a shared Google Sheet for coaches and admins.

## Overview

- Purpose: Simple, reliable donation tracking for fundraising door to door.
- Offline‑first: Works fully without internet; data is stored locally and can be published later.
- Sync: Push/pull donations to/from a Google Sheet using a service account.
- PWA: Installable on phones/tablets as an app for increased ease of use.

## Key Features

- Donation capture: Street address, amount, donor name/email, payment type (cash/check/PayPal), optional notes.
- Smart defaults: Remembers street/city to speed up repeated entries.
- Swipe actions: Swipe to delete with confirmation.
- Totals & status: Shows running total and helpful tips for faster entry.
- Team sync: One‑click “Publish Donations” (push) or “Fetch Donations” (pull) to stay in sync.
- Name & conflict handling: Onboarding collects your name and handles name changes or conflicts on sync.
- Rate limiting: Server API limits bursts to reduce abuse (5 requests/min/IP by default).

## Tech Stack

- Next.js 16 (App Router) + React 19
- Material UI (MUI)
- IndexedDB via Dexie (local offline storage)
- Google Sheets API via `google-spreadsheet` + `google-auth-library`
- Service worker via `@serwist/next` (PWA)
- i18n scaffolding via `next-intl`

## Project Structure

```text
src/
  app/
    page.tsx               # Home: totals, list, publish/fetch
    donation/              # Add/edit flows and form UI
    onboarding/            # Name setup, multi-device guidance, offline page
    settings/              # User status and sign-out
    api/
      donations/route.ts   # Sync push/pull with Google Sheets
      checkUser/route.ts   # Check if a username already exists on the sheet
      sheets.ts            # Google Sheets connection + rate limiting
    sw.ts                  # Service worker setup (Serwist)
    manifest.ts            # PWA manifest
  lib/
    donation.ts            # Dexie DB schema + types
public/
  sw.js                    # Built service worker output
```

## Prerequisites

- Node.js 18.18+ (LTS recommended) and npm
- A Google Cloud service account with access to the Google Sheet

## Google Sheets Setup

The app syncs donations to a Google Sheet using a service account. You’ll need:

- A spreadsheet with two tabs (auto‑created if missing): `donations` and `userUpdates`.
- A service account JSON (email + private key) and the Sheet ID.
- The Sheet must be shared with the service account’s email.

Local configuration in this repo uses a JSON file imported by `src/app/api/sheets.ts`:

- Place your credentials JSON in `src/app/api/.config/`.
- Either rename your file to match the existing import or update the import path in `src/app/api/sheets.ts` to your filename.
- The JSON should include: `client_email`, `private_key`, and `sheet_id`.

Important: Do not commit secrets. Keep the JSON out of version control or manage credentials via your hosting platform’s secret store and adjust `sheets.ts` accordingly.

## Getting Started (Development)

Install dependencies:

```pwsh
npm install
```

Run the development server:

```pwsh
npm run dev
```

Open `http://localhost:3000` in your browser.

Lint the project:

```pwsh
npm run lint
```

Create a production build and run it locally:

```pwsh
npm run build
npm run start
```

Notes for local development:

- Without valid Google credentials in `src/app/api/.config/`, API routes will fail. You can still test the offline UX (adding/editing/deleting donations) since it uses local IndexedDB.
- Install to your device from the browser’s “Install App” prompt to test the PWA flow and offline behavior.

## How Sync Works

- Publish: Pushes your local donations to the `donations` sheet and updates your last sync time in `userUpdates`.
- Fetch: Pulls donations for your name from the sheet when the server’s last update is newer.
- Name changes: If you update your name, the server will migrate your rows and keep times consistent.
- Limits: The API enforces a rate limit (default 5 requests/min/IP).
