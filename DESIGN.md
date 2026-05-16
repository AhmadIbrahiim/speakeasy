# Perfect Greet — Design System

Source of truth for visual identity, tokens, and component patterns. If a future
design decision contradicts something here, update this file first — don't drift.

Direction: **Warm** (cream paper · ink outlines · serif headlines · indie-maker energy).
Picked from three explored directions (Studio / Warm / Crisp). Variants live at
`~/.gstack/projects/AhmadIbrahiim-voicemail-greeting/designs/home-page-20260515/`.

---

## 1. Brand posture

Perfect Greet is a free voicemail-greeting generator. The home page is the product —
the tool lives above the fold and the user can finish their goal without ever
scrolling. Everything below the workspace is trust-building, not sales.

The visual posture answers three questions a first-time visitor asks within 2 seconds:

| Question                              | Answer the design must give                               |
| ------------------------------------- | --------------------------------------------------------- |
| "Is this actually free or a bait?"    | Stamp + trust pills + warm hand-made aesthetic            |
| "Will it sound like a 2009 robocall?" | Big confident serif headline + studio waveform stickers   |
| "Do I have to give an email?"         | "No signup" pill, no email/CTA modals before the tool     |

Tone: **a friend who built something useful and gave it away**. Never corporate,
never SaaS-y, never excited about its own AI.

---

## 2. Color tokens

All colors are defined in `tailwind.config.ts` under `theme.extend.colors`.

### Base

| Token            | Hex       | Use                                               |
| ---------------- | --------- | ------------------------------------------------- |
| `cream-50`       | `#FBF7EE` | Hover state of cream surfaces                     |
| `cream-100`      | `#F5EFE3` | **Page background** (set in `globals.scss`)       |
| `cream-200`      | `#EDE6D6` | Inset surfaces (workspace toolbar, step cards)    |
| `cream-300`      | `#E3D9C2` | Reserved — hairline dividers on cream             |
| `ink`            | `#1A1916` | All borders, headlines, body text, ink shadow     |
| `white`          | `#FFFFFF` | Card surfaces                                     |
| `stone-600`      | `#57534E` | Secondary text (Tailwind built-in, used directly) |
| `stone-500`      | `#78716C` | Tertiary text / italic notes                      |

### Accents

| Token            | Hex       | Use                                               |
| ---------------- | --------- | ------------------------------------------------- |
| `accent`         | `#E64A2B` | Primary CTA, "Why it's free" numerals, accordion `+` |
| `accent-warm`    | `#F5A623` | Stamp dot, secondary chip, scribble underline highlight |
| `accent-forest`  | `#2D7A3E` | Trust check icons, third feature card             |

### Rules

- **One accent at a time per section.** Don't combine all three accents in a single
  card; pick one. The hero rotates through them (warm in the stamp, orange on the
  CTA, forest in the trust pills) — that's already crowded enough.
- **Black is `ink`, never `#000`**. The ink tone is intentionally warm-leaning to
  sit on cream without vibrating.
- **No purple/blue gradients.** They were rejected as AI slop during exploration.

---

## 3. Typography

Three fonts, loaded as CSS variables via `next/font/google` in `app/layout.tsx`:

```ts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" })
```

| Family              | Tailwind class | Use                                                 |
| ------------------- | -------------- | --------------------------------------------------- |
| Fraunces (serif)    | `font-serif`   | All `h1`/`h2`/`h3`, sticker card titles, stamp text on stickers |
| Inter (sans)        | `font-sans`    | Body, labels, pills, buttons, captions              |
| JetBrains Mono      | `font-mono`    | Numeric values (timings, percentages, `sk_...` placeholder), accordion `+` |

### Scale

Use Tailwind's arbitrary value syntax with `clamp()` for fluid headlines so they
read at all viewports without media queries:

| Level         | Class                                                    | Example use            |
| ------------- | -------------------------------------------------------- | ---------------------- |
| Hero h1       | `text-[clamp(40px,7vw,76px)] leading-[0.98] tracking-[-0.035em] font-semibold` | Home page hero |
| Section h2    | `text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.025em] font-semibold` | Features, Templates, FAQ |
| Sub-section h2| `text-[36px] md:text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold`   | Why-free card |
| Card h3       | `text-[22px] font-semibold tracking-[-0.01em]`                                  | Feature cards |
| Card h4       | `text-[18px] font-semibold` (serif) or `text-[15px] font-semibold` (sans)       | Templates / FAQ |

### Italic for warmth

`font-serif italic` is the project's "human aside" voice — used for the
"~60 seconds, swear." line, sticker quotes, and inline tips. Use sparingly;
it loses warmth if overused.

### Headline rules

