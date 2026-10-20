# Moonnight Studios

A single-page, scroll-driven film for an independent creative production
house: AI-assisted brand films, resort and hospitality films, architectural
visuals, product campaigns and lifestyle portraits.

It is not a homepage with animation on top. The page is a sequence of
**acts**, each one a tall track containing a stage that sticks to the
viewport while the track scrolls past. One rAF loop turns each track's
position into a 0 → 1 progress value and writes it out as CSS custom
properties; the choreography itself lives in the stylesheet.

Nothing listens to `wheel` or `touchmove`. Flick scrolling, Page Down, End,
the scrollbar thumb and find-in-page all behave exactly as they should.

The studio name is **not final**. It appears as `Studio Name` and lives in two
places:

- `src/data/studio.ts` — navigation, mobile menu, footer.
- `index.html` — `<title>` and the Open Graph tags.

Change both and the name is replaced everywhere.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build     # type-check, then build to dist/
npm run preview   # serve the build on Vite's preview server
npm start         # serve the build on the Node server in server/
npm test          # enquiry validation and delivery tests
```

In development the enquiry form works without any email credentials:
submissions are written to `.enquiries/` and the page says they were **stored**,
not emailed. It never shows a success message for something that was not
delivered.

## The layout is the design

The page is built on four zones. Three of them hold content:

```
  rail          label        body                    air
  ----------    ---------    --------------------    ------------
  wordmark      (empty)      Sell the feeling        (empty)
  Work                       of being there.
  Images
  Films                      Show guests the stay…
  For Resorts
  About
  Contact
