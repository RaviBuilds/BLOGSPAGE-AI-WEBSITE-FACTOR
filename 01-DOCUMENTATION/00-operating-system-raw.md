**PHASE 0 &mdash; FACTORY OPERATING SYSTEM**

This sits **before Phase 1**.

It governs the six phases.

Think of it like:

BLOGSPAGE AI FACTORY

&boxv;

PHASE 0 &mdash; CONTROL

&boxv;

&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxvh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;

&#9660; &#9660; &#9660;

INPUT / STATE AGENTS / RULES OUTPUTS

&boxv; &boxv; &boxv;

&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxvh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxul;

&#9660;

PHASE 1

&darr;

PHASE 2

&darr;

PHASE 3

&darr;

PHASE 4

&darr;

PHASE 5

&darr;

PHASE 6

&darr;

DELIVERY

This is the major improvement I would make.

**PHASE 0 &mdash; FACTORY OPERATING SYSTEM**

**0.1 Purpose**

Phase 0 defines **how the factory operates**, not how websites look.

It controls:

- project creation

- inputs

- file structure

- agent roles

- state

- handoffs

- approvals

- evidence

- versioning

- failure handling

- security

- environment isolation

- artifact generation

This is the layer that turns our six phases from a **design
methodology** into a **repeatable production workflow**.

**0.2 The Factory State Machine**

A project should have an explicit state.

NEW

&darr;

RESEARCHING

&darr;

RESEARCH_READY

&darr;

CREATIVE_DIRECTION

&darr;

BLUEPRINT_READY

&darr;

IMPLEMENTING

&darr;

BUILD_READY

&darr;

CRITIQUING

&darr;

REFINING

&darr;

APPROVED

&darr;

DELIVERED

There should also be failure states:

BLOCKED

NEEDS_HUMAN_REVIEW

NEEDS_CONTENT

NEEDS_ASSETS

NEEDS_CREDENTIALS

RETURN_TO_RESEARCH

RETURN_TO_BLUEPRINT

This is extremely important once you start running multiple businesses.

**0.3 Every Business Gets Its Own Workspace**

This prevents contamination between projects.

For example:

/businesses/

/abc-dental/

/fitcore-gym/

/royal-salon/

/restaurant-name/

Each project contains its own:

research

assets

brand

content

blueprint

build

critic

final

No business should share mutable content with another business.

**0.4 Standard Project Structure**

I would eventually use something approximately like:

business-name/

&boxv;

&boxvr;&boxh;&boxh; 00-input/

&boxv; &boxvr;&boxh;&boxh; urls.md

&boxv; &boxvr;&boxh;&boxh; client-notes.md

&boxv; &boxur;&boxh;&boxh; approvals.md

&boxv;

&boxvr;&boxh;&boxh; 01-research/

&boxv; &boxvr;&boxh;&boxh; research.md

&boxv; &boxvr;&boxh;&boxh; business.json

&boxv; &boxvr;&boxh;&boxh; reviews.json

&boxv; &boxvr;&boxh;&boxh; competitors.json

&boxv; &boxur;&boxh;&boxh; sources.json

&boxv;

&boxvr;&boxh;&boxh; 02-assets/

&boxv; &boxvr;&boxh;&boxh; assets.json

&boxv; &boxvr;&boxh;&boxh; approved/

&boxv; &boxvr;&boxh;&boxh; pending/

&boxv; &boxur;&boxh;&boxh; rejected/

&boxv;

&boxvr;&boxh;&boxh; 03-brand/

&boxv; &boxur;&boxh;&boxh; brand-profile.json

&boxv;

&boxvr;&boxh;&boxh; 04-blueprint/

&boxv; &boxvr;&boxh;&boxh; design-intent.md

&boxv; &boxvr;&boxh;&boxh; design-blueprint.json

&boxv; &boxur;&boxh;&boxh; composition-plan.json

&boxv;

&boxvr;&boxh;&boxh; 05-build/

&boxv; &boxvr;&boxh;&boxh; source/

&boxv; &boxur;&boxh;&boxh; implementation-report.md

&boxv;

&boxvr;&boxh;&boxh; 06-critic/

&boxv; &boxvr;&boxh;&boxh; critic-report.json

&boxv; &boxvr;&boxh;&boxh; critic-report.md

&boxv; &boxur;&boxh;&boxh; refinement-plan.json

&boxv;

&boxvr;&boxh;&boxh; 07-final/

&boxv; &boxur;&boxh;&boxh; final-report.md

&boxv;

&boxur;&boxh;&boxh; project.json

This becomes the **operational spine**.

**0.5 Agent Roles**

The six phases already imply roles, but we should formally define them.

**Research Agent**

Finds and structures business information.

**Creative Director**

Creates business-specific creative direction.

**Composition Designer**

Creates the page composition blueprint.

**Implementation Engineer**

Builds the website.

**Independent Critic**

Evaluates the result.

**Refinement Engineer**

Applies corrections.

We may use the same underlying model for some roles, but **the roles
remain logically separate**.

**0.6 Human Approval Gates**

This is another important missing layer.

You don't want automation everywhere.

I would have three major approval gates.

**Gate 1 &mdash; Business Research**

You approve:

&ldquo;Yes, this is an accurate understanding of the business.&rdquo;

