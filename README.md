# Singapore Innovation Centre — website

Static website. No server, no build step, no dependencies. Every file here is served to the
browser exactly as written. Hosted on GitHub Pages; pushing to `main` publishes in about a minute.

---

## Adding an event

**Edit the Google Sheet. Nothing else, ever — not this repo, not any code file.**

Events live in a Google Sheet, published to the web as CSV. The site fetches that CSV every time
a page loads and renders whatever rows are in it. `assets/content-config.js` holds the one URL
that connects the two — set once, when the sheet is first published, and never touched again.

The sheet's "Events" tab has one row per event, columns:

| Column | Required | Notes |
|---|---|---|
| `title` | yes | |
| `date_start` | yes | **Exactly `YYYY-MM-DD`, as plain text** — format the column as Plain text before typing dates in, or Sheets may silently reformat them and the row will stop showing up. |
| `date_end` | no | Only for multi-day events. Same format. |
| `topic` | no | `ai`, `blockchain`, `food-health`, comma-separated for several. Purely a tag shown on the card — doesn't route anywhere. |
| `summary` | no | One sentence, shown on the card. |
| `venue` | no | |
| `external_url` | no | An outbound link (e.g. a LinkedIn post). |
| `detail_doc_url` | no | See below. |
| `media_folder_url` | no | See below. |
| `notes` | no | For you — the site never reads this column. |

No ordering column — events always sort by `date_start`, upcoming soonest-first, past
newest-first. No `visible`/`featured` columns either — every row in the sheet shows; delete a
row (or blank its `title`) to take an event off the site.

### Past events: photos, videos, full write-ups

A past event shows a **View recap** button when `detail_doc_url` or `media_folder_url` is
filled in — checked in that order:

1. **`detail_doc_url` set** → embeds it. A Google Doc link shows the full write-up; a plain
   Drive file link (a PDF, one image, a slide deck) shows that file in Drive's own preview
   instead — useful when the "recap" is really just one flyer, not a written article.
2. **No `detail_doc_url`, but `media_folder_url` set** → embeds that Drive folder as a browsable
   photo/video grid. Set the folder to **Anyone with the link can view**. Add or remove files any
   time — the site always shows what's in there right now, nothing to re-publish.
3. **Neither set** → the card just shows title / date / summary. Normal, not an error.

Paste whatever link Google's Share dialog gives you into either column — the site rewrites it
into an embeddable link automatically.

Both links are prepared the same way every time: put the one document and the `img/` folder for
an event under `assets/events/<event>/` locally, upload that whole folder to Drive, then paste
the document's link into `detail_doc_url` and the `img/` folder's link into `media_folder_url`.
See `assets/events/README.md` for the exact steps — that folder is local staging for the Drive
upload only, the deployed site never reads it directly.

### One-time setup (already done once — here for reference)

1. `assets/events/events-template.xlsx` has the current columns and every existing event,
   pre-filled.
2. Upload it to Google Drive, open with Google Sheets, keep it as a Sheet from then on.
3. **File → Share → Publish to web** → pick the **Events** sheet (not "Entire document") →
   format **CSV** → Publish.
4. Paste the URL it gives you into `eventsCsvUrl` in `assets/content-config.js`, commit, done.
   Google republishes that URL automatically within a minute or two of every edit to the sheet —
   this step never needs repeating.

### If the events page ever goes blank

- `eventsCsvUrl` in `assets/content-config.js` is empty, wrong, or the sheet was unpublished —
  check the browser console for `SIC: failed to load events from ...`.
- A `date_start` isn't exactly `YYYY-MM-DD` — that row is silently skipped (see the date-format
  warning above).
- Nothing else can break this — there's no other moving part.

---

## Files

```
index.html          Homepage
about.html          How it all started, milestones, impact, leadership, ecosystem partners
services.html       Business Transformation / Internationalisation / Skills Development / Innovation
events.html         All events, upcoming and past
partners.html       SFAA alliance in detail — the 7 associations, SFU, ministerial patronage
contact.html        Email

assets/styles.css       All styling for every page
assets/site.js          Navigation; fetches, parses and renders events from the CSV
assets/content-config.js   >>> ONE URL — the published Events sheet's CSV link <<<
assets/img/             Favicon, logo
assets/events/          Local staging area for Drive uploads — NOT read by the deployed site,
                        see its own README.md and events-template.xlsx

content/history.md  Source material. Everything on the site traces back to this.
.nojekyll           Tells GitHub Pages to serve files as-is
```

Header and footer markup is repeated in each HTML file. That is the deliberate trade for having
no build step: to change a navigation link, find-and-replace across `*.html`.

