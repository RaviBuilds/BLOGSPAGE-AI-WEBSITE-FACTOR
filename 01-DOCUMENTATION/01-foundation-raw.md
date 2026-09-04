**Blogspage AI Design System V1**

**Phase 1 &mdash; FOUNDATION**

I would define the Foundation as:

**The rules that every Blogspage website must obey, while deliberately
leaving enough freedom for the AI to create unexpected, art-directed
compositions.**

So Foundation is **not**:

Every site uses:

12px radius

same spacing

same buttons

same cards

same section width

same hero

That would create the exact template problem we are trying to avoid.

Instead:

FOUNDATION

&boxv;

&boxvr;&boxh;&boxh; Technical consistency

&boxvr;&boxh;&boxh; UX consistency

&boxvr;&boxh;&boxh; Accessibility

&boxvr;&boxh;&boxh; Responsive behavior

&boxvr;&boxh;&boxh; Quality constraints

&boxv;

&boxur;&boxh;&boxh; Creative freedom

&darr;

Design Language

&darr;

Business Personality

&darr;

Unique Composition

**01. Foundation Philosophy**

These become the **constitution** of the system.

**Rule 01 &mdash; Foundation is a constraint system, not a visual
template**

The Foundation defines what is **allowed, required, and forbidden**, but
it should not prescribe exactly how a page must look.

The research makes the same distinction between a rigid template, a
component library, and a design system.

**Rule 02 &mdash; Creativity is a first-class requirement**

The AI must be allowed to:

- break symmetry

- create unusual compositions

- overlap elements

- vary section heights

- create unexpected whitespace

- use editorial cropping

- combine different content densities

- create visual tension

- introduce asymmetry

- create immersive moments

- vary section rhythm

**Provided that usability, accessibility, hierarchy and conversion are
preserved.**

This is an important addition to the research: I would make creativity
an explicit system requirement rather than leaving it as an accidental
outcome.

**Rule 03 &mdash; Don't optimize every section for efficiency**

A premium website does not need every section to be maximally dense.

Sometimes the right design decision is:

ONE IMAGE

\+

ONE SENTENCE

\+

MASSIVE WHITESPACE

rather than:

IMAGE

HEADING

PARAGRAPH

3 FEATURES

2 BUTTONS

BADGE

STAT

The research specifically emphasizes that a premium website is defined
partly by **what it omits**.

**Rule 04 &mdash; Content determines composition**

The design should respond to the content available.

For example:

3 services

&rarr; large visual treatment

7 services

&rarr; structured grid

20+ treatments

&rarr; categorized/accordion architecture

The research explicitly recommends adapting the presentation according
to content volume.

**Rule 05 &mdash; Real business identity beats design-system identity**

The website should feel like:

**&ldquo;This is XYZ Dental Clinic.&rdquo;**

not:

**&ldquo;This is a Blogspage website.&rdquo;**

Blogspage's signature should be **quality and craftsmanship**, not an
obvious repeated visual template.

**02. Foundation Architecture**

I recommend three layers.

GLOBAL FOUNDATION

&darr;

DESIGN LANGUAGE

&darr;

BUSINESS BRAND

**Layer A &mdash; Global**

Never changes fundamentally.

Examples:

- Accessibility

- Responsive mechanics

- Grid primitives

- Containers

- Interaction behavior

- semantic HTML

- form behavior

- focus states

- image performance

- motion safety

- baseline typography mechanics

**Layer B &mdash; Design Language**

Changes substantially.

Examples:

- typography personality

- spacing rhythm

- corner language

- border language

- grid behavior

- motion character

- image treatment

- visual density

The research explicitly recommends this separation.

**Layer C &mdash; Business**

Unique to every client.

Examples:

- brand colors

- imagery

- logo

- business information

- content hierarchy

- CTA

- image ratios

- business tone

- local information

**03. Layout Foundation**

This is probably the most important part.

We should **not** create one universal page grid and force everything
into it.

Instead we'll create a **layout grammar**.

**Core primitives**

Container

Grid

Stack

Cluster

Split

Sidebar

Frame

Bleed

Overlay

Layer

Rail

Stage

Think of these as design vocabulary rather than sections.

For example:

Grid

can become:

2 columns

3 columns

5 columns

asymmetric columns

12-column editorial grid

full bleed

nested grid

**Full-bleed capability**

Every major visual element should be capable of breaking outside the
standard content container.

Example:

&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;

&boxv; &boxv;

&boxv; TEXT
&boxv;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&boxv;
&boxv;

&boxv; &boxv; IMAGE &boxv; &boxv;

&boxv;
&boxv;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&block;&boxv;
&boxv;

&boxv; &boxv;

&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxul;

rather than making every element:

&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;