```

**rail** — fixed in the left margin. Navigation never crosses a picture, so
it needs no scrim, no inversion and no hiding on scroll; it is simply always
there, and it gives the page a permanent left edge to align against.

**label** — **nothing is set here any more.** It survives as a measuring
line that several layouts start from, and as the gap that keeps type clear
of the rail.

**body** — one narrow measure for running copy.

**air** — left empty on purpose.

### The numbered labels are gone

Five acts used to carry the same furniture in the same place: a number, a
word in small letterspaced caps, and a short rule, in the left column —
`01 Work`, `02 For resorts`, `04 Point of view`, `05 About`, `06 Contact`.
The instrument carried a slate id (`B-07`) in the same slot, which could not
be looked up anywhere and existed to look like a film studio rather than to
tell anyone anything. Section 04 printed a numbered `01 / 02 / 03` index
under a hairline, which is a process timeline however it is dressed.

All of it is removed, and **not replaced with a different decorative
label**. Nothing was put in its place.

The grid is still here, but it is no longer the whole design. Every act
used to start its first line at the same x, at the same height, with the
same marker beside it, and that sameness is what made the page read as a
template with the content swapped out rather than as a sequence of
compositions. Each act now places its words where its own picture wants
them:

| Act | Where the words sit |
| --- | --- |
| Arrival | low left, on the floor of the frame |
| Work | nothing but the two field names, on the fields themselves |
| For Resorts | headline rides the first world, then nothing but photographs — it hands straight over to the instrument |
| The instrument | at the foot, beside the pad it controls |
| Point of view | on the picture, at the points they refer to |
| About | low in the frame, headline and standfirst side by side under the building |
| Contact | mid-frame, resolving as the picture settles |

Two rules survive on the whole page, and both are affordances rather than
furniture: the underline on a form field, and the one under the CTA link.
The footer's hairline went too — the act above it ends on a full-bleed
picture, so there is already a hard edge, and space does the rest.

Verified rather than asserted: nothing on the page sits under the rail at
any scroll position, at 1440 / 1000 / 390.

Below 1100px there is no margin to live in, so the rail becomes a button and
a sheet.

## The gate: two doors, and the work arriving

`PortalGate` is a **track**, not a screen — 190svh with a sticky hold.
Two things in it can be clicked, and nothing else ever will be.

**The names are set at the size of a destination.** They were 0.7rem at
0.34em tracking, hung on the dark ground *outside* the two pictures,
which made them read as captions filed under two images rather than as
the two rooms you came to open. They are now display type at
`clamp(2.1rem, 4.4vw, 3.9rem)`, standing inside the frame they belong
to. A bronze rule draws itself under the name on approach and the other
name dims — feedback while you are reaching for something, not
furniture that is always there.

Both pictures need a floor for that word: `.gate-media::before` is a
gradient at the foot of each field. Without it "Images" sat on sunlit
grass and was unreadable. Measured at the glyph across the full
cross-fade — both names, four stills, two scroll positions — the worst
case is **6.8:1**.

**Keep scrolling and the work flows in.** Eight more frames rise into
the composition while the two fields settle back, so by the foot of the
act you are looking at a body of work rather than at two panels. They
are placed to reinforce the diagonal the two fields already make: a
cluster top-right, a cluster bottom-left, two frames running off the
outer edges. The centre under the images field is deliberately left
empty — frames parked there read as stragglers that missed the
composition.

One scroll channel drives all eight. Each frame carries its own cue in
`--in` and does its own easing in the stylesheet with `clamp()`, so
scrolling writes a single number and nothing else crosses the JS
boundary. The frames are `aria-hidden` and take no pointer events.

`gatePreview.flow` never repeats the six stills the images field
cross-fades, or the gate would be showing the same picture twice on one
screen.

**Below 760px there is no flow.** The two fields stack full-bleed, so
anything placed around them lands on top of one of them; the track
collapses to its natural height. **Under reduced motion the same
collapse happens** and the eight frames are simply in place — left as a
track it kept 810px of scroll that did nothing, because the channel is
never registered there, and the frames never arrived at all.

## The chain hands over to the instrument

`WorldChain` sizes its track as `passages × pace + tail` viewport
heights. **The tail is the hold after the last passage lands**, and it
used to be a full screen for every chain.

A full screen is right when something is written on that last world.
On the resort chain nothing was: the headline had cleared long before,
so it was a photograph scrolling past with one line of small print on
it, and it read as a blank section sitting between the chain and the
instrument.

The resort chain now passes `tail={0.3}` — just enough for the last
world to settle — and the instrument follows immediately. The chain
walks five worlds and then hands the visitor the controls, which is the
order the two acts were always making: here is the property, now direct
it.

**The pace came down too, from 1.05 to 0.8.** Measured by walking the
act in 100px steps and recording what carried any visible words at each
one — reading the *effective* opacity, multiplied up the ancestors,
because these blocks are faded by a parent and reading the leaf's own
opacity says everything is visible. Between the headline clearing and
the instrument arriving there were **2,700px — three full screens —
with nothing said.** It is 1,500px now, and the last 1,050px of the act
carry the instrument.

**And the instrument rides up over the chain's exit** (`margin-top:
-58svh`). A full-bleed sticky stage has to scroll away at the end, and
that exit is one screen of photograph with nothing on it — the last
thing seen before this act. Pulled up, the frame left on screen is the
one with the controls on it.

That margin is scoped to `(min-width: 1100px) and (prefers-reduced-motion:
no-preference)`, and the scoping is not precautionary. Below 1100px the
resort copy is bottom-anchored, and under reduced motion the chain is a
plain vertical run of pictures; in both cases the unscoped margin pulled
the instrument **over the resort's own headline**. It did exactly that
until it was measured.

The disclosure — *"Conceptual work. Not an existing property."* — moved
with it, onto the instrument. It belongs with the frames it describes,
and a whole screen of hold was being spent to carry one line.

`tail` defaults to 1, so the arrival chain is unchanged: its last world
carries the hero headline and has earned its screen.

## Inside a world: the wheel, and the way out

**The wheel moves the room.** This is the single exception to the rule
that nothing on this site listens to `wheel`, and it is not a
contradiction of it. That rule exists so the page's own scroll is never
hijacked. Inside a world overlay there is no page scroll to hijack —
the overlay is fixed and the body is locked — so a visitor who scrolls
got nothing at all, which is what it felt like: a full-screen picture
that does not answer.

`useWheelStep` accumulates deltas rather than acting on each event. A
trackpad emits dozens of small deltas per flick and a mouse emits one
large one; counting to a threshold of 90 makes both advance **one
picture at a time** instead of either crawling or rocketing. A pause
longer than 220ms starts the count clean, so a long flick cannot bank
momentum from the one before it. Verified: three mouse notches advance
three frames, and a ten-tick trackpad flick advances one.

Both rooms use it, because a visitor who learns the gesture in one will
try it in the other.

**The way out.** It was a bare `×` with an `aria-label` and nothing
visible; then a pill reading **× CLOSE** in letterspaced caps, which is
a stock component and reads as one. It is now set in the same voice as
the two names on the gate: the word **Close** at
`clamp(1.15rem, 1.7vw, 1.6rem)` in Manrope 300, beside a cross drawn as
two `1px` lines rather than an icon — so it can **turn a quarter and
open out** as it is approached, lines going bronze. The control answers
before it is pressed, and that turn is the whole interaction. No pill,
no border, no caps. The hit area is 131 × 59 on desktop and 103 × 53 on
a phone.

It lives in `WorldOverlay`, **first in the DOM**, and it is positioned,
so order costs it nothing visually. Rendered last it sat behind the
film strip's thirty-eight posters: Escape still worked, but a keyboard
visitor needed forty Tabs to find the door.

The overlay focuses **the dialog itself**, not its first control.
Focusing the first control now means focusing Close, which put the way
out in its approached state the instant the room opened and left Enter
undoing the click that got the visitor there. From the container, one
Tab reaches Close in both rooms.

The chrome also says `SCROLL OR USE ← →`, so the gesture is not a
secret either.

## Gaps are measured, not eyeballed

The page is scanned for bands where nothing is drawn — rendered in
viewport slices, every fourth row sampled across the full width minus
the rail column.

**Measure flatness, not brightness.** The first pass flagged a row as
empty when nothing in it was brighter than the page ground, and
reported a 448px gap inside the contact act. There is no gap there: it
is a fountain at dusk, a genuinely dark photograph. A dark picture
still *varies* across a row and bare ground does not, so the test is
standard deviation under 3.5 together with a dark maximum.

Real gaps the scan found and what caused them:

| Band | Cause |
| --- | --- |
| 268px, instrument → viewpoint | `--s7` (158px) of padding on both sides of one boundary |
| 630px, end of About | a sticky stage leaves a dead run: the track is taller than the stage to give the settle travel, and the difference is scrolled through as empty ground |
| 630px, end of Contact | the same |
| 188px, above the gate | the composition was `16/8.2` in a full-screen hold and did not fill it |

Fixed by cutting the padding to `--s5`, shortening both tracks (170svh
→ 135 and 130), and making the gate stage `16/9.6`. The page is **864px
shorter** and the scan now reports **no flat band over 160px anywhere**.

A sticky stage always buys its scroll travel at the price of a dead run
behind it. If you lengthen one of these tracks, you are adding empty
ground to the end of that act — re-run the scan.

## Apertures — the idea the site is built on

The journey does not cross-fade between pictures. It travels **through the
openings that already exist in them**: the car window, the doorway, the
glazed band on the upper floor, the wall that folds away onto the meadow.
The camera pushes into an opening until the opening is the screen, and what
is on the other side is somewhere else entirely.

That is why `src/data/worlds.ts` exists and why it reads like survey notes.
An aperture is not a design decision you can make in CSS — it is a
**measurement of a photograph**. Every rect in that file was read off the
actual frame with a coordinate grid, then calibrated in the running site
against the live cover-crop.

```bash
# draws every aperture over its world, with its id and numbers
open "http://localhost:5173/?apertures=1"
```

Coordinates are percentages of the *displayed* box, after `object-fit:
cover` and `focus` have cropped it — not of the source file. **Change
`focus` and the aperture moves with the crop**, so the two must always be
re-checked together.

Each passage runs in two phases, and the split is the whole trick:

| phase | what happens |
| --- | --- |
| **A** | the aperture fills with the next world — an iris opening inside the doorway while the doorway itself holds still |
| **B** | both grow together from the aperture's centre, locked to the same factor, so the opening and what is behind it stay welded while the camera flies through |

Locking them is what makes it read as travel rather than as a wipe. If the
incoming clip and the outgoing scale drift apart by even a few per cent you
see a seam crawling along the door frame and the illusion is gone.

A narrow doorway needs a much longer push than a wide glass wall before it
covers the screen, which is why the slot transitions feel faster and harder.
That falls out of the geometry; it is not tuned per passage.

## The acts

| Act | Ground | What happens |
| --- | --- | --- |
| **I — ActArrival** | dark | A woman behind a car window; the window becomes a window into somewhere else; you are through it and standing in a doorway. |
| **II — PortalGate** | dark | Two destinations. Not two cards: two fields of different shapes at different depths that overlap, so it reads as one picture plane with two things in it. |
| **III — ActResort** | dark | Five worlds, four passages, no cuts: the land, the house, the eave, the room, the morning. |
| **IV — ActPause** | light | Almost nothing moves. The quiet makes the acts either side feel like events. |
| **ActInstrument (03)** | dark | One property, nine frames, two axes of direction. A pad in the margin moves the frame; a third control turns the still into the film it is a frame of. |
| **ActViewpoint (04)** | dark | The studio's position written *on* a frame — three marks at points really in the picture, each with a leader back to what it refers to. |
| **V — ActAbout** | dark | Two sentences standing on a photograph, not floating above one. The picture arrives slightly oversized and settles; nothing else happens. |
| **VI — ActLastFrame** | dark | The journey stops. One control opens the contact panel. |

**Passages inside a movement, cuts between them** — the grammar an edit uses.

## The portfolio is not part of the scroll

IMAGES and FILMS are **overlays, not sections**. Choosing one takes the whole
screen and the page waits behind it; closing hands the visitor back to the
gate, in the same place. That is what stops the portfolio from being "more of
the page" and makes entering one feel like going somewhere.

The open world is in the URL hash, so Back leaves a world rather than the
site, and `#images` or `#films` can be linked to directly.

