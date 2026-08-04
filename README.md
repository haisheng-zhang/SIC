# Singapore Innovation Centre — website

Static website. No server, no build step, no dependencies. Every file here is served to the
browser exactly as written. Hosted on GitHub Pages; pushing to `main` publishes in about a minute.

---

## Adding an event

**Edit one file: `assets/events.js`.** Nothing else, ever.

An event is five fields: a title, a date, a topic, one sentence, and a link out.

```js
{
  title:   "Name of the event",
  date:    "2026-09-18",
  topic:   "ai",
  summary: "One sentence about the event.",
  link:    "https://the-external-page.com"
},
```

### Step by step

1. Open `assets/events.js`.
2. Copy the block above (it is also in the comment at the top of that file).
3. Paste it inside the `window.sicEvents = [ ... ]` list.
4. Fill in the five fields.
5. Save and commit.

### An event covering several areas

Many events span more than one focus area. Separate the topics with a comma — order does not
matter and spaces are fine:

```js
topic: "ai, blockchain"
```

The event then appears on **both** the AI page and the Blockchain page, and shows a tag for
each. It still counts as one event everywhere else (homepage, Events page), so it is listed
once, not twice.

**Never duplicate an event to cover two areas.** One entry with two topics is correct; two
entries with one topic each will show up as two separate events on the homepage and the
Events page.

### What happens by itself

- A **future** date shows under **Upcoming**, soonest first.
- A **past** date moves itself to **Past**, newest first.
- The **homepage** shows the next 3 upcoming events.
- The **AI / Blockchain / Food & Health** pages each show only their own topic.

You never move or delete an event. Old events look after themselves.

### The three rules

| Rule | Why |
|---|---|
| Every topic must be `ai`, `blockchain` or `food-health` | It decides which focus pages the event appears on. Use commas for several. An unrecognised name is silently ignored — if a tag goes missing, check the spelling. |
| `date` must be exactly `YYYY-MM-DD` | It drives upcoming/past sorting. |
| Every value in `"double quotes"`, every block ends with `},` | It is a JavaScript file. |

If the event lists ever go blank, a missing comma or quote in the last edit is why.

### Removing an event

Delete its block including the trailing comma. Normally unnecessary — past events move
themselves to the Past section.

### Editing from the browser

A colleague with write access can publish without any local setup: open `assets/events.js`
on GitHub, click the pencil icon, paste the block, click **Commit changes**. No CMS, no OAuth,
no extra login.

### Currently in the file

One real event — the Agentic Decentralized Finance Executive Forum and Media Session
(6 Aug 2026), tagged `"ai, blockchain"` so it appears on both focus pages. The Food & Health
page has no events yet and shows an empty state.

---

## Files

```
index.html          Homepage
about.html          How it all started, milestones
ai.html             Focus area — Artificial Intelligence (+ its events)
blockchain.html     Focus area — Blockchain & DeFi (+ its events)
food-health.html    Focus area — Food & Health (+ its events)
events.html         All events, upcoming and past
partners.html       SFAA alliance, the associations, SFU
contact.html        Email

assets/styles.css   All styling for every page
assets/site.js      Navigation, event rendering
assets/events.js    >>> EVENT DATA — the only file you edit <<<
assets/img/         Favicon; put images here

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

**Deliberately NOT stated anywhere:** SIC's founding year (the source says "in line with Budget
2023", which is not the same as "founded in 2023"), any service offering, methodology, team
member, office address, phone number, client, case study, or capability in AI, blockchain or
food-health beyond naming them as focus areas.

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
- [ ] No photographs anywhere. Event and ceremony photos would strengthen the site.
- [ ] Postal address and phone number are not on the site. Add to `contact.html` when available.

---

## Changing the look

All colours and spacing are CSS variables in the `:root` block at the top of `assets/styles.css`.
Changing `--navy` and `--accent` re-skins the whole site. Current palette: deep navy `#0f2f4c`,
deep teal accent `#0e7c66`.
