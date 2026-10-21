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