### Two worlds, two interaction systems

Nothing appears in both — eleven stills, eleven films, split by what a piece
*is*. The category words (films, images, portraits) therefore live only in
the copy and never over the work.

| | **IMAGES** — the exhibition | **FILMS** — the screening room |
| --- | --- | --- |
| idea | a field that recomposes around whatever you are looking at | a program frame and a strip, laid out like an edit suite |
| motion | spatial, compositional | linear, temporal |
| navigation | click a satellite to bring it forward, click the hero to open it full | click a strip frame to load it into the program |
| controls | prev / next / close | play, scrub, mute, prev / next / close |

**The exhibition.** One picture holds the centre at full size; the rest sit in
hand-placed slots around it at different scales and depths. The running
order is interleaved by subject, not grouped: grouping put six deer on
screen at once and then five aerials, so every screenful looked like one
photograph taken repeatedly. Spread evenly, no two neighbours share a
subject and no window of nine holds more than three of anything. Changing the hero
rotates every picture by one slot, so the whole field moves at once and each
frame travels from a position you just saw it in. That is what makes it read
as choreography rather than a swap. Slots are hand-placed rather than
generated — evenly spaced satellites read as a carousel, and one slot sits
deliberately *in front* of the hero, which is the difference between a
composition and a ring of planets. Closing a full-bleed image never resets
the hero.

