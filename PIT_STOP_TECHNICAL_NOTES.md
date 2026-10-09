# PIT STOP — Technical Notes and Future Work

**Purpose:** Portable context for future PIT STOP development sessions. These notes summarize a source-code investigation reported by Codex in October 2026. Recheck line numbers and behavior against the current repository before making changes.

## Current weather behavior (verified in Codex's investigation)

- The active app loads `js/main.js`, which imports `js/weather.js`.
- `js/weather.js` calls `getLocation()` during module initialization. On successful browser geolocation, `locationSuccess()` calls `getWeather(latitude, longitude)`.
- `getWeather()` fetches weather from **Open-Meteo once during initialization**. There is no recurring API polling, race-triggered refresh, or internally simulated weather transition.
- `weatherCondition(weatherData)` maps weather to `clear`, `wet`, or `rain` and stores temperature, precipitation, and wind values.
- Race logic **reads** the stored weather condition to influence car progress/speed and tyre wear. The race loop does not update weather.
- `renderWeather()` presents weather information and the rain overlay; it does not advance weather.
- The weather condition can appear to change after a race starts if the initial asynchronous request finishes late. This is not continuous weather tracking.

**Accurate public description:** “PIT STOP retrieves current local weather once and uses that condition to influence tyre performance and wear throughout the simulation.”

## Technical debt — address when returning to PIT STOP

### P1 — Race may start before weather initialization finishes

**Observed behavior:** `startRace()` does not wait for the weather request. A late response can establish or change the condition during an already-running race.

**Potential fix to design and test:** Define deterministic starting-weather behavior: either wait for initialization with a visible loading/error state, or set a deliberate default and decide whether late responses can apply during a race.

**Acceptance checks:** Test slow API responses, immediate race start, API failure, and reset/restart. Confirm the weather state and UI agree with the intended policy.

### P1 — Missing fallback on geolocation failure

**Observed behavior:** A failed weather fetch sets fallback values, but browser geolocation failure only logs an error. Weather can remain uninitialized if location permission is denied or location is unavailable.

**Potential fix to design and test:** Apply a consistent default weather state when geolocation fails, and communicate it in the UI if appropriate.

**Acceptance checks:** Deny permission, simulate unavailable geolocation, and simulate weather API failure; verify the race still starts with a valid weather state.

### P2 / Optional feature — Dynamic weather

**Current behavior:** No periodic weather refresh and no internally evolving weather model. Do not describe PIT STOP as continuously tracking or simulating weather changes.

**If pursued:** Decide whether to add (a) periodic external updates, (b) internal transitions, or (c) both. Define how transitions affect tyre strategy and whether mid-race changes are desirable. This is a new feature, not a bug fix.

## Source pointers from the investigation

| File | Approx. lines | Relevance |
| --- | --- | --- |
| `js/weather.js` | 21, 27, 55–87, 92–135 | Geolocation callback, API fetch, fallback, weather mapping, rendering, initialization |
| `js/main.js` | 59, 62–87, 137, 147 | Weather import, 200 ms simulation loop, start/reset |
| `js/state.js` | 8–13 | Initial weather state |
| `js/race.js` | 74, 156 | Weather's effect on speed/progress and tyre wear |
| `js/doc.js` | 673–685 | Detects changes but does not update weather state |
| `legacy/presentation-v1/script-legacy.js` | 1181–1226, 2092 | Legacy one-time weather fetch flow |

These are **reported source locations**, not freshly inspected in this document. They may shift as code changes.

## Case study / portfolio coordination

- Case study location: `web-dev-portfolio/projects/pit-stop.html`.
- Case study media notes: `web-dev-portfolio/assets/pit-stop-case-study/README.md`.
- Portfolio and PIT STOP are separate sibling project folders in the VS Code workspace.
- Keep public case study claims aligned with the actual code. Do not claim continuous weather tracking or weather evolution.
- The two P1 issues were designated as internal improvement notes, not necessarily content for the public case study.

## Suggested next-session checklist

1. Read this document and inspect the latest `js/weather.js`, `js/main.js`, `js/state.js`, and related tests.
2. Reproduce both P1 issues before changing code.
3. Decide the expected behavior for starting a race before weather loads.
4. Implement geolocation-failure fallback and initialization behavior with tests.
5. Check the live demo and repository revisions match the case study.
6. Consider dynamic weather only after the reliability fixes.

## Context for future assistants

PIT STOP is a browser-based motorsport strategy simulator built with vanilla HTML, CSS, and JavaScript, with Canvas visualization, tyre/fuel/pit strategy, opponent behavior, weather integration, and an AI race engineer. It is the flagship technical project in Joshua's frontend portfolio. Prioritize accurate technical claims and targeted reliability improvements over unnecessary redesigns. Verify all specifics in the repository before implementation.
