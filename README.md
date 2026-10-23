# Dr. Mimi Ijaz’s Residency Countdown

A small love letter disguised as a countdown: pastel colors, an interactive doctor bunny, and an automatic celebration. No dependencies, build step, external requests, or tracking.

[View the live countdown](https://devness-portfolio.github.io/dr-mimi-ijaz-residency-countdown-calendar/)

## Preview

The website, native companions, and widgets share the same offline-first countdown experience.

### GitHub Pages website

![Desktop view of the residency countdown website](screenshots/github-page.png)

### Native macOS and iOS apps

| macOS companion | iPhone companion |
| --- | --- |
| ![The desktop-sized countdown experience used by the macOS app](screenshots/macos-app.png) | ![The phone-sized countdown experience used by the iOS app](screenshots/ios-app.png) |

Both native apps present the bundled website in an offline `WKWebView`, so the countdown, celebration screen, and interactive doctor bunny stay consistent with GitHub Pages.

### Widgets

![Design mockup of the iOS, macOS, and Scriptable residency widgets with the doctor bunny](screenshots/widget-mockup.png)

*Concept mockup — not a device capture.* The WidgetKit and Scriptable versions rotate static doctor bunny poses on system refresh; opening either takes you to the full live countdown.

## Run locally

Open `index.html` directly, or run `python3 -m http.server 8000` in this directory and visit `http://localhost:8000`.

## Files

- `index.html` — countdown and celebration markup
- `css/styles.css` — responsive styling and reduced-motion support
- `js/countdown.js` — date configuration, calculations, rendering, confetti
- `js/doctor-bunny.js` — shared native/web animation and tap routine
- `assets/bunny.svg` — original lightweight doctor bunny illustration
- `AGENTS.md` — project guidelines

## Dates and behavior

The two constants at the top of `js/countdown.js` configure July 1, 2022 through July 1, 2027, both at **midnight in the visitor’s local timezone**. Each visitor celebrates at their local midnight; this is intentionally not one simultaneous worldwide instant. JavaScript date constructors use zero-based month 6 for July.

The large number is remaining milliseconds divided by 24 hours, rounded up. The detail uses whole calendar months added to the current local date (clamped to the last day of the destination month), followed by weeks, days, hours, minutes, and seconds from the remaining elapsed duration. Weeks are seven 24-hour days; daylight-saving changes can affect the elapsed remainder. Values update every second and on returning to the tab. All values stay nonnegative.

Progress is elapsed time divided by the entire residency duration, clamped to 0–100%. The displayed percentage rounds down to one decimal place so it never says 100% before completion.

At the first update on or after completion, including a fresh page load, the countdown is replaced by the celebration, personal message, and Arabic-first Quranic verse. Confetti is restricted to the top of the card, away from the verse, and disabled for reduced-motion preferences. No deployment is needed on completion day.

For development, temporarily set `RESIDENCY_END` to a near-future or past date, then reload. Restore `new Date(2027, 6, 1, 0, 0, 0)` before publishing.

## Doctor bunny

Click, tap, or keyboard-activate the bunny to play the next activity and show a new message. Twelve distinct actions cycle through jumping, waving, heartbeat check, notes, reading, eating, sipping tea, stretching, napping, sipping coffee, celebration, and a hot-drink mishap. Tea has a pink cup with a tea tag; coffee has a tan cup and darker drink. Both lift to the mouth for a sip. The separate hot-cup scene includes a surprised face, one tear, tongue out, a fanning paw, and recovery, with unrelated celebration and jumping actions on either side.

Activity-specific reminders stay paired with their actions (including tea, coffee, snacks, stretching, and sleep). Other actions mix fitting messages with affectionate affirmations and gentle doctor puns. Resting pauses show general encouragement instead of carrying over a drink or sleep reminder. Each action runs for 5.5 seconds; leaving it alone resumes automatic rotation with 8.5-second resting pauses. Rapid taps replace the current activity without stacking timers. Completion keeps the congratulatory message, while taps still explore the activities.

Reduced Motion shows changing still poses. Animation pauses while the page is hidden or the native app is inactive. The original SVG remains a fallback if canvas is unavailable. The same script is bundled into both native apps; its initialization guard prevents duplicate companions when native injection and the page both load it.

## Deploy with GitHub Pages

1. Create a GitHub repository and upload these files with `index.html` at its root.
2. Open the repository’s **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select **main** and **/ (root)**, then click **Save**.
5. Wait for deployment, then open the site link shown on the Pages screen.

All asset paths are relative, so repository subpaths work. No custom build workflow is required.

### Halloween and fall 2026

The seasonal design runs from October 1 through Thanksgiving Day, November 26, 2026, in the device's local timezone. October includes a lavender witch hat, friendly ghosts/bat, and Halloween puns. November switches to a warm fall palette, scarf, and fall puns. The standard design returns at midnight November 27; residency completion always takes priority. Production residency dates are unchanged.

Tap the website bunny to cycle through catching a red leaf, sipping coffee in a scarf, gathering leaves, hugging a pumpkin, and familiar doctor activities. Automatic activities continue between resting pauses. Reduced Motion uses still poses. Seasonal encouragement rotates in the banner every 14 seconds and with bunny activities; Halloween wording stops November 1. Apple and Scriptable widgets show matching seasonal poses and puns at half-hour refreshes. Widget delivery timing is controlled by the OS.

The website checks the season every countdown tick and on returning to the page. No new dependencies, downloads, or animation loops are required. Rebuild/reinstall the Apple app/widget, or replace the script in Scriptable, to receive these changes.

Seasonal checks: run `node tests/seasonal.cjs`, `node apple/Tests/scriptable.cjs`, and the Foundation checks in `apple/README.md`. They cover the Halloween/fall/Thanksgiving boundaries, rotating puns, seasonal drawings, tap activity cycling, reduced motion, and completion precedence.

### New Year 2027 theme

December 25–31, 2026 uses pearl, lavender, and champagne styling. January 1, 2027 adds “Hello, 2027” and a graduation-year greeting with continuously looping decorative sparkles (still for Reduced Motion). The standard design returns January 2 at local midnight. The residency countdown continues throughout; graduation celebration still takes precedence on July 1, 2027. All dates use the device’s local timezone.

Tap the party-hat doctor bunny to cycle through three paired scenes:

| Activity | Pun | Affirmation |
| --- | --- | --- |
| Watching fireworks | You’re the spark of my year. | You make the future look bright, meri jaan. |
| Ringing a bell | Ring in the year. You’ve already won my heart. | Every little victory deserves to be celebrated. |
| Opening a wish card | My New Year’s resolution? More you. | Your next chapter is worth believing in, Dr. Mimi. |

Website and offline apps share the interactive scenes. Native and Scriptable widgets use matching still poses, alternating with rest at half-hour slots; the OS controls delivery. Reduced Motion keeps still artwork and disables sparkle animation. Rebuild the apps/widgets and replace the installed Scriptable script to receive these changes.

For local browser review, serve the repository and open `http://127.0.0.1:8088/?preview=nye` (starts ten seconds before midnight and rolls into January 1) or `http://127.0.0.1:8088/?preview=newyear` (January 1 at noon). Preview links work only on localhost/127.0.0.1, advance with elapsed time, and never change the production milestone configuration. The hosted site always uses the real date.

New Year validation includes Christmas activation, midnight rollover, January 2 expiry, three paired scenes, Scriptable drawings and date parity, native scheduling in four timezones, countdown boundaries, and completion precedence. Native UI layout and real widget refresh delivery require Xcode/device verification.

### Mardi Gras 2027 theme

Carnival styling runs January 6 through February 9, 2027, inclusive, in the device’s local timezone, returning to the standard design at midnight February 10. Dates follow the [official New Orleans visitor guide](https://www.neworleans.com/events/holidays-seasonal/mardi-gras/). Residency completion retains priority. Later seasonal additions may take priority where their dates overlap.

Soft purple, sage, and gold details surround the countdown. The doctor bunny wears a small crown and beads, and cycles through three scenes:

| Activity | Pun | Affirmation |
| --- | --- | --- |
| Enjoying crawfish | You’re craw-some, Dr. Mimi. | Even on the hard days, you bring so much heart. |
| Catching beads | I bead-lieve in you, meri jaan. | Every small win belongs in your parade. |
| Enjoying king cake | You take the cake, my queen. | You deserve a little sweetness between rounds. |

The website and offline apps share animated activities; Reduced Motion uses still poses. Native and Scriptable widgets use matching still artwork and half-hour activity/rest slots, subject to OS refresh delivery. Rebuild the apps/widgets and replace the installed Scriptable script to receive updates.

Local preview: `http://127.0.0.1:8088/?preview=mardi` shows February 6 at noon without changing production dates. The same seasonal test commands above cover activation/expiry, all three scenes and messages, Scriptable drawings/date parity, native timezone boundaries, and existing theme regressions. Native UI layout still requires Xcode/device verification.

## Ramadan 2027 preview

The Ramadan theme uses expected civil dates **February 8–March 8, 2027**, with an exclusive end of March 9 at device-local midnight, matching the [SALAM Islamic Center calendar](https://salamcenter.org/ramadan-2027/). Dates remain provisional pending moon sighting. This decorative theme does not calculate prayer or fasting times. Ramadan takes precedence over Mardi Gras on February 8–9; Carnival remains scheduled January 6–February 9 beneath that precedence.

Open `http://127.0.0.1:8088/?preview=ramadan` locally to review the moonlit blue, cream, and muted gold palette. Hosted and bundled apps continue to use the real device date. The greeting, crescent, prayer mat, activities, and paired encouragements are included in the website/app resources, Swift widgets, and standalone Scriptable script.

| Activity | Pun | Affirmation |
| --- | --- | --- |
| Quiet dua on a prayer mat | You’re my favorite prayer-tner. | May your quiet moments bring peace to your busy days. |
| Dates ready for iftar | My favorite date is iftar with you. | You deserve sweetness, nourishment, and a gentle evening. |
| Resting patiently while fasting | Running on empty, still full of heart. | Take it one moment at a time, meri jaan. Your effort matters. |

Reduced motion keeps every scene available as a static pose. Native widget poses follow the existing half-hour timeline with resting intervals; their delivery is controlled by the OS. Rebuild native apps/widgets and replace the installed Scriptable script to receive these changes. JavaScript and Scriptable regression checks and Swift Foundation logic tests cover the new season; native visual verification still requires Xcode/device testing.

## Beach 2027 preview

Beach runs April 1–30, 2027 in the device's local timezone, interpreting April–May as the interval before the May–June DMV theme. Production residency dates remain unchanged.

Open `http://127.0.0.1:8088/?preview=beach` locally. Tap the bunny to cycle the three scenes. This preview uses a ticking April 15 clock only on localhost; deployed dates remain automatic.

| Activity | Pun | Affirmation |
| --- | --- | --- |
| Build a sandcastle | You’re sand-sational, Dr. Mimi. | Every small step is building your beautiful next chapter. |
| Collect a seashell | Shell yeah, I believe in you. | Your kindness leaves something lovely wherever you go. |
| Read at the beach | You deserve a shore break, meri jaan. | Rest belongs in your story, too. Take a little time for yourself. |

The website and bundled offline app share the seafoam, cream, and sand palette and vector companion. Swift widgets and Scriptable include corresponding artwork, paired encouragement, and resting intervals. Existing reduced-motion support keeps poses static. Rebuild native apps/widgets and reinstall the Scriptable script to receive changes; native visuals require device or Xcode verification.

## DMV 2027 preview

The DC, Maryland and Virginia theme runs May 1–June 30, 2027 in the device’s local timezone. July 1 automatically becomes the residency celebration. Open `http://127.0.0.1:8088/?preview=dmv` locally and tap the bunny to cycle three scenes, using a ticking May 15 preview clock.

| Activity | Pun | Affirmation |
| --- | --- | --- |
| DC museum visit | You’re a national treasure, Dr. Mimi. | Your curiosity and care make the world a brighter place. |
| Maryland blue crab | You’re claw-some, hon. | Even when the day gets crabby, your kindness shines through. |
| Virginia trail walk | Virginia is for lovers. I’m here for you. | One step at a time, meri jaan. You are so close to your next adventure. |

Website and bundled app share the interactive artwork. Native widgets and Scriptable rotate the matching poses and messages on their existing refresh schedules. Rebuild the native targets or replace the Scriptable script to receive these changes; native visual verification requires an Apple device or Xcode.