**The screening room.** **Exactly one `<video>` element exists at a time.**
The strip is posters, not players, so selecting a film swaps the source on
the single program element rather than mounting another — that is what keeps
a room of eleven films to one decoder and one download. The scrubber is a
real `<input type="range">` bound to `currentTime`, so arrow keys scrub and
screen readers get a slider rather than a mystery bar.

On a phone the exhibition shows one picture at a time and swipes, because
satellites at that scale would be thumbnails too small to hit; the gate
stacks into two large tappable fields.

## Structure

```
index.html                 title, description, Open Graph, favicon, hero preload
src/
  App.tsx                  act order, world state, viewer state, deep links
  index.css                the design system AND the choreography
  motion/
    stage.ts               the scroll engine: one rAF loop, easing helpers
    useStage.ts            binds an act; registers nothing under reduced motion
  data/
    studio.ts              wordmark, nav
    content.ts             every line of copy and the disclosures
    worlds.ts              THE APERTURES — measured, not designed
    portfolio.ts           the work: id, category, media paths, alt
    rooms.ts               THE TWO ROOMS — which pieces are films, which
                           are stills, and how each room is composed
    media.ts               id -> piece lookup
  components/              one per act, plus WorldChain, Passage,
                           MediaFrame, FilmViewer, ContactPanel
  hooks/                   useAmbientVideo, useReveal, usePrefersReducedMotion
shared/options.mjs         project types for the form, shared with the server
server/, api/              enquiry handling (Node server and Vercel function)
public/                    all images and video
```

### Why there is no animation library

GSAP ScrollTrigger's pinning rewrites the DOM with spacer elements and takes
ownership of the scroll position, which is where the "scroll feels broken"
sensation comes from. Native `position: sticky` over the real scrollbar gives
the same choreography and leaves the visitor in control. Framer Motion would
add ~40kB to animate things CSS already does on the compositor. The whole
engine is about 120 lines in `src/motion/stage.ts`; the bundle is React and
very little else.

### Tuning the choreography

- `pace` on a `WorldChain` — viewport-heights of scroll per passage. The
  resort chain runs at 1.05, the arrival chain at 1.4.
- The hold/push split is `seg * 0.42` in `WorldChain.tsx`: how long a world
  is held still before it is left.
- `drive()` in the same file is the acceleration curve for the push.
- Track heights for the cut acts are in the stylesheet, next to each act.

### Colour and type