&boxv; content container &boxv;

&boxv; &boxv;

&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxul;

This is one of the main tools we'll use to create bespoke compositions.

The research specifically highlights asymmetric/overlapping layouts as a
way to break predictable block layouts and create a bespoke feel.

**04. Container System**

We should not use:

max-width: 1200px

everywhere.

Instead:

**Standard content**

Approximately:

70&ndash;80rem

**Wide content**

Approximately:

85&ndash;95rem

**Cinematic content**

Approximately:

100rem+

**Full bleed**

100vw

But these aren't hard visual numbers yet. They become tokens that each
design language can reinterpret.

This allows:

**Swiss**

tight controlled container

while:

**Architectural**

edge-to-edge

while:

**Editorial**

asymmetric wide composition

without rewriting the underlying system.

**05. Grid System**

The research specifically points toward CSS Grid, Subgrid and Container
Queries for responsive composition.

So Foundation V1 should support:

**Base grid**

12-column desktop grid

but **do not assume every section uses all 12 columns**.

Possible compositions:

6 / 6

7 / 5

5 / 7

8 / 4

4 / 8

3 / 6 / 3

2 / 7 / 3

1 / 5 / 6

And deliberately:

offset left

offset right

overlap

bleed

This gives the AI a much richer visual vocabulary.

**06. Spacing Foundation**

Spacing should be systematic, but **rhythm should not be uniform**.

Instead of every section:

120px

120px

120px

120px

the AI should be able to create:

48px

160px

96px

240px

72px

180px

depending on narrative importance.

We'll therefore separate:

**Spacing scale**

Mathematical system.

from:

**Spacing rhythm**

Creative composition.

Example:

Foundation:

8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128 / 160 / 192

But a design language controls **how aggressively those values are
used**.

Editorial:

96 &rarr; 160 &rarr; 192

Bold:

32 &rarr; 48 &rarr; 64

Swiss:

48 &rarr; 64 &rarr; 80

This is how we maintain consistency without sameness.

**07. Typography Foundation**

Typography is one of our biggest creativity levers.

The research strongly recommends fluid typography using clamp() and
emphasizes readable line lengths and appropriate contrast.

Foundation should therefore define:

**Required roles**

Display

H1

H2

H3

H4

Body

Small

Label

Eyebrow

Navigation

Button

Metadata

Caption

But **not the actual font personality**.

That's Design Language territory.

So:

Foundation says:

H1 must scale fluidly.

Editorial says:

H1 = elegant serif.

Bold says:

H1 = heavy condensed sans.

Swiss says:

H1 = precise grotesque.

Architectural says:

H1 = wide modern sans.

**Fluid type**

Use a system based around:

clamp()

rather than:

desktop 72px

tablet 60px

mobile 48px

This gives much smoother scaling.

**08. Reading Width**

This becomes a hard Foundation rule.

Long paragraphs should not stretch across an enormous screen.

Target:

~65&ndash;75 characters per line

The research explicitly recommends this range for reading rhythm.

So the system should have:

.prose

.prose-narrow

.prose-wide

rather than allowing arbitrary paragraph widths.

**09. Image Foundation**

This is going to be **extremely important for your business workflow**
because you intend to feed the AI real images from the business.

The research emphasizes authentic business photography and deliberate
cropping rather than generic stock imagery.

The Foundation should support:

1:1

4:5

3:4

4:3

16:9

21:9

portrait

landscape

full bleed

masked

cropped

object-positioned

But again:

**Foundation provides image capability.**

Design Language chooses how aggressively to use it.

**10. Image Quality Rules**

The AI should ask:

Do we have enough authentic imagery?

**If YES**

Use image-led design.

**If SOME**

Use image selectively.

**If POOR**

Reduce image dependence.

The research explicitly says poor photography should cause the system to
pivot toward typography-led layouts rather than falling back to generic
stock or AI-generated faces.

That should become a hard rule.

**11. Shape Foundation**

This is where we need to be careful.

Do **not** establish:

Everything rounded 16px

Instead provide a range:

sharp

subtle

soft

rounded

organic

Design Language controls the default.

For example:

Swiss

&rarr; sharp/subtle

Editorial

&rarr; refined/subtle

Soft Premium

&rarr; softer/organic

Bold

&rarr; sharp/high contrast

Architectural

&rarr; very sharp

This supports the research's distinction between
design-language-specific radius and shape language.

**12. Borders and Depth**

Foundation should support three depth mechanisms:

Structure

Color

Elevation

And we should prefer:

borders

background shifts

overlap

scale

layering

before heavy shadows.

The research explicitly warns against excessive shadows and recommends
structural borders, subtle fills and very restrained shadows instead.

**13. Motion Foundation**

This is another area where we **want creativity but not chaos**.