**Gate 2 &mdash; Design Blueprint**

You approve:

&ldquo;Yes, this is the direction I want the website to take.&rdquo;

**Gate 3 &mdash; Final Website**

You approve:

&ldquo;Yes, this is ready to present/deliver.&rdquo;

Everything between those gates can increasingly become automated.

**0.7 Why This Matters for You**

You don't want to manually micromanage:

change this margin

move this image

change this section

make this button

You want to review at the **creative-director level**:

&ldquo;Yes, this is the right direction.&rdquo;

or:

&ldquo;No, this business needs something more
premium/energetic/editorial.&rdquo;

That's a much higher-leverage role for you.

**0.8 Evidence / Provenance Layer**

This is very important because your factory will research real
businesses.

Every factual item should eventually know:

fact

source

source type

confidence

verification status

Example:

{

"fact": "Google rating",

"value": "4.8",

"source": "Google Business Profile",

"status": "verified"

}

The research already emphasizes factual integrity and prohibits
fabricated reviews/statistics/credentials.

**0.9 Asset Approval System**

This is especially important for your original workflow.

We should distinguish:

DISCOVERED

&darr;

REVIEWED

&darr;

APPROVED

&darr;

USED

and:

DISCOVERED

&darr;

REJECTED

This prevents the implementation agent from casually using an image that
the research agent found but that you didn't want used.

The research also highlights that Google/social media media access has
policy and authorization considerations, so this separation is valuable.

**0.10 Human vs AI Ownership**

I would explicitly define:

|   **Decision**    | **AI**         | **You**         |
|:-----------------:|----------------|-----------------|
|     Research      | &#9989;        | Review          |
| Fact verification | &#9989;        | Final authority |
|  Design language  | &#9989;        | Approve         |
|    Composition    | &#9989;        | Approve         |
|      Coding       | &#9989;        | Review          |
|     Critique      | &#9989;        | Review          |
|  Final shipment   | Recommendation | &#9989;         |

That keeps you from becoming the bottleneck.

**0.11 Artifact Contracts**

Every phase should have a defined output.

For example:

Phase 1

&rarr; foundation.md

Phase 2

&rarr; design-languages.md

Phase 3

&rarr; composition-system.md

Phase 4

&rarr; design-blueprint.schema.json

Phase 5

&rarr; implementation rules

Phase 6

&rarr; critic schema

And every business run produces:

research.json

assets.json

blueprint.json

critic.json

This is how agents reliably communicate.

**0.12 Validation Gates**

Each phase needs an explicit gate.

For example:

Research

&rarr; Research Validation

Creative Direction

&rarr; Blueprint Validation

Implementation

&rarr; Build Validation

Critique

&rarr; Quality Validation

An agent shouldn't be allowed to blindly continue when the previous
output is incomplete.

**0.13 Failure Routing**

This is one of the most important operational improvements.

Suppose the critic says:

The design is beautiful,

but the business has insufficient imagery.

Don't just keep tweaking Phase 5 forever.

Route it:

Phase 6

&darr;

Asset problem

&darr;

Phase 0

&darr;

Needs Assets

Or:

Phase 6

&darr;

Blueprint problem

&darr;

Phase 4

Or:

Phase 6

&darr;

Implementation problem

&darr;

Phase 5

We already started defining this concept inside Phase 6; Phase 0 makes
it an official system-level behavior.

**0.14 Versioning**

This becomes critical once you have dozens of websites.

For example:

Design System

v1.0

Editorial Language

v1.2

Composition Library

v1.4

Critic

v1.1

And individual projects:

ABC Dental

Blueprint v1

Build v1

Critic v1

Refinement v2

Final v3

This lets you improve the factory without losing the history of previous
projects.

**0.15 Global vs Business-Specific Files**

We need a strict distinction:

FACTORY

contains:

rules

tokens

patterns

agent instructions

schemas

while:

BUSINESS

contains:

research

assets

content

brand

blueprint

website

critic

Never mix them casually.

**0.16 No Business Data in Factory Rules**

For example:

Bad:

design system says:

dental websites should use blue

Better:

design system says:

healthcare businesses prioritize trust

Then Business Intelligence decides whether blue is actually appropriate.

This preserves the flexibility we've worked hard to create.

**0.17 No Industry Templates**

This remains one of our strongest rules.

The factory can have:

industry heuristics

but not:

DentalTemplate.tsx

GymTemplate.tsx

SalonTemplate.tsx

Industry affects decision-making.

It does not determine final composition.

**0.18 The Complete Final Architecture**

After this improvement, our architecture becomes:

PHASE 0

FACTORY OPERATING SYSTEM

&boxv;

&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxvh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;

&#9660; &#9660; &#9660;

Inputs Agents State

&boxv; &boxv; &boxv;

&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxvh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxul;

&#9660;

PHASE 1

FOUNDATION

&darr;

PHASE 2

VISUAL LANGUAGES

&darr;

PHASE 3

COMPOSITION SYSTEM

&darr;

PHASE 4

CREATIVE DIRECTION

&darr;

PHASE 5

IMPLEMENTATION

&darr;

PHASE 6

CRITIC + REFINEMENT

&darr;

APPROVED

&darr;

DELIVERY