| Token | Value | Name | Role |
| --- | --- | --- | --- |
| `--ink` | `#111C2A` | Midnight Blue | The ground. Near-black, so the pictures stay the brightest thing. |
| `--slate` | `#28394A` | Slate Blue | The second surface — the About act, media placeholders. |
| `--ivory` | `#F0ECE4` | Warm Ivory | Text on dark, and the light acts. |
| `--soft-bronze` | `#B69A70` | Soft Bronze | Accent on dark. Hairlines, focus rings, selected states. Never a fill, never a gradient, never a glow. |
| `--bronze` | `#786C5A` | Muted Bronze | Accent on light. The restrained one. |

Two tiny derived lifts, both forced by measurement rather than taste: Soft
Bronze is 4.42:1 on Slate and Muted Bronze 4.36:1 on Ivory — fine for a rule,
just short of AA for the small letterspaced caps the eyebrows use. Five per
cent in each direction (`--accent-text-dark` `#B99E76`, `--accent-text-light`
`#736858`) clears it and is imperceptible beside the parent colour.

`--scrim` (`8, 13, 20`) is deliberately **not** the brand colour. A saturated
hue announces itself the moment it covers anything — the ground at 80% over a
picture grades it rather than darkening it. Scrims are near-black and mostly
neutral; text and hairlines still use full chroma.

Measured: Ivory on Midnight and Midnight on Ivory both 14.6:1; Ivory on Slate
10.1:1; Soft Bronze on the dark grounds 6.4:1.

### Three voices, one family

The site is set entirely in **Manrope**. There is no second face.

| | | |
| --- | --- | --- |
| **Display** | Manrope 300, hard negative tracking | headlines, one word each at 700 |
| **Standfirst** | Manrope 300, larger and looser | the line under a headline |
| **Detail** | Manrope 400–600 | body copy, labels, numbers, every control |

With one family the registers cannot come from a second face, so they
come from **weight**. The standfirst stays its own voice because it is
*lighter* than the body copy beneath it as well as larger — a difference
a face with 200–800 can actually carry. Without that it collapses into
two registers, headline and not-headline, and no amount of alignment
fixes it.

**Sizes are not the ones a serif wanted.** Manrope's x-height is far
larger than Cormorant Garamond's, which this replaced, so the same
`font-size` reads around a fifth bigger. Every display step came down
to match by apparent size rather than by the number, and the negative
tracking went up: a geometric sans needs considerably more of it at
display size than a serif does.

**The pivot.** Every headline carries exactly one word at 700 and it is
always the word the sentence turns on: **feel**, **feeling**,
**Without**, **experiencing**, **watching**. It is the only weight
change inside a headline anywhere on the site, which is what keeps it
meaning something.

It used to be a serif italic. **Manrope has no italic** — not in any
weight — and a browser-synthesised oblique is a slanted roman, not an
italic: the letterforms are wrong and at display size it reads as a
rendering fault. Weight carries the emphasis instead, which a geometric
sans does better than it does slant. The pivot also carries a
`margin-right` equal to its negative tracking, because letter-spacing is
applied after the final glyph too and without it the pivot runs into the
word after it.

**One contrast consequence, measured.** Moving the display from a
500-weight serif to a 300-weight sans cost real contrast against the
hero photograph: measured *at the glyph* — diffing the page with and
without the text so only pixels a letterform actually covers are
sampled — the headline sat at 3.7:1, which clears the large-text
threshold and nothing more. The arrival veil was deepened; it is 7.4:1
now. Measure at the glyph, not over the bounding box: a bounding box for
86px type is mostly background and reports a failure that is not there.

**Two marks live in the copy**, in `content.ts`, because they belong with
the words and not in a component:

- `*asterisks*` — the pivot word
- `|` — a typeset line break, chosen by whoever wrote the line rather
  than by the measure

A `max-width` narrower than the longest authored line is a second,
conflicting instruction: the copy says where to break and the measure
then breaks it somewhere else. Three of them were doing exactly that.

**Tracking is not a constant.** A face wants less as it grows: display
−0.04em, head −0.032em, head-sm −0.022em, pivot −0.045em.

Manrope is bundled locally via `@fontsource`, so the page makes no
third-party font requests.

## The instrument, and why these nine frames

`src/data/instrument.ts` drives section 03: one property, nine frames,
two axes — how far back the camera stands, and what the light is doing.
The pad is the act. Moving across it is the thing the studio sells: the
same brief, taken in a different direction, seen immediately.