Foundation provides:

fade

slide

reveal

scale

mask

clip

parallax

stagger

marquee

sticky

But motion must obey:

purpose \> decoration

Every animation should communicate one of:

- hierarchy

- transition

- interaction

- feedback

- storytelling

Not simply:

&ldquo;Because AI can animate it.&rdquo;

The research supports high-fidelity interaction with subtle
micro-interactions rather than overwhelming animation.

**14. Motion Intensity**

This becomes a Foundation parameter:

motionIntensity:

0 = almost none

1 = subtle

2 = expressive

3 = cinematic

The Design Language chooses the default.

Business context can override it.

Example:

Dental:

1

Luxury Salon:

1&ndash;2

Restaurant:

2

Gym:

2&ndash;3

That gives our future AI Design Engine something it can reason about.

**15. Responsive Foundation**

Very important:

**Mobile is not a smaller desktop.**

The research explicitly says the AI should not simply compress desktop
layouts but explicitly restack content for touch interaction.

So every component/pattern needs:

Desktop composition

Tablet composition

Mobile composition

not:

Desktop

&darr;

shrunk

For example:

Desktop:

Image overlaps text

Mobile:

Image

&darr;

Heading

&darr;

CTA

rather than a broken overlap.

**16. Mobile Creative Rules**

Mobile should actually be treated as another **creative canvas**.

The AI can change:

- section ordering

- crop

- image ratio

- navigation

- card arrangement

- typography

- CTA behavior

- sticky controls

This is especially important because the system is intended for local
businesses, where mobile actions are critical.

The research recommends persistent mobile conversion actions such as
Call or Book.

**17. Interaction Foundation**

Every interactive element must support:

default

hover

active

focus

disabled

loading

success

error

And visible :focus-visible states.

The research specifically identifies visible focus states and minimum
interactive-target requirements as Foundation-level accessibility rules.

**18. Accessibility Foundation**

These are **non-negotiable**.

The visual AI is allowed to be creative.

It is **not** allowed to be creative with accessibility requirements.

Foundation includes:

semantic HTML

keyboard navigation

focus-visible

contrast validation

accessible forms

reduced motion support

alt text

touch target requirements

screen-reader compatibility

The research recommends WCAG 2.2 AA contrast and explicit
focus/target-size handling.

**19. Content Foundation**

This is something I want to add strongly to the system.

The design system should distinguish:

CONTENT TRUTH

from:

DESIGN CREATIVITY

The AI is free to creatively present facts.

It is **not** free to creatively invent facts.

So:

Verified

Inferred

Unknown

become content states.

No invented:

patients served

years of experience

awards

ratings

testimonials

credentials

statistics

The research makes this a hard rule.

**20. Conversion Foundation**

We should establish universal conversion principles without prescribing
identical CTAs.

Every website needs an identifiable:

Primary conversion action

Secondary conversion action

Utility action

For example:

**Dental**

Primary &rarr; Book Consultation

Secondary &rarr; WhatsApp

Utility &rarr; Call

**Gym**

Primary &rarr; Start Free Trial

Secondary &rarr; WhatsApp

Utility &rarr; Directions

**Restaurant**

Primary &rarr; Reserve Table

Secondary &rarr; View Menu

Utility &rarr; Directions

The research explicitly argues that CTA strategy should adapt to
business type rather than using a generic contact pattern.

**21. Navigation Foundation**

Navigation must provide access to:

Brand

Primary destination links

Primary CTA

but the visual treatment is controlled by the Design Language.

Possible implementations:

minimal nav

transparent nav

floating nav

sticky nav

edge nav

compact nav

overlay nav

So again:

**Foundation defines functionality.**

**Design Language defines expression.**

**22. Creative Freedom Layer**

This is the most important part I'm adding for your stated goal.

We should explicitly create a **Creative Freedom Layer** above the
Foundation.

The AI is allowed to vary:

Section height

Section order

Grid proportions

Image scale

Image cropping

Whitespace

Alignment

Overlap

Content density

Typography scale

Visual anchors

Background transitions

Interaction density

Scroll rhythm

The AI should ask:

**&ldquo;What is the most visually compelling composition for this
content?&rdquo;**

not:

**&ldquo;Which standard component do I insert here?&rdquo;**

This is directly consistent with the research's **Composition over
Configuration** principle.

**23. The "Creative Budget"**

I think this can become a very useful concept for our AI system.

Every website receives a:

CREATIVE BUDGET

based on the business.

Example:

Dental

Creative Budget: 5/10

Gym

Creative Budget: 8/10

Luxury Restaurant

Creative Budget: 9/10

Traditional Accountant

Creative Budget: 4/10

This does **not** mean:

&ldquo;Dental = boring.&rdquo;

