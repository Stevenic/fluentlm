Alright — I’m going to treat this like a **strategy alignment document**, not marketing copy. Clear, structured, and brutally explicit about capabilities and goals.

---

# I. Awarity CLI — Capability Summary

Awarity is a **local, deterministic reasoning engine** for large document corpora.

It is not a chatbot.
It is not retrieval.
It is not embeddings.

It is a structured system for **reading entire corpora and reasoning over them repeatably.**

---

## 1️⃣ Core Architecture

### Elastic Context Window (ECW)

Awarity’s central algorithm.

Two-phase process:

### Phase 1 — Reading & Note-Taking (Parallel)

* Splits documents into ~16k token chunks
* Processes chunks independently and in parallel
* Extracts only task-relevant information
* Produces structured notes

Properties:

* Deterministic
* Linear scaling
* No vector search
* No retrieval heuristics
* Avoids lost-in-the-middle effects

### Phase 2 — Inference (Synthesis)

* Assembles all notes into one context window
* Performs final reasoning over notes
* Produces answer, summary, classification, or extraction

These phases can be controlled independently:

* `--skip-inference`
* Hybrid models per phase

---

## 2️⃣ Catalog System

A catalog is:

* Filesystem-backed
* Explicitly created
* Fully inspectable

It contains:

* Chunked text files (`.txt.1`, `.txt.2`)
* Metadata sidecars (`.metadata`)
* Optional derived artifacts:

  * `.abstract`
  * classification CSVs
  * extraction outputs

Properties:

* No embeddings
* No vector DB
* Storage-heavy but transparent
* Reusable across workflows

---

## 3️⃣ Abstracts

Abstracts are:

* Cached, high-level semantic summaries
* Generated once per document
* Stored as sidecar files

They allow:

* Fast corpus-level reasoning
* Large-scale classification
* Broad topic exploration

Tradeoff:

* Lose fine-grained detail
* Gain speed and scale

---

## 4️⃣ Lenses

A lens is:

* A persistent instruction file
* Applied to every model call during ECW

It defines:

* What is relevant
* What to extract
* What to ignore
* Structure/schema expectations
* Domain-specific reasoning constraints

Lenses turn Awarity from:

> “Answer questions about text”

into:

> “Apply a specific way of thinking to an entire corpus.”

---

## 5️⃣ Models & Hybrid Models

Model alias system via `.awarity`.

Supports:

* Different models per phase
* Fast model for note-taking
* Strong model for synthesis

Hybrid benefits:

* Lower cost
* Better scaling
* Often improved reasoning quality
* Flexible provider mixing

---

## 6️⃣ Classification

Awarity classification:

* Assigns documents to predefined labels
* Uses explicit labels file
* Produces materialized CSV output
* Supports single-label and multi-label

Properties:

* Auditable
* Repeatable
* Deterministic
* Not hidden metadata

---

## 7️⃣ Hierarchical Classification

Workflow pattern:

1. Classify abstracts (broad)
2. Filter subset
3. Classify again with refined labels
4. Repeat

Classification output can be converted into:

`.list` files

Used with:

```
--catalog-filter
```

This allows scoped reasoning on subsets.

---

## 8️⃣ CLI Surface Area (Conceptual)

Major operations include:

* ingest
* generate-abstracts
* ask
* ask-abstracts
* classify
* classify-abstracts
* extract
* catalog filtering
* model selection
* lens application

Awarity is:

* Powerful
* Structured
* Scriptable
* Expert-oriented
* Low-level by default

---

# II. SynthOS — Capability Summary

SynthOS is a **local AI-powered application builder** built around conversation.

Its strengths are not reasoning scale — they are UX, orchestration, and developer empowerment.

---

## 1️⃣ Conversational App Building

Core loop:

```
Describe → AI writes code → App appears → Refine via chat
```

* HTML/CSS/JS apps
* Surgical edits (not full rewrites)
* Real-time update without reload
* All local

---

## 2️⃣ First-Run Guided Experience

* Model selection
* API key entry
* Immediate hands-on build
* No docs required

Strong onboarding pattern.

---

## 3️⃣ Local Persistence Model

Everything lives in `.synthos`:

* Apps are HTML files
* Fully inspectable
* Copyable
* Editable manually
* Deletable

Transparency-first.

---

## 4️⃣ Templates

Built-in starter structures:

* Application
* Two-panel
* Sidebar
* US Map
* Prebuilt apps

Templates reduce friction and cognitive load.

