# Interactive login aquarium

`/giris`, `/kayit`, `/parola-yenile` and `/kimlik` share independent React/image
fish and aquarium props. `AuthShell` keeps the aquarium mounted while `AuthPanel`
switches login, registration and recovery forms. Native history preserves route
URLs and back/forward navigation; direct visits and no-JS links still work.
The homepage and authentication actions are unchanged by this implementation.

## Visuals and entities

The login scene uses twelve AI-generated photographic assets: five fish species,
seagrass, pink coral, limestone, a reef arch, a purple sea fan, green anemone and
an empty water/sand background. These are generated images, not stock photographs
or photos of the store's livestock/products. Independent body and tail masks
animate each fish. The twelve pre-sized WebP assets total 1,015,840 bytes and are
shared across instances through browser caching. No video, runtime image service
or animation dependency is required. Prompts/provenance are in
`public/aquarium/ASSETS.md` and `public/aquarium/REEF-ASSETS.md`.

The water fades upward into white to meet the borderless auth header, with dark
teal welcome copy. The fade lives inside the background stacking context, below
all fish and props, so swimming upward does not wash out the creatures.
The deep-water palette retains the site's teal and seafoam colors; warm orange,
yellow and coral distinguish the independent creatures and plants. Locally served
Manrope gives welcome copy and form headings softer shapes; Inter remains the
form/body typeface. The font's OFL license is in `public/fonts/manrope-OFL.txt`.
A photographic empty seabed sits behind independently composed
reef islands and a clear sand channel. CSS light shafts, subtle caustics and three
bubble columns add motion. All interactive creatures and props are named buttons.

Desktop renders eighteen fish and twenty-four props across back/middle/front
layers. Mobile places the form directly below the welcome copy, with eight fish
and twelve props in the reef below it. The mobile form obstacle protects the full
area above the card's bottom edge so fish cannot crowd the welcome text. The compact
glass form stays above the scene and keeps native focus,
validation, password-manager, submit and link behavior.

## Architecture and behavior

- `lib/aquarium/scene-config.ts`: stable entity IDs, species, sizes and initial positions.
- `lib/aquarium/simulation.ts`: pure delta-time motion, click escape/recovery,
  separation, soft avoidance and hard containment for card/rock/viewport bounds.
- `components/aquarium/useAquariumEngine.ts`: one requestAnimationFrame loop,
  native pointer/focus events, entity refs, cached layout geometry, resize/scroll
  observers and cleanup. High-frequency state never goes through React state.
- `Fish.tsx`: photographic fish with independent masked tail animation.
- `AquariumProp.tsx`: independently targetable rocks, plants and coral.
- `AquariumScene.tsx`: deterministic initial HTML, scene visibility/preferences,
  keyboard skip link and ambient layers.
- `AuthPanel.tsx`: same-screen auth navigation, heading focus, mobile scroll
  positioning and fresh form state when switching screens. Existing server
  actions, legal consent validation and OAuth behavior remain intact.

Click/tap a fish to send it away from the activation point. It accelerates and
recovers to cruising speed. Cursor proximity produces a much gentler avoidance.
Anthias fish gently align with nearby schoolmates and rejoin after escaping.
Nearby plants bend toward the pointer and settle when it leaves. Clicking a prop
releases a short bubble burst. The form, welcome copy and rocks are explicit
obstacles. ResizeObserver updates geometry when help/error content changes the
card size. Focusing the form slows fish and pauses ambient particles; no field
values are read by the animation.

Keyboard activation produces bubbles while the focused fish stays in place.
The first scene tab stop is a skip link to the current form heading. Fish and props have
visible focus rings. Decorative SVG internals are hidden from screen readers.

## Motion and performance

Playback and day/night buttons were removed at the user's request. The engine
stops in a hidden tab or when the aquarium leaves the viewport. Large elapsed
times are clamped and the clock restarts on resume. Reduced-motion users get a
static scene. Press/focus styles still provide nonmoving interaction feedback.

After 120 sampled frames with more than sixty
percent taking over 42 ms, the scene switches to a lower-cost mode: twelve fish,
no ambient particles/bubble columns and static unfiltered light. This reduction
persists for the mounted scene to avoid oscillation. Mobile already uses eight
fish. A static image/CSS scene is present before hydration and with JavaScript
disabled. Transient 0–1px layout measurements are ignored so minimization or
browser capture cannot collapse the persistent fish positions.

## Verification

Use Node 24 as required by package.json. This workstation also has a local runtime
at `.gstack/runtime/node.exe`; its default `node` currently resolves to Node 20.

```powershell
.gstack/runtime/node.exe node_modules/typescript/bin/tsc --noEmit --incremental false
.gstack/runtime/node.exe node_modules/eslint/bin/eslint.js components/AquariumScene.tsx components/AquariumVideoScene.tsx components/AuthShell.tsx components/aquarium lib/aquarium tests/aquarium.test.ts scripts/verify-aquarium-hero.mjs
.gstack/runtime/node.exe node_modules/vitest/vitest.mjs run tests/aquarium.test.ts
.gstack/runtime/node.exe scripts/verify-aquarium-hero.mjs
.gstack/runtime/node.exe scripts/isolated-build.mjs
```

Eight motion tests cover schooling, escape/recovery, repeated/center clicks, obstacle and
viewport containment, changing card geometry, time-gap safety, refresh-rate
independence and focused-form slowdown. The browser script checks mouse and
touch escape, prop/plant reactions, form use, keyboard interaction,
six widths, absence of removed controls, offscreen/visibility handling, reduced motion,
transient capture viewport changes, JavaScript-disabled HTML, OAuth errors and
inline auth navigation without remounting the aquarium, browser history, mobile
focus/scroll behavior, registration validation and direct recovery/verification
routes. Verification tokens stay in the fragment until captured locally, then
are removed from the URL. Tests never submit registration or recovery emails.

Screenshots and a synthetic 150-frame interval sample are written to
`.gstack/aquarium/interactive-*`. Frame samples are local browser diagnostics,
not field Core Web Vitals or real-device GPU measurements. Real Safari/iOS and
Android device performance still needs validation.

## Legacy video assets

The former video scene, `public/videos/aquarium.mp4`, `aquarium-poster.webp`,
earlier fish video assets and the preparation script remain unused by auth pages.
Their original source is [Swimming Fish, FOCA Stock](https://www.focastock.com/video/swimming-fish)
under [CC0](https://www.focastock.com/license).
