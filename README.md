# Pool Party — RSVP Site

Invitation and RSVP site for two send-off events before a year-long world trip in 2026/27.

## Events

| Event | Date | Location |
|---|---|---|
| Pool party | Saturday 20 June 2026 | 46 Will Tremper Drive, from 3 p.m. |
| Christ Church Spitalfields | Saturday 4 July 2026 | Christ Church Spitalfields |

## Pages

| File | Purpose |
|---|---|
| `index.html` | Pool party invite + RSVP form (main page) |
| `church.html` | Christ Church Spitalfields invite + RSVP form |
| `dashboard.html` | Private RSVP dashboard — shows attendee counts, dietary notes, full guest list |
| `rsvp.html` | Earlier standalone RSVP form (kept for reference) |
| `apps-script.gs` | Google Apps Script backend — receives POST submissions, stores rows in Google Sheets, serves rows as JSON to the dashboard |

## Backend setup

RSVPs are stored in a Google Sheet via Apps Script. The endpoint is already deployed and wired into both invite pages. If you ever need to redeploy from scratch:

1. Create a new Google Sheet named **Pool Party RSVPs**
2. Copy the Sheet ID from the URL (`/d/<ID>/edit`) into `apps-script.gs` → `SHEET_ID`
3. In the sheet go to **Extensions › Apps Script**, paste `apps-script.gs`, then **Deploy › New Deployment** (Web App, execute as Me, access: Anyone)
4. Copy the new Web App URL into the `data-endpoint` attribute in `index.html` and `church.html`, and into the endpoint constant in `dashboard.html`

The script writes pool party RSVPs to a **RSVPs** tab and church RSVPs to a **Church RSVPs** tab in the same spreadsheet.

## What's done

- Pool party invite page with full-colour SVG pool illustration, animated success screen, and working RSVP form
- Christ Church invite page with a period-appropriate architectural illustration and separate RSVP form
- Google Apps Script backend wired up and deployed; both forms POST to the live endpoint
- RSVP dashboard showing attending/declining counts, total guest numbers, dietary breakdown, and a full sortable guest table
- World travels section on both invite pages linking to the 2026/27 itinerary spreadsheet and inviting connections with locals
- Confirmation screens suppress the form title so the success state feels clean

## World travels itinerary

The [itinerary spreadsheet](https://docs.google.com/spreadsheets/d/1j8Ao5ZIeLiOwDhVy41clQuvPzVP3kZSBd9hfgiodgrU/edit?gid=0#gid=0) is linked from both invite pages. An Instagram handle will be added once confirmed.