---

## 5️⃣ Themes

* Nebula Dusk (dark)
* Nebula Dawn (light)

Global styling with dynamic adaptation.

---

## 6️⃣ Built-in APIs

### Storage API

Local persistence without DB setup.

### AI Inside Apps

Apps can call LLMs via:

```
synthos.generate.completion()
```

### Custom Scripts

Apps can invoke shell scripts.
This is critical for Awarity integration.

### API Explorer

Interactive testing environment.

---

## 7️⃣ Connectors (28 services)

SynthOS abstracts:

* OAuth
* Credentials
* Proxying

Apps can call:

* GitHub
* Jira
* Airtable
* Twilio
* NASA
* etc.

Without authentication complexity.

---

## 8️⃣ Agents

Supports:

* A2A protocol
* OpenClaw WebSocket protocol

Apps can:

* Stream responses
* Maintain session state
* Communicate with external AI systems

---

## 9️⃣ UX Strengths

SynthOS excels at:

* Conversation as interface
* Progressive empowerment
* Visible artifacts
* Local-first design
* Visual interactivity
* Rapid iteration

It turns:
Non-programmers → App builders

---

# III. Strategic UX Project Goals

Now the important part.

What are we actually trying to do?

---

## 1️⃣ High-Level Goal

Use SynthOS as a UX layer for Awarity.

In other words:

> Turn Awarity from a CLI reasoning engine into an interactive reasoning environment.

---

## 2️⃣ Problem We’re Solving

Awarity is:

* Conceptually elegant
* Extremely powerful
* But cognitively heavy
* And CLI-centric

Users must understand:

* Catalogs
* Lenses
* Hybrid models
* Abstracts
* Classification workflow
* Filtering mechanics

That’s a lot.

---

## 3️⃣ UX Transformation Goal

Shift from:

> Command-driven reasoning

to:

> Goal-driven reasoning workflows

Instead of:

```
awarity classify ...
awarity ask ...
```

We want:

> “I want to find financial risk disclosures.”

And the system scaffolds:

* Ingest
* Abstract
* Classify
* Filter
* Refine
* Ask

---

## 4️⃣ Design Principles

### A. Preserve Awarity’s Philosophy

* No embeddings
* No hidden indexing
* No magic retrieval
* Keep determinism
* Keep materialized artifacts

### B. Hide Internal Mechanics by Default

* Chunking invisible
* ECW internal phases hidden
* Sidecars abstracted away

Expose only when user clicks “Advanced.”

---

### C. Make Structure Visible

Classification tables.
Workflow diagrams.
Catalog status.
Progress bars.

Make reasoning tangible.

---

### D. Treat Workflows as First-Class Artifacts

Users should be able to:

* Save workflows
* Re-run workflows
* Share workflows
* Inspect workflow YAML

Just like SynthOS apps.

---

### E. Bring Brainstorm Mode to Reasoning

Before heavy ECW runs:

* Suggest abstract-first
* Estimate cost
* Suggest hybrid models
* Suggest classification first

LLM as workflow advisor.

---

## 5️⃣ Concrete UX Outcomes

We want to create:

* Catalog Manager Page
* Explore (Ask) Page
* Classification Page
* Lens Builder
* Workflow Builder
* Execution Monitor
* Subset / Filter Manager

All powered by:
SynthOS scripts that call Awarity CLI.

---

## 6️⃣ The Deeper Vision

SynthOS turns:

> People into programmers.

Awarity UX should turn:

> Analysts into reasoning engineers.

The combined system becomes:

> A local, deterministic, large-scale reasoning workstation.

No embeddings.
No SaaS lock-in.
No opaque indexing.
Full transparency.
Workflow-driven reasoning.

---

# Final Summary

Awarity provides:

* Deterministic large-scale corpus reasoning
* Explicit structure (catalogs, abstracts, lenses, classification)
* Hybrid model control
* Hierarchical workflows

SynthOS provides:

* Conversational UX
* Script orchestration
* Local server UI
* Visual artifact management
* Progressive onboarding
* Powerful extensibility

The UX project goal is to:

* Marry Awarity’s structured reasoning engine
* With SynthOS’s conversational, guided, artifact-first interface
* To create a local reasoning studio
* Where users describe what they want to understand
* And workflows are scaffolded, visualized, and saved

If you’d like next, we can:

* Distill this into a product vision doc
* Or design the exact page map and navigation model for v1
* Or define the MVP scope very concretely