- Always set `tracking` (letter-spacing) explicitly when using Fraunces above
  24px. The default is too open.
- Use `text-balance` on multi-line headlines to avoid orphan words on the last
  line.
- Headlines can contain **one** decorative treatment: either a `.scribble-underline`,
  a yellow swatch behind a phrase, or `<em>` in italic. Never two in the same h1.

---

## 4. Spacing and layout

### Page chrome

- Page max-width: `1200px` (configured per-section as `max-w-[1200px] mx-auto`)
- Horizontal padding: `px-4 md:px-6`
- Section vertical padding: `py-12` to `py-16` for normal sections, `py-20` for hero

### Card geometry

Two card sizes, used consistently across the page:

| Size                | Radius   | Border       | Shadow            | Use                          |
| ------------------- | -------- | ------------ | ----------------- | ---------------------------- |
| Standard card       | `rounded-2xl` | `border-2 border-ink` | `shadow-ink-lg` (6/6) | Features, why-free steps, FAQ items |
| Hero card / workspace | `rounded-3xl` | `border-[2.5px] border-ink` | `shadow-ink-xl` (8/8) | Live workspace, why-free outer, hero stickers |
| Pill / chip         | `rounded-full` | `border-2 border-ink` | none              | Trust pills, stamps          |

The **offset ink shadow** is the project's most distinctive visual signature.
It signals "tangible object, drawn by a person" rather than "floating SaaS card".
Defined in Tailwind as:

```ts
boxShadow: {
  ink: "4px 4px 0 #1A1916",
  "ink-lg": "6px 6px 0 #1A1916",
  "ink-xl": "8px 8px 0 #1A1916",
}
```

**Hover lift pattern.** On interactive cards, translate up-left by 1–2px on hover.
The shadow stays put, which makes the card feel like it's lifting off the page:

```tsx
className="shadow-ink-lg hover:shadow-ink-xl hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
```

### Rotation

Stickers and template cards rotate slightly to break the rigid grid:
- Hero stickers: `rotate-[3deg]`, `-rotate-[4deg]`, `rotate-[2deg]`
- Template cards: alternate `-rotate-[0.5deg]` / `rotate-[0.5deg]`, snap to
  `rotate-0` on hover.

Rotation should be **subtle** (≤ 4°). Above that it starts looking broken rather
than charming.

---

## 5. Component patterns

### `<Stamp>` — section eyebrow

```tsx
<Stamp className="mb-7">Made with care · always free</Stamp>
```

Ink-filled rounded-full pill with a warm dot, slight counter-rotation. The
section-level equivalent of a kicker / overline. Use one per section, never
more than one in a stack.

### `<Pill>` — trust signal

White surface, ink border, green check icon, sans body text. Always grouped 3–4
in a `flex flex-wrap gap-2` row. Don't use pills for navigation or filtering —
they read as claims, not affordances.

### Sticker stack

Three white cards floating in a relative container with absolute positioning and
rotation. Each represents one product truth (voice quality, music mix, speed).
Lives only in the hero — don't repeat the sticker stack pattern in other
sections, it loses impact.

### Numbered step row (Why-free)

Vertical stack of `bg-cream-100 border-2 border-ink rounded-2xl` cards. Big
serif numeral in `text-accent` on the left. Used for the "how to bring your own
key" sequence. The numeral is the visual anchor; the prose is secondary.

### Template card

Bullet-ink-shadow card with category chip + serif title + 3-line truncated
preview. **Whole card is clickable** — loads the template into the workspace
textarea and scrolls to it (via `loadTemplate()` in `landing.tsx`). Reserve the
slight-rotation styling for templates; don't extend to feature cards.

### FAQ accordion

Native `<details>` element styled with `border-2 border-ink rounded-2xl`. The
`+` toggle rotates 45° to become `×` on open. No JavaScript needed for the
accordion itself — `<details>` handles state.

### Dark final CTA card

`bg-ink text-cream-100` card with a subtle warm-orange radial glow at the top.
The only dark surface on the page; use it to close strong with one focused
action. Don't use this dark surface anywhere else.

### `<Combobox>` — searchable dropdown

Replaces every plain Select in the project. Trigger is a normal Warm select
button (`border-2 border-ink rounded-xl bg-white`), but the dropdown opens
with a search input at the top and filters as you type. Live in
`src/components/ui/combobox.tsx`.

- Use for any list with more than ~6 options (Voice has 90+, Music has 56).
- For consistency, use it even for short lists (Accent has 3–5). The
  always-present search is forgiving when you forget option names.
- Supports option groups via `option.group` — groups render as small
  uppercase mono kickers. Background music groups by category
  (Corporate / Ukulele / Jazz / Piano / Guitar / Various).
