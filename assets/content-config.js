/* ==========================================================================
   SIC — CONTENT CONFIG
   One line. Set once when the Google Sheet exists, then never touched again.

   How to get the URL:
   1. Open the Events sheet in Google Sheets (upload events-template.xlsx to
      Drive, open with Sheets, or work directly in Sheets from the start).
   2. File -> Share -> Publish to web.
   3. Pick the "Events" sheet (not "Entire document"), format: CSV.
   4. Publish. Copy the URL it gives you and paste it below.

   That URL stays valid even after you keep editing the sheet — Google
   republishes it automatically within a minute or two of every edit.
   Nothing here ever needs to change again once it's set.
   ========================================================================== */

window.sicContentConfig = {
  eventsCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQJsVVam91_oPz5K5ToYhDjyBjcB6VHS9UxkC62kMp8W9gNTIwOFiM89vu9mOsVHx93acQIuVreq0FV/pub?gid=1813862662&single=true&output=csv"
};
