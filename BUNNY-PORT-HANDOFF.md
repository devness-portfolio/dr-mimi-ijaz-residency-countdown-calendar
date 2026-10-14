# Handoff: doctor bunny for Scriptable and GitHub Pages

> Implementation update: the web/native companion now lives in `js/doctor-bunny.js`; both platforms use it. Taps advance through the activity sequence for 5.5 seconds instead of the old 2.2-second `react` state. Scriptable now opens the interactive website when run in-app as well as on widget tap; its Home Screen artwork remains static. The Scriptable pose port is now implemented: all sizes use bunny-left countdown layout, ten action poses alternate with rest at half-hour slots, medium/large show encouragement, and refresh requests include pose/day/detail boundaries. Completion uses a steady celebration pose. Node API mocks verify execution and scheduling; real iPhone/Mac widget layout and refresh delivery remain unverified. The detailed instructions below record the original plan. Native builds and local browser tests do not imply installation or GitHub Pages deployment.

## Objective and scope

Port the approved doctor bunny companion from the existing iOS/macOS implementation to:

1. The Scriptable script at `apple/Scriptable/Residency Countdown.js`.
2. The GitHub Pages website served from the repository root.

Use the **existing kawaii doctor bunny**, not the earlier bear concept. Preserve layout A: the bunny sits **beside the countdown**, on the left, including phone layouts. Keep all agreed activities, resting pauses, warm encouragement, and playful doctor humor, adapting behavior to each platform’s capabilities.

This document is an implementation handoff. Its creation did not change Scriptable, the website, or the deployment. The native app work exists locally; do not assume it has been committed, pushed, installed on devices, or published. Inspect the working tree before starting and preserve existing changes.

## Project and source map

Local checkout:

```text
/Users/devness/Documents/ChatGPT/dr-mimi-ijaz-residency-countdown-calendar
```

The task originally referenced a folder with spaces. The actual checkout now has the hyphenated name above; tools and write permissions may still reference the old path.