- Keyboard: ↑/↓ move highlight, Enter selects, Esc closes, Home/End jump
  to ends. Click-outside closes.
- Footer shows match count and `↵ select · esc close` shortcut hints in
  mono. Empty state uses serif italic ("No matches" + the failed query in
  mono).
- The trigger surface and the dropdown panel both use `border-2 border-ink`
  + `rounded-xl`/`rounded-2xl` — matches the rest of the system.

### Template library dialog

Full warm treatment: `bg-cream-100 border-[2.5px] border-ink rounded-3xl
shadow-ink-xl`. Header: warm stamp + serif headline + small Inter caption.
Search input is ink-bordered. Category filters are pill-style toggle chips
(active = filled ink, inactive = white ink-bordered with hover lift).
Templates render as standard ink-shadow cards with a "Use →" affordance
that hits accent on hover. Footer bar shows match count + helper text in
mono. Lives in `src/components/ui/templateSelector.tsx`.

---

## 6. Iconography

Library: **lucide-react**.

| Use                  | Icon            | Stroke width |
| -------------------- | --------------- | ------------ |
| Check / confirm      | `Check`         | `3` (thicker reads as friendly tick) |
| Forward / progress   | `ArrowRight`    | `2.5`        |
| Voice / mic          | `Mic2`          | `2`          |
| Music                | `Music4`        | `2`          |
| Document / template  | `FileText`      | `2`          |
| Key / API            | `KeyRound`      | `2`          |
| Reveal / hide        | `Eye` / `EyeOff`| `2`          |
| Privacy              | `ShieldCheck`   | `2`          |

Icons sit at `w-4 h-4` (inline with text) or `w-5 h-5` (feature card icon, inside
a 48px ink-bordered tile with an accent background). Never use emoji as visual
elements.

---

## 7. Motion

Cheap, observable, and always cancellable. No splash animations, no entrance
animations beyond what a normal page render gives you.

- Hover lift: `transition-all` with `-translate-x-0.5 -translate-y-0.5`
- Accordion: native `<details>`, only the `+` icon rotates `45deg`
- Audio "ready" pulse: 1.6s ease box-shadow animation on a 6px dot (only in mockup,
  not yet in production component)

Respect `prefers-reduced-motion` — wrap any non-essential animation in the
media query. Currently the page has no animation that would be jarring without
motion preferences.

---

## 8. Voice and copy

The project's voice is **a friend explaining**, not a brand performing.

### Do

- Lead with the verb: "Make my greeting", "Open workspace", "Generate".
- Acknowledge the trade. The "Why it's free" section says "we used to pay for
  this" before it explains BYO-key. The reader trusts you more after you admit
  the constraint.
- Use ordinary words. "Pick a voice" beats "Select your voice option".
- One italic aside per section, max. ("~60 seconds, swear.")

### Don't

- AI vocabulary: delve, crucial, robust, comprehensive, nuanced, multifaceted,
  furthermore, moreover, additionally, pivotal, landscape, tapestry, underscore,
  foster, showcase, intricate, vibrant.
- Hype: "revolutionary", "next-generation", "AI-powered" (we know, we don't
  need to brag).
- Generic CTAs: "Get Started", "Learn More", "Sign Up". Use specific verbs
  tied to the actual action.

### Naming conventions