It means:

Creativity must respect the emotional psychology of the customer.

The research warns against cross-pollinating aggressive gym aesthetics
into dental or burying restaurant conversion actions behind immersive
storytelling.

This concept will become very powerful later.

**24. Foundation Anti-Patterns**

Regardless of Design Language, the system should reject:

&#10060; Same centered hero everywhere

&#10060; Automatic 3-card feature grid

&#10060; Every card rounded

&#10060; Every section same height

&#10060; Every section same background

&#10060; Image-left/text-right &rarr; text-left/image-right repetition

&#10060; Generic gradients

&#10060; Excessive pills

&#10060; Excessive shadows

&#10060; Fake statistics

&#10060; Fake testimonials

&#10060; Decorative animation everywhere

&#10060; Desktop simply shrunk for mobile

These are already strongly supported by the research.

**25. Foundation Token Architecture**

At the implementation level, I recommend:

tokens/

&boxv;

&boxvr;&boxh;&boxh; primitives

&boxv; &boxvr;&boxh;&boxh; color

&boxv; &boxvr;&boxh;&boxh; spacing

&boxv; &boxvr;&boxh;&boxh; type

&boxv; &boxvr;&boxh;&boxh; radius

&boxv; &boxvr;&boxh;&boxh; shadow

&boxv; &boxvr;&boxh;&boxh; motion

&boxv; &boxur;&boxh;&boxh; sizing

&boxv;

&boxvr;&boxh;&boxh; semantic

&boxv; &boxvr;&boxh;&boxh; background

&boxv; &boxvr;&boxh;&boxh; foreground

&boxv; &boxvr;&boxh;&boxh; muted

&boxv; &boxvr;&boxh;&boxh; border

&boxv; &boxvr;&boxh;&boxh; accent

&boxv; &boxvr;&boxh;&boxh; destructive

&boxv; &boxur;&boxh;&boxh; focus

&boxv;

&boxvr;&boxh;&boxh; language/

&boxv; &boxvr;&boxh;&boxh; editorial

&boxv; &boxvr;&boxh;&boxh; swiss

&boxv; &boxvr;&boxh;&boxh; bold

&boxv; &boxvr;&boxh;&boxh; soft

&boxv; &boxur;&boxh;&boxh; architectural

&boxv;

&boxur;&boxh;&boxh; business/

&boxvr;&boxh;&boxh; brand

&boxvr;&boxh;&boxh; imagery

&boxvr;&boxh;&boxh; content

&boxur;&boxh;&boxh; conversion

This follows the three-tier thinking in the research: global foundation,
design-language-specific tokens, and business-specific tokens.

**26. The Foundation in One Diagram**

This is the architecture I want us to build toward:

BLOGSPAGE FOUNDATION

&boxv;

&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxvh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;

&boxv; &boxv; &boxv;

&#9660; &#9660; &#9660;

STRUCTURE QUALITY CREATIVITY

&boxv; &boxv; &boxv;

Grid A11y Asymmetry

Container Contrast Overlap

Spacing UX Scale

Responsive Performance Cropping

Layout primitives Semantics Rhythm

&boxv; &boxv; &boxv;

&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxvh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxul;

&#9660;

DESIGN LANGUAGE

&boxv;

&#9660;

BUSINESS BRAND

&boxv;

&#9660;

AI CREATIVE COMPOSITION

&boxv;

&#9660;

UNIQUE PREMIUM WEBSITE

That last box is the whole reason we're building this system.

**My proposed Foundation V1 specification**

I would now lock these **12 Foundation modules**:

| **\#** | **Foundation module**                 |
|:------:|---------------------------------------|
|   01   | Principles & creative philosophy      |
|   02   | Grid & layout primitives              |
|   03   | Containers & responsive mechanics     |
|   04   | Spacing & rhythm                      |
|   05   | Typography mechanics                  |
|   06   | Color/token architecture              |
|   07   | Shape, borders & depth                |
|   08   | Image & media system                  |
|   09   | Motion & interaction                  |
|   10   | Accessibility                         |
|   11   | Conversion & content rules            |
|   12   | Creative freedom + anti-pattern rules |

Then **Phase 2** will sit on top of this and define the personality of
the five languages.

One thing I particularly like in the research is that it doesn't just
say &ldquo;use reusable components&rdquo;; it specifically says the
system should be **composition-driven**, with the AI choosing design
language, section sequence and layout primitive according to the
business.

That is exactly the direction I recommend we preserve.

**One correction I'd make to the research's five-language plan**

I would **not yet consider the five languages final** just because
Gemini recommended them. Its five are a strong starting point, but
before we lock them, we should make sure each has a genuinely different
**composition philosophy**, not merely a different font/color
combination.