**Every cell is a piece that has both a real still and a real film on
disk.** That is not a coincidence, it is the selection rule. A film's
poster *is* a frame of that film, so the still and the moving version
are guaranteed to be the same scene — pull the motion control on any
cell and you are watching the clip that still came out of. Nothing here
is a pairing anyone invented.

The coordinates are read off the work. Each frame sits where its own
description puts it, not where a grid needed filling. If you replace a
frame, re-read it and place it honestly, or move it to the cell it
actually belongs in.

**There is no fourth column.** Rain exists in the library (`rain-walk`,
`stream`) but not at every distance, and there is no night work at all.
A column padded with frames that do not belong in it would make the
instrument a lie about what has been shot. Add one when the work exists.

An earlier version of this act named four *categories* — Architecture,
Fashion & Beauty, Hospitality, Products & Campaigns. Two of those had no
work behind them at all: not one fashion, beauty or product frame is in
`public/`. Naming a category you cannot show is the same failure as
faking a client, which is why the act is now built on frames rather than
on labels.

## Marks, not a feature list

Section 04 puts three annotations on a photograph at points that are
really in it — `viewpoint.marks[].at` is a percentage of the picture, so
**swapping the picture means re-placing the marks**. Above 900px the
picture carries the copy and the list beneath it is an index; below
900px the marks are gone and the list is the act. The copy is in the DOM
once and shown in one place at a time: printed twice on one screen it
read as a fault.

## The portfolio is silent

This is a hard rule, not a style preference. **The gallery renders no visible
text.** No titles, captions, descriptions, project names, client names,
credits, counts or category labels on the work. The same applies to the five
scenes of the resort sequence.

The only words anywhere near the work are the four filter buttons — a control,
not a description.

What that means in practice:

- `src/data/portfolio.ts` has no title or caption field. There is nowhere to
  put one. `alt` exists for assistive technology and broken images and is
  never rendered on screen.
- The work section carries a `.u-hidden` `<h2>` so screen readers and the
  document outline have a name for it. It is invisible.
- Film tiles get a play mark — a circle and a triangle, no words. Its
  accessible name comes from `aria-label`, which is also never rendered.
- The viewer has an icon-only close control and no caption row.
- Accuracy statements live in the footer (`disclosures` in
  `src/data/content.ts`), because they must not be dropped just because
  there is nowhere in the pictures to put them.

If you need to say something about a piece, the answer is no. Reorder the
sequence instead.

## Adding work

Three steps, in this order.

### 1. Put the files in `public/`

```
public/images/<group>/<name>.jpg          the still, or the video's poster
public/images/<group>/<name>-960.webp     optional narrow-screen variant
public/media/<group>/<name>.mp4           the clip, if it is a film
```

**Never add a path to the data before the file is on disk.** Every poster
needs a real poster frame; a film without one shows a black rectangle until
it buffers.

### 2. Register it in `src/data/portfolio.ts`

```ts
{
  id: "unique-id",
  category: "films",            // films | images | portraits
  video: "/media/group/x.mp4",  // omit entirely for a still
  poster: "/images/group/x.jpg",
  posterSmall: "/images/group/x-960.webp", // optional
  ratio: "16 / 9",              // the SOURCE ratio — reserves space, stops layout shift
  crop: "21 / 9",               // optional display crop
  focus: "50% 30%",             // optional object-position
  alt: "What is in the frame. Never rendered on screen.",
  hasAudio: true,               // optional; playback always starts muted
}
```

### 3. Put it in exactly one room, in `src/data/rooms.ts`

- a clip → `screening`, with a projection `format`
- a still → `exhibition`, where **order is spatial**: neighbours in that list
  become neighbours on screen as the field rotates, so sequence it by light
  and subject rather than appending to the end

**Never put the same piece in both.** The separation by medium is the idea.

A twelfth still also needs a ninth entry in `slots`, or it parks off-stage
until it is the hero.

### And consider the gate

`gatePreview` in the same file is what plays on the page itself. **This is
the only place work is visible without choosing a world**, so it matters
more than its length suggests. Keep it short — it is a trailer, not the
collection — and pick films that read in a few seconds with no sound.

## Where the work is visible

| | |
| --- | --- |
| On the page, no click | 12 stills, and 4 films playing silently at the gate |
| Images world | 11 stills |
| Films world | 11 films |

The gate fields are both alive. A films field that does not move is the
least convincing thing a film studio can put on a page, so the stills
cross-fade and the films cut to the next as each one ends — a visitor who
never clicks anything still watches a short reel.

One video element exists on the page. It loads nothing until the gate is
near the viewport, carries no audio, and pauses the moment the gate leaves
the screen.