- Product: **Perfect Greet** (two words, both capitalized)
- Voice model: **Sonic 3.5** (capitalize Sonic, no quotes)
- Provider: **Cartesia** (italicize only when emphasizing it's third-party)

---

## 9. Accessibility

- All decorative elements (sticker tape, glow blobs, scribble underlines) have
  `aria-hidden`.
- Trust pills include the `Check` icon as a graphic, but the pill label itself
  is the accessible content (icon adds visual reinforcement, not info).
- Hero h1 uses semantic `<h1>`; section h2s use `<h2>` — heading hierarchy is
  preserved.
- Color contrast: ink (`#1A1916`) on cream (`#F5EFE3`) is ~15:1 (AAA). White on
  ink CTAs and accent buttons are checked individually.
- FAQ uses native `<details>` so it's keyboard-accessible without JavaScript.
- Focus states use the default Tailwind ring; do not remove `focus-visible`
  outlines on interactive elements.

---

## 10. Anti-patterns (rejected during exploration)

Three variants were explored before Warm won. The rejected directions still
teach us what not to do:

| Pattern                                           | Why rejected                            |
| ------------------------------------------------- | --------------------------------------- |
| Dark canvas + amber accent (Studio variant)       | Read as cold for a free consumer tool   |
| Hairline-rule Linear-style minimal (Crisp variant)| Too pro / generic SaaS, no warmth       |
| Purple/blue brand gradients                       | Generic AI slop, instantly forgettable  |
| Center-stack hero with abstract 3D illustration   | Cliché, doesn't show the actual product |
| Stock photo hero ("person on phone smiling")      | Lies about what the tool does           |
| Decorative blobs / waves not tied to audio        | Adds noise without information          |
| Emoji as visual elements (🎙 in headers)          | Looks dated; breaks visual consistency  |

If a future change brings any of these back, the change is wrong.

---

## 11. UX laws applied

From the design-html skill's "How users actually behave" guidance, the
home page is built to:

- **Not make you think.** The workspace is above the fold. No "Get Started"
  modal. No tour. The page is the product.
- **Reward scanning.** Visual hierarchy is enforced by size (hero h1 → section
  h2 → card h3 → body) and one accent color per section. Trust pills are
  scannable in <1s.
- **Replenish goodwill.** Pricing is implicit (Free forever pill in the hero,
  reinforced by "Why it's free" section before the user asks). No splash
  screens, no email gate, no cookie banner blocking the first paint.
- **Use conventions.** Logo top-left. Nav top-right. Workspace looks like a
  workspace (textarea + dropdowns + sliders), not a marketing carousel.
- **Clarity > consistency.** Templates rotate; feature cards don't. That's
  intentional — templates are *picks* (one-off selections), features are
  *facts* (parallel statements). The visual treatment matches the cognitive
  load.

---

## 12. File map

Where to look when editing:

| File                                       | What's there                                       |
| ------------------------------------------ | -------------------------------------------------- |
| `tailwind.config.ts`                       | Color/font/shadow tokens                           |
| `src/app/layout.tsx`                       | Font loading (Fraunces, Inter, JetBrains Mono)     |
| `src/app/globals.scss`                     | Body background, `.scribble-underline` utility     |
| `src/components/landing.tsx`               | Home page sections, `<Stamp>`, `<Pill>`, copy     |
| `src/components/voicemailGreetingComponent.tsx` | The live workspace (still partially in old styling — see Open work) |
| `src/components/ui/apiKeyDialog.tsx`       | BYO-key dialog (Warm-adjacent, gradient hero)     |
| `src/components/ui/combobox.tsx`           | Searchable dropdown — drop-in Select replacement  |
| `src/components/ui/templateSelector.tsx`   | Template library dialog (Warm-styled)             |
| `~/.gstack/projects/AhmadIbrahiim-voicemail-greeting/designs/home-page-20260515/` | All three explored variants + comparison board |

---

## 13. Learnings from the redesign

Notes for future design sessions on this project:

1. **The PNG mockup generator requires OpenAI org verification.** Variant
   generation via `$D variants` fell back to HTML wireframes because of an
   API-side block. HTML wireframes turned out fine — arguably better for a
   React project since you can iterate live. If `$D variants` ever works again,
   it still won't beat an HTML wireframe for porting to React.

2. **`<DialogDescription>` is `<p>` — don't nest blocks inside it.** The old
   API-key dialog crammed `<Tabs>`, `<div>`, `<ol>` inside a description prop;
   browsers reparented the block children and broke the layout. Use description
   for one string only. Same rule applies to `<DialogTitle>`.

3. **Two project paths exist on disk.** The canonical source is
   `/Users/ahmed/Desktop/voicemail-greeting/`. Stale `.next/` caches at
   `/Users/ahmed/Desktop/knight-livekit/voicemail-greeting/` will confuse
   shell tools. Always cd to the Desktop root before running `next dev`,
   `tsc`, etc.

4. **Body background change has site-wide reach.** `globals.scss`' body bg is
   inherited by every page using `BaseLayout` (FAQ, /hold, /posts, /contact).
   Switching to cream worked because all content sections have explicit
   surfaces (`bg-white`, `bg-ink`), but always sanity-check other pages after
   changing global body styles.

5. **Headlines need explicit tracking.** Fraunces at 60px+ with default
   letter-spacing reads loose. Always pair display sizes with
   `tracking-[-0.025em]` or tighter.

6. **Ink shadow shouldn't move on hover.** The pattern is to translate the
   card, leave the shadow. If both move together, the card just slides — no
   "lifting off the page" effect.

7. **Templates clicking the textarea relies on a brittle selector.**
   `loadTemplate()` in `landing.tsx` uses `document.querySelector("textarea")`
   and dispatches a synthetic `input` event so React picks up the change. If
   the workspace ever gets more than one textarea, give the script field a
   stable `id` and update the selector. See `landing.tsx:55`.

---

Last touched: 2026-05-15 · Warm direction · Variant B from home-page-20260515.
