# Shelf UI Lab — Apple-inspired UI and motion study

An independent frontend experiment exploring Apple-inspired visual hierarchy,
button feedback and purposeful transitions. The page is a working component
library with a small fictional catalog, built with plain HTML, CSS and JavaScript.

## Run

No package installation or API key is needed:

```sh
python -m http.server 8761 --bind 127.0.0.1
```

Run this inside the project folder, then open http://127.0.0.1:8761.
All interactions are local. No product service, account or AI provider is contacted.

## Explore the interface

1. Change the illustrated headphones between Blue, Graphite and Starlight.
   The preview and the appearance drawer use the same selected finish.
2. In **Buttons**, try the primary, secondary and text actions.
   The main feedback demo switches between unsaved and saved appearance.
   It is a component demonstration; actual product saving is in the collection.
3. Run **Try a local action**. It changes from ready to working to done.
   The one-second delay is an explicit local simulation, not a provider request.
4. In **Controls**, change the preview between Comfortable and Compact.
   The sliding selection and the spacing preview change together.
5. Try the switches. Sound effects is a visual state demo; it plays no audio.
   Reduce motion changes the page and also respects the device setting.
6. In **Overlays**, open the product dialog, the appearance drawer and a toast.
   Escape closes modal overlays and focus returns to the triggering control.
7. In the collection, search for `headphones`, set a ceiling of RM250, then save.
   Open Saved and reload to check local persistence.
8. The product dialog also saves through the same catalog handler, even if
   current filters hide the headphones.

These are fictional products and illustrative prices. There is no checkout,
live pricing, user account, photo identification or chat feature. Product saves
use this browser's local storage. Storage failure shows an error instead of
claiming the item was saved.

## Motion and interaction choices

| Interaction | Implementation | Why it is there |
| --- | --- | --- |
| Button hover and press | Short CSS transform, shadow and restrained highlight | Make the target and click visible |
| Finish selection | Shared state across radio buttons and drawer select | Keep the preview and controls consistent |
| Component tabs | Sliding indicator, short panel entrance | Keep track of the selected group |
| Segmented control | Moving selection and animated spacing | Make the changed setting observable |
| Switches | Explicit aria-checked state and moving thumb | Show the current state |
| Dialog and drawer | Native modal dialogs with entrance/exit motion | Keep focus inside, then restore it |
| Toast | Brief bottom confirmation, dismiss button and timer | Acknowledge a small action |
| Catalog | Filtered rendering, illustrations and persistent saved IDs | Demonstrate components in a complete flow |

Transitions mostly last 120–450 ms; the initial entrance lasts up to 900 ms.
There are no autoplay videos, scroll-scrubbing effects or continuous decorative
loops. The loading spinner runs only during the short local button simulation.
The operating system's reduced-motion setting disables animation. The manual
switch can further reduce movement, but cannot override a system request for it.

## Keyboard behaviour

- Component tabs: Left/Right, Home/End.
- Finish radio group: Left/Right, Home/End.
- Custom select menus: arrows, Home/End, Enter, Escape, type-ahead and Tab.
- Native modal dialogs: Tab stays within the modal; Escape closes it.
- All actions have visible keyboard focus. Selected and busy states are explicit.

## Files

- `index.html`: page structure, component panels and native dialogs.
- `static/motion.css`: Apple-inspired layout, component states and transitions.
- `static/motion.js`: component selection, overlay behaviour, feedback and motion preference.
- `static/catalog.js`: original inline SVG illustrations, rendering and shared product-save handler.
- `static/catalog-state.js`: sample products and testable catalog selection.
- `static/select-menu.js`: styled dropdowns using the underlying select value.
- `static/lab.css`: base layout and shared defaults used by the experiments.
- `vendor/filter-state.js`: unchanged reused helper; this demo uses `filterOffers`.
- `test.cjs`: data-selection tests.

The page uses system fonts and code-native SVG illustrations, so it runs without
external fonts, image downloads or a build step.

## Checks

With a recent Node.js version:

```sh
node --test test.cjs
node --check static/motion.js
node --check static/catalog.js
```

The four Node tests cover catalog selection, not visual quality or animation
timing. Component interactions, modal focus, catalog saves and narrow-screen
layout should also be checked in a browser when changing this interface.

## Origin

This is a new standalone experiment, not evidence of an older project or
hackathon entry. The reusable filtering helper retains its original attribution.
See [NOTICE.md](NOTICE.md) and `REUSE_MANIFEST.json`.