## Silent in-place playback

`ambient: true` on a piece makes a clip loop silently inside its frame where
one is shown inline. Three rules keep it cheap, in `src/hooks/useAmbientVideo.ts`:

1. The `<video>` element is not mounted until the tile is within 600px of the
   viewport, so nothing downloads for work further down the page.
2. At most three clips play at once. Tiles queue for a slot and release it on
   leaving the screen.
3. Viewports under 820px, `prefers-reduced-motion: reduce` and Save-Data get
   the poster only.

The loop lies over its own poster and fades up once it is genuinely playing,
so a stalled or blocked video never shows a black rectangle.

Reserve `ambient` for short, seamless, lightweight clips. A long cut, or
anything with narrative or audio, belongs in the viewer — leave it off and
visitors open it from the play mark.

## A deliberate motion system for phones

Below 760px nothing is shrunk, it is rebuilt. The gate stacks into two large
tappable fields with no overlap games — there is no pointer to approach
with. The exhibition shows one picture at a time and swipes, because
satellites at phone scale would be thumbnails too small to hit. The resort
copy moves to the foot of the frame where the veil is deepest.

## Reduced motion

`useStage` registers nothing at all when `prefers-reduced-motion: reduce` is
set, so every custom property falls back to its resting value. Sticky is
dropped, the five resort scenes stack as a vertical sequence, and all the copy and controls sit at full
opacity. Nothing is hidden and nothing depends on scrolling — the film
becomes a document.

## Honesty rules this site follows

- No client names, logos, testimonials, awards or statistics anywhere.
- Every piece currently shown is self-initiated concept work, and no visual
  depicts an operating property. Both are stated once, in the footer.
- The contact form reports what actually happened. "Stored" and "emailed" are
  different messages.

If any of this work was in fact commissioned, edit `disclosures` in
`src/data/content.ts`. Do not relabel speculative work as commissioned — and
do not solve it by adding a credit to a tile.

## Contact form

The form posts JSON to `POST /api/enquiry`. Fields: `name`, `email`,
`projectType`, `brief`, plus `startedAt` and a `website_confirm` honeypot.

Spam protection: honeypot field, a minimum 1.5-second fill time, and a rate
limit of five submissions per IP per ten minutes.

It lives in a panel that slides over the final frame — `ContactPanel.tsx` —
rather than a section you scroll to, so reaching it never unwinds the
journey. It behaves as a dialog: focus moves in, Tab is trapped, Escape
closes, focus returns to whatever opened it, and the page behind is locked.

**It is not connected to email yet.** Set `FORM_PROVIDER` to deliver:

| Variable | Purpose |
| --- | --- |
| `FORM_PROVIDER` | `log`, `resend` or `webhook`. Unset in production means submissions are refused, not faked. |
| `ENQUIRY_LOG_DIR` | Folder for `log`. Defaults to `.enquiries`. |
| `RESEND_API_KEY` | Server-side. Required for `resend`. |
| `ENQUIRY_FROM_EMAIL` | A verified sender on the Resend account. |
| `ENQUIRY_TO_EMAIL` | Where enquiries should arrive. |
| `WEBHOOK_URL` | Required for `webhook`. Receives JSON. |
| `WEBHOOK_SECRET` | Optional. Sent as `X-Enquiry-Secret`. |
| `VITE_SITE_URL` | Public origin, no trailing slash. Needed at build time for `sitemap.xml` and `robots.txt`. |

Copy `.env.example` to `.env`. Nothing secret is prefixed with `VITE_`.

To change the project types in the dropdown, edit `projectTypes` in
`shared/options.mjs`; the form and the server validator read the same list.
`resortProjectType` in that file is what the "Create your resort film" button
preselects, and what `?project=hospitality` resolves to.

## Deep links

- `/?world=images` opens with the "What We Create" stage on that world.
- `/?project=hospitality` opens the contact panel with the type preselected.

## Media notes

### The hero

`src/data/worlds.ts` → `arrival`. Currently `stills/mist.jpg`: dawn, mist,
low sun, a figure at a glass wall. It carries the studio's name without
illustrating it, and the glass wall is a real opening — so the first move of
the site is stepping through it.

**To replace it** (a purpose-shot hero is the single biggest upgrade
available):

1. Put a **landscape** file in `public/images/`. Portrait sources crop badly
   at full bleed; 16:9 or 4:3 both work.
2. Change `poster`, `posterSmall` and `alt` on `arrival`.
3. Run `?apertures=1`, scroll to the top, and nudge `x / y / w / h` until the
   green rect sits on the actual opening in the photograph.