Repository: [dr-mimi-ijaz-residency-countdown-calendar](https://github.com/devness-portfolio/dr-mimi-ijaz-residency-countdown-calendar)

Website URL configured in the project: [Dr. Mimi Ijaz’s Residency Countdown](https://devness-portfolio.github.io/dr-mimi-ijaz-residency-countdown-calendar/). The deployed contents were not re-audited for this handoff.

| File | Role |
| --- | --- |
| `AGENTS.md` | Project requirements: static site, no emoji, accessibility, date behavior, testing. Read first. |
| `assets/bunny.svg` | Original character identity and vector geometry. Preserve it as the reference and fallback. |
| `js/doctor-bunny.js` | Shared browser-compatible animation, drawing, message, interaction, and lifecycle implementation. Primary porting source. |
| `apple/App/ResidencyApp.swift` | Loads the bundled website in WKWebView and injects the bunny script into both apps. Sends the `bunny-app-active` lifecycle event. |
| `apple/Shared/CountdownCard.swift` | `DoctorBunny` native vector drawing and approved side-by-side widget arrangement. |
| `apple/Shared/Residency.swift` | `BunnyActivity`, pose selection, encouragement, and native widget refresh scheduling. |
| `apple/Widget/ResidencyWidget.swift` | Native widget timeline integration; reference only for this port. |
| `apple/Scriptable/Residency Countdown.js` | Target Scriptable file. Already contains a static `doctorBunny()` vector renderer, timer, progress, and detail tiles. |
| `apple/Scriptable/README.md` | Current import/install instructions and platform limitations. Update after implementation. |
| `index.html` | Target website’s countdown/celebration markup; currently has static bunny images. |
| `css/styles.css` | Website styling and reduced-motion rules. |
| `js/countdown.js` | Website date configuration, countdown calculations, completion transition, and confetti. |
| `README.md`, `apple/README.md` | Website and native documentation; update descriptions if asset integration changes. |

The native app loads the **local bundled page**, not the hosted URL. Both app targets bundle root website resources, plus the separately injected bunny script. The hosted website does not yet load that animation script.

## Approved appearance and behavior

Match the original bunny: cream fur, long pink-lined ears, tiny dark eyes, pink cheeks, small smiling mouth, the little pink heart on its head, white coat, lavender details, and a stethoscope. The current app drawing reuses the original SVG’s ear, head, face, and heart-detail paths. Keep enough drawing space for long ears during jumps and naps; the app canvas is 360 × 440 backing pixels for a 180 × 220 logical drawing.

Use the existing palette: cream `#fff9ee`, outline `#886a76`, blush `#f3c0cf`, inner ears `#efbfd0`, lavender `#e1dcec`, accent pink `#bd678d`, and page background `#fff8f3`. The countdown remains visually dominant.

| Activity | Website/full animated experience | Scriptable Home Screen pose |
| --- | --- | --- |
| Happy jumps | Small vertical hops with ear movement | Raised jumping pose |
| Waving | Paw waves | Raised waving paw |
| Heartbeat check | Stethoscope chestpiece against its own chest; little heart pulses nearby | Chestpiece held to chest with heart motif |
| Taking notes | Writes on a tiny clipboard | Clipboard and pencil |
| Reading | Medical book with page movement | Open medical book |
| Eating | Snack near its mouth, little chewing movements | Snack and small bite detail |
| Tea | Lifts a mug with a light steam movement | Mug and steam marks |
| Stretching | Paws rise and stretch gently | Raised stretching paws |
| Napping | Closed eyes, gentle breathing, floating Z/z lettering | Sleeping face and Z/z lettering |
| Resting | Quiet blinking/breathing with small ear motion | Relaxed neutral pose |
| Celebration | Hops, hearts, and small confetti accents | Celebratory pose and hearts |
| Encouragement | Occasional automatic message, mixing sweetness and doctor humor | Short message selected at refresh |
| Tap reaction | Brief happy reaction plus a new message | Opens the full website for interaction |

The last two rows are behaviors, rather than separate entries in the normal activity rotation. There are ten action names, plus rest and the temporary `react` state.

### Exact baseline timing

The app’s normal sequence is:

```text
rest → jump → rest → wave → rest → heartbeat → rest → notes → rest
→ read → rest → eat → rest → tea → rest → stretch → rest → nap
→ rest → celebrate → repeat
```

- Initial rest: 7 seconds.
- Each regular activity: 5.5 seconds.
- Rest between activities: 8.5 seconds.
- Tap reaction: 2.2 seconds, then rest; repeated taps replace the pending reaction timer.
- Automatic encouragement advances every third regular activity. The selected message stays visible until replaced.
- Taps advance encouragement immediately and announce it through a polite status region. Automatic messages do not repeatedly interrupt screen readers.
- Background/inactive state stops pending animation and activity timers. On return, resume from rest with a 7-second delay.
- Reduced Motion keeps static poses, activities, and messages, but disables frame animation.

Messages currently implemented:

- One day at a time, meri jaan.
- You make a difference, Dr. Mimi.
- Prescription: a snack and a little self-kindness.
- Your kindness is part of the treatment.
- A little rest is part of the treatment.
- So proud of you. Always.
- Doctor’s orders: a tiny tea break.
- One day closer to your next chapter.

Milestone days: **100, 30, 7, and 1 days remaining**, using the existing rounded-up day count. The current script announces the first qualifying milestone encountered in a page session with “Another beautiful milestone, Dr. Mimi!” and celebrates. It uses one session boolean; it does not persist acknowledgments or track multiple different milestones in a single long-running session. For a robust web port, track the last celebrated milestone day in memory so the once-per-second countdown updates cannot repeatedly restart the reaction, while a later distinct milestone can still be celebrated. No storage is required.

At residency completion, move the same bunny into the celebration art area and show “You did it, Dr. Mimi. So proud of you!” It alternates celebration and rest thereafter. Preserve the verse and personal celebration text.

## Track 1: GitHub Pages website

### Recommended implementation

1. Read `AGENTS.md` and inspect current changes. Reuse `apple/App/doctor-bunny.js`; do not recreate the approved behavior from scratch.
2. Put the browser script at a normal site asset path, such as `js/doctor-bunny.js`. Load it with `defer` after `js/countdown.js`. Keep relative paths so the repository subpath and local offline files work.
3. Transfer the script’s scoped styles into `css/styles.css`, or initially retain its self-contained style injection. Do not keep two competing copies of the same styles.
4. Use the existing `#countdown .hero` as the side-by-side container. The source script prepends `#doctor-bunny`, hides the nearby decorative spark/heart, adds `#bunny-message` below the hero, and suppresses the old encouragement image to avoid a duplicate character.
5. Preserve the source’s real button, keyboard behavior, visible focus ring, accessible label, polite tap-message status, reduced-motion handling, and page-visibility lifecycle. Canvas decoration is hidden from screen readers; the button identifies the companion.
6. Use `js/countdown.js` as the sole website authority for dates and remaining time. Never introduce another completion date into the companion script. Prefer a small explicit update hook for milestone/completion state over a broad DOM observer if changing the countdown integration; otherwise test the existing observer carefully.
7. Retain the static `assets/bunny.svg` image as the no-JavaScript/error fallback. The fallback must remain visible if canvas/context initialization fails. Remove or hide it only after successful companion initialization.
8. Reserve enough message space to avoid layout jumps. Keep the bunny beside the number at 320px and 390px, with readable countdown text and no clipped ears, paws, props, or tap targets.
9. On completion, reuse one bunny instance in `.celebration-art`; do not leave an active hidden copy running in the countdown section. Keep confetti and character art away from the Arabic verse.

### Avoid duplicate startup in the native apps

The apps already inject `apple/App/doctor-bunny.js` at document end. Adding the same behavior to `index.html` means a rebuilt app can encounter both scripts.

For a minimal website port, leave the native integration intact and keep the existing initialization guard:

```js
if (document.getElementById('doctor-bunny')) return;
```

Verify there is exactly one button, message region, listener set, and animation/activity loop regardless of load order. Native injection and the website copy must remain compatible, including the `bunny-app-active` custom event. Document the two copies if retaining them.

A later consolidation can make `js/doctor-bunny.js` the single shared source and remove native injection plus the obsolete separately bundled script reference. That requires deliberate edits to the Swift loader and Xcode resource entries, followed by both app builds. Do not delete the native source as an incidental cleanup before the replacement works. Avoid architectural refactoring unrelated to this port.

## Track 2: Scriptable JavaScript

### Platform contract

Implement **changing static poses and messages** on the Home Screen, with a tap opening the fully animated website. A Scriptable `ListWidget` is a periodically rendered widget, not a browser animation surface. Its refresh timing is controlled by iOS, and `refreshAfterDate` is only an earliest requested refresh time. Do not promise 5.5-second animation loops or exact pose changes there. [Scriptable ListWidget documentation](https://docs.scriptable.app/listwidget/)

`DrawContext` renders the pose to an image. Keep drawing local and self-contained rather than downloading artwork or loading a browser just to render widget frames. [Scriptable DrawContext documentation](https://docs.scriptable.app/drawcontext/)

Small widgets have a single widget-level tap target. Keep the existing website URL as the default destination; reactions happen after opening the site. [Scriptable WidgetImage documentation](https://docs.scriptable.app/widgetimage/)

### Current script behavior to preserve

- Self-contained file, no external dependencies, no companion image files or image downloads.
- Original SVG geometry is already translated into `DrawContext`/`Path` commands in `doctorBunny()`.
- Medium/large widgets currently put a static bunny on the right of the countdown. Small widgets currently omit it.
- All countdown sizes have the native `WidgetDate.applyTimerStyle()` countdown, progress, and percentage.
- Large widgets have all six component tiles and an “as of” timestamp. Those custom values are snapshots, not per-second animated text.
- Large widgets currently request refresh after 15 minutes or the next rounded-up day-count change, whichever comes first. Other sizes currently request the next day-count change.
- The existing celebration and Arabic-first verse on medium/large sizes must remain readable.

### Implementation steps

1. Extend `doctorBunny()` to accept an activity name and draw a corresponding pose, retaining its existing geometry and palette. Use the native `DoctorBunny` and browser `draw()` implementations as references for props and expression changes. Do not paste DOM, `Path2D`, canvas, `requestAnimationFrame`, or browser event code directly into Scriptable’s widget runtime.
2. Add a deterministic `activityForDate(now, complete)` function. A half-hour schedule can match native widgets: even half-hour slots rest, odd slots cycle through the ten actions. Completion overrides selection with `celebrate`.
3. Use explicit millisecond arithmetic in JavaScript; Swift’s reference uses seconds:

```js
const actions = ['jump', 'wave', 'heartbeat', 'notes', 'read',
  'eat', 'tea', 'stretch', 'nap', 'celebrate'];
function activityForDate(now, complete) {
  if (complete) return 'celebrate';
  const slot = Math.floor(now.getTime() / (30 * 60 * 1000));
  if (slot % 2 === 0) return 'rest';
  const index = Math.floor(slot / 2);
  return actions[((index % actions.length) + actions.length) % actions.length];
}
```

4. Change the hero stack to bunny-left/countdown-right. Include a compact bunny on small widgets, sizing it so the number, native timer, and progress remain legible. Medium/large sizes get more room. Do not remove the large breakdown to fit the mascot.
5. Use the existing message vocabulary or `BunnyActivity.message` as a reference. Select a short message deterministically from the refresh time/activity. Show it where space permits; medium and large are the priority. Do not claim each widget tap changes a message in place.
6. Request the earliest relevant refresh: next half-hour pose boundary, next day-count change, and—for large widgets—the existing 15-minute detail refresh. These are scheduling requests, not exact delivery guarantees. After completion, either keep a steady celebration pose or continue requesting modest refreshes if rotating congratulations.
7. Keep `Script.setWidget(widget)` and `Script.complete()` on the widget path. Keep the current website `widget.url` and verify it reaches the updated site.
8. Retain preview/import behavior and update `apple/Scriptable/README.md` to explain static widget poses versus full website animation. A Scriptable `WebView` presentation inside the app is an optional separate enhancement, not required for the Home Screen port. [Scriptable WebView documentation](https://docs.scriptable.app/webview/)

## Invariants

- Start: `new Date(2022, 6, 1, 0, 0, 0)`.
- Completion: `new Date(2027, 6, 1, 0, 0, 0)`.
- Device/visitor local midnight, not a new global timezone policy.
- Total days: rounded-up remaining elapsed 24-hour periods; never negative.
- Detail: calendar months with month-end clamping, then weeks/days/hours/minutes/seconds. Preserve existing DST behavior.
- Progress stays in 0–100%; displayed percentage floors to one decimal place.
- Keep “YOU DID IT!”, “Congratulations Meri Jaan!!”, and “Alhamdulillah”.
- Preserve Arabic first: `فَإِنَّ مَعَ الْعُسْرِ يُسْرًا`, then “Verily, with hardship comes ease.” and the Qur’an 94:5 citation. Website Arabic retains `lang="ar"` and `dir="rtl"`.
- No Unicode emoji in rendered content. Hearts/stars/confetti use real artwork.
- No frameworks, new backend, tracking, accounts, or required network calls for widget rendering.

## Validation and delivery checklist

### Website

- Verify all ten activities, rest, and tap reaction, including repeated taps and automatic messages.
- Confirm visible movement, not just activity-name changes; inspect heartbeat, writing, reading, chewing, tea, sleeping, and ear clearance during hops.
- Verify keyboard activation, focus visibility, reduced motion at initial load and when changed, and background/resume behavior without accumulating timers.
- Test 320, 390, 768, and 1440px widths; no horizontal overflow or text/art overlap.
- Test ordinary countdown, each milestone, temporary near-future completion, and direct load after completion. Restore production dates afterward.
- Confirm one companion only, including when native injection and the site script both run.
- Verify the website still ticks, calculates dates correctly, and displays the verse respectfully.
- Test relative assets under the GitHub Pages repository subpath and local bundled/offline loading.
- Check no-JavaScript/failed-artwork fallback and no browser errors or accidental emoji.

### Scriptable

- Exercise small/medium/large, countdown/celebration, every pose, and boundary dates using API mocks where useful.
- Test actual Scriptable on an iPhone; mocks cannot prove layout, native timer behavior, tap routing, memory use, or refresh delivery.
- Verify small-widget fit and large six-unit breakdown, timestamp, timer, progress, and percentage.
- Check requested refresh dates are future dates and preserve the next day boundary and large-widget cadence.
- Confirm tap opens the correct website, offline drawing still works, and artwork stays readable in mirrored Mac widgets.
- Document that timer formatting/cadence and widget refresh remain system-controlled; the timer may count upward after the deadline until the next script refresh replaces it with celebration.

### Existing validation versus new work

The prior native/bundled-browser work passed unsigned iOS/macOS app and extension builds; countdown and pose-schedule checks; browser checks for rotation, taps, reduced motion, inactive pause/resume, milestone and completion transitions, RTL, responsive widths, and no emoji/browser errors. Native widget renderings were visually inspected. On-device installation and real widget scheduling were not verified.

Those results do not validate the new Scriptable or hosted-site port. Temporary browser test scripts under `/private/tmp` may disappear; recreate focused checks if needed. The native Foundation checks remain at `apple/Tests/main.swift`.

### Publishing and handoff

For implementation, first inspect current Git status, active branch, and existing Pages configuration. The README describes branch deployment from `main` at repository root, but do not assume the actual remote settings match without checking. Use a reviewable diff and preserve unrelated native changes. If creating a branch, follow the repository’s `codex/` prefix convention unless instructed otherwise.

This documentation request does not itself authorize publishing. When implementation/deployment is requested, publish the approved web change through the repository’s existing GitHub Pages workflow, verify deployment completion, and check the live URL and assets. A local edit or commit is not a completed live deployment.

Deliver the updated single-file Scriptable script, updated website files, relevant README changes, tests actually performed, remaining device checks, and the live URL/deployment result if publishing was part of that task. Explain that existing Scriptable installations must replace their saved script; a website deployment alone does not update them.

## Ready-to-use implementation prompt

> Read AGENTS.md and BUNNY-PORT-HANDOFF.md in this repository. Port the existing doctor bunny companion from apple/App/doctor-bunny.js to the GitHub Pages website and adapt the same character, activity poses, and encouragement to apple/Scriptable/Residency Countdown.js. Use layout A: bunny on the left beside the countdown, including mobile. Preserve all countdown dates/calculations, Scriptable’s native timer and large breakdown, original bunny identity, personal celebration text, Arabic verse, accessibility, and reduced motion. The website should run the full activity/rest/tap routine; Scriptable Home Screen widgets should rotate static poses on system refresh and open the full website on tap. Reuse existing implementations and keep the script self-contained. Avoid duplicate bunny initialization when native apps bundle the updated page. Inspect and preserve uncommitted native work. Implement and validate both ports, update their documentation, and report exact test results and remaining device checks. Prepare the website for the existing GitHub Pages deployment; do not claim it is live until an authorized deployment has completed and the public site is verified.