---

## Source of truth for site copy

Every factual statement on this site comes from `content/history.md`. That is a deliberate
constraint, not an accident.

**Stated on the site (all from the source document):**

- SFU was developed and launched during Covid-19 by local food manufacturers under SFMA, to
  facilitate buying and selling of food products between members through a digital platform.
- SFU launched in 2020, endorsed by SFMA, patronised by Ms. Low Yen Ling — Minister of State,
  Ministry of Trade and Industry and Ministry of Culture, Community and Youth.
- SFAA MOU signing ceremony, 2022, witnessed by Mr. Gan Kim Yong — Minister for Trade and
  Industry, Guest-of-Honour.
- SIC is set up in line with Budget 2023's Enterprise Innovation Scheme.
- SIC's vision: go-to experts for enterprise excellence; lead in the digital transformation
  roadmap; innovative creation for growth; foster cross-border collaborations.
- SIC manages onboarding more companies to leverage off the SFU platform.
- SIC is supported by SFAA, spearheaded by SFMA and 7 trade associations (named in full on the
  Partners page).
- The partnership fosters stakeholders large, medium, small and micro to work on projects that
  benefit the industry.

- Leadership, Chartered Members, Ecosystem Partners and National Innovation Centre affiliations
  (About page) — from the "LEADERSHIP" / "CHARTERED MEMBERS" / "ECOSYSTEM PARTNERS" sections
  added to `content/history.md`, sourced from `SIC_Website(Content)R.docx`.
- The four service pillars and their line items (Services page) — from the "SERVICES" section of
  `content/history.md`, same source document. Items with no further detail in the source are
  marked **In development** on the site rather than described as active.
- The backfilled past events (Events page) — from the "HISTORICAL EVENTS" section of
  `content/history.md`, each traced to a specific file in SICBizDev. Their actual data now lives
  in the Events Google Sheet (see "Adding an event" above), pre-filled from the same facts.

**Deliberately NOT stated anywhere:** SIC's founding year (the source says "in line with Budget
2023", which is not the same as "founded in 2023"), any office address, phone number, client
name, or case-study detail beyond what the source documents themselves state. Where a source
date is uncertain (a couple of the backfilled events), `content/history.md` says so — treat those
as unconfirmed until checked against the original material.

If you add copy later, add the underlying fact to `content/history.md` first.

---

## Running it locally

```bash
cd path/to/SIC
python3 -m http.server 8000
```

Open <http://localhost:8000>.

---

## Deploying

Configured in `.github/workflows/deploy.yml`. To switch it on the first time:

1. Push this repository to GitHub.
2. **Settings → Pages → Source → GitHub Actions.**

Every push to `main` redeploys.

### Custom domain

1. Create a file named `CNAME` in the repository root containing only the domain, e.g.
   `singaporeinnovationcentre.com`.
2. At the DNS provider, point the domain at GitHub Pages (`A`/`ALIAS` records for the apex
   domain, or a `CNAME` record for a subdomain).
3. **Settings → Pages**, enter the domain, enable **Enforce HTTPS**.

---

## Outstanding

- [ ] Association logos on the homepage and Partners page render as text. To use real logos,
      put the files in `assets/img/` and replace the text inside a `.logo-cell` with
      `<img src="assets/img/sfma.png" alt="SFMA" />`.
- [ ] `assets/content-config.js` → `eventsCsvUrl` is still empty. Until the Events Google Sheet
      exists and is published (see "Adding an event" above), every events list on the site shows
      an empty state — this is the one remaining thing that needs doing before events show at
      all.
- [ ] Three events in `events-template.xlsx` have approximate dates only (see their `notes`
      column, and `content/history.md` → "HISTORICAL EVENTS") — confirm against the original
      material once in the sheet.
- [ ] "Diplomatic Network" in `events-template.xlsx` has a placeholder summary — it's a folder
      Sandy created herself, not sourced from SICBizDev, so there was nothing to write from.
- [ ] No event has a `detail_doc_url` or `media_folder_url` yet — every past card will show text
      only until Drive uploads happen. Material for each is staged in `assets/events/` (see its
      README), ready to upload.
- [ ] Postal address and phone number are not on the site. Add to `contact.html` when available.
- [ ] Services items marked **In development** on `services.html` have a name from the old
      sitemap but no described offering — write real copy (or drop the item) before promoting it
      out of that state.

---

## Changing the look

All colours and spacing are CSS variables in the `:root` block at the top of `assets/styles.css`.
Changing `--navy` and `--accent` re-skins the whole site. Current palette: deep navy `#0f2f4c`,
deep teal accent `#0e7c66`.
