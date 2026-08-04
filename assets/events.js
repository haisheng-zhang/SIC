/* ==========================================================================
   SIC — EVENTS
   This is the ONLY file you edit to publish an event.

   An event is just: a title, a date, a topic, one sentence, and a link out.

   ── TO ADD AN EVENT ──────────────────────────────────────────────────────
   Copy this block, paste it into the list below, fill in the five fields:

     {
       title:   "Name of the event",
       date:    "2026-09-18",     // always YYYY-MM-DD
       topic:   "ai",             // ai | blockchain | food-health
       summary: "One sentence about the event.",
       link:    "https://the-external-page.com"
     },

   Save. Commit. The site updates in about a minute.

   ── AN EVENT CAN COVER SEVERAL AREAS ─────────────────────────────────────
   Separate the topics with a comma. Order does not matter, spaces are fine:

       topic: "ai, blockchain"

   The event then appears on BOTH the AI page and the Blockchain page, and
   shows a tag for each. Never duplicate an event to cover two areas — one
   entry with two topics is correct, two entries is not.

   ── WHAT HAPPENS AUTOMATICALLY ───────────────────────────────────────────
   • A future date  -> shows under "Upcoming", soonest first.
   • A past date    -> moves itself to "Past", newest first.
   • The homepage shows the next 3 upcoming events.
   • The AI / Blockchain / Food & Health pages each show their own topic.
   You never move or delete anything. Old events look after themselves.

   ── RULES ────────────────────────────────────────────────────────────────
   • every topic must be one of: ai, blockchain, food-health
     (an unrecognised name is ignored — check spelling if a tag goes missing)
   • date must be exactly YYYY-MM-DD
   • every field is wrapped in "double quotes"
   • every event block ends with a comma after its closing brace }
   If the event lists ever go blank, a missing comma or quote is why.

   ── TO REMOVE AN EVENT ───────────────────────────────────────────────────
   Delete its block, including the closing comma. (You normally don't need
   to — past events move to the "Past" section on their own.)
   ========================================================================== */

window.sicEvents = [
  {
    title:   "Agentic Decentralized Finance Executive Forum and Media Session",
    date:    "2026-08-06",
    topic:   "ai, blockchain",
    summary: "Held within SMEICC - Singapore's largest bilingual business conference organised by the Singapore Chinese Chamber of Commerce and Industry (SCCCI).",
    link:    "https://www.linkedin.com/posts/singaporeinnovationcentre_agentic-decentralized-finance-executive-forum-activity-7488907143849340928-E_ZX/?utm_source=share&utm_medium=member_ios&rcm=ACoAAATq71YB6-JAqj7KgeOZ_EzZuq9md5cTRCY"
  }
];