**The opening frame has to contain an opening.** A door, a window, an
archway, a gap under an eave — the site's first transition pushes the camera
through it. A frame with nothing to step through cannot be left that way, and
the passage falls back to a plain centred iris, which is the weakest move on
the site.

What would work best, if you are shooting or generating one: a wide frame,
low or late light, a visible threshold roughly centred, and enough quiet in
the lower third for the headline to sit in.

### Coverage is checked, not assumed

```bash
npm run coverage   # also runs as part of npm test
```

`scripts/coverage.mjs` fails the build if **any piece in the catalogue
renders nowhere**, or if **two pieces share an id**. Both have bitten this
project:

- 23 images were added to `portfolio.ts` and never put in a room, so they
  existed in the data and appeared on no screen. Every person shot was
  among them.
- Two new stills were named `reading` and `court`, which were already film
  ids. The lookup is a `Map`, so the stills silently shadowed the clips —
  the films room would have hit a piece with no `video` and rendered
  nothing at all.

Adding to `portfolio.ts` is half the job. **A piece is not in the site
until it is in a room in `rooms.ts`.**

### The reels

32 clips arrived in `public/media/reels/` with posters in
`public/images/reels/`. They are a clear tier above the original
`studies` set, and the gate now leads with them rather than with the
oldest footage — the gate being the only place a film plays without a
click.

**Four are deliberately not in the screening**, on the brief's own rule
that nothing the site shows carries text, a logo or a watermark over the
work:

| Clip | Why |
| --- | --- |
| `towers` | A tagline burnt into the frame: *"Every champion remembers where it began."* |
| `racket` | The flame mark composited into the top-right corner as a watermark. |
| `paper-villas` | A printed brochure on a step — marketing collateral, not a film frame, and the masthead is legible. |
| `skyline` | Monochrome stock businessman on a phone. A different project's register entirely. |

The files are still on disk; each is one line in `rooms.ts` and one entry
in `portfolio.ts` to restore if you disagree.

### Still worth cutting

These older `studies` clips are now visibly weaker than everything
around them, and I have left them in rather than cut further without
asking: `shadows`, `court`, `pitch`, `float`, `promenade`, `gate`,
`stadium`. Seven fewer films would raise the average a lot.

### The October 2026 set

42 files supplied; **33 are in**, in `public/images/moonnight/`. Converted
from PNG at 1600px long edge, q62 — about 10MB total, 300–600KB each.

They carry no `posterSmall`, because the only image tool on this machine
(`sips`) cannot write webp. If you want narrow-screen variants, generate
`-960.webp` files and add the field; `MediaFrame` already handles it.

**Nine were deliberately left out:**

| Files | Why |
| --- | --- |
| 5, 12, 21, 22, 24, 26 | Multi-up proposal boards, not single frames. A contact sheet in a gallery reads as a slide in a deck. (21 and 22 are also byte-identical duplicates.) |
| 35, 36 | Broken exports — a sliver of picture over black. |
| 15 | A child in a Lakers-branded kit. A third-party trademark, and an odd one in a green-and-gold estate kit. |

The old low-resolution `pool` frame was replaced by the better version of
the same shot (file 14).

### ⚠️ Two things to decide before this goes live

**The "N" flame mark is visible** on the clubhouse wall (`clubhouse.jpg`)
and on jerseys (`boy-kit`, `tennis`, `water-break`, `railing`). If that is
a client's identity, it conflicts with the rule that the portfolio shows
no client logos or brand names — and more importantly it suggests this is
**commissioned work**, in which case the footer line "All work here is
self-initiated concept work" is wrong and must change. Do not leave an
inaccurate disclosure up; either correct it or drop those frames.

`goal.jpg` also carries a legible name, "AARAV 10", on the back of a shirt.

### Where each still is used

## Deploy

### Node

```bash
npm run build
FORM_PROVIDER=resend RESEND_API_KEY=... ENQUIRY_FROM_EMAIL=... ENQUIRY_TO_EMAIL=... npm start
```

The server reads `.env` without overriding variables already set in the
environment, and sends `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options` and `Permissions-Policy`.

### Vercel

`vercel.json` and `api/enquiry.js` are included. Set the environment variables
in the project settings, including `VITE_SITE_URL` before building. Do not use
`FORM_PROVIDER=log` there; the filesystem is ephemeral. Rebuild after changing
`VITE_SITE_URL` so the sitemap and `robots.txt` pick up the domain.
