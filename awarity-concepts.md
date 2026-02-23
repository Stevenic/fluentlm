stevenic/foundations: # Foundations

## Elastic Context Window (ECW)

The **Elastic Context Window (ECW)** is Awarity’s core reasoning algorithm for operating over large document corpora.

Instead of using embeddings, vector databases, or retrieval heuristics, ECW **reads every line of every document** in a catalog to answer a question or accomplish a goal.

ECW works in two logical phases:

1. **Reading & Note-Taking (Parallel Phase)**

   * Each document is split into ~16k-token chunks.
   * Every chunk is processed independently and in parallel.
   * The model extracts *only information relevant to the question or goal* and produces structured notes.
   * This avoids “lost-in-the-middle” issues and scales linearly with corpus size.

2. **Inference (Synthesis Phase)**

   * The collected notes are assembled into a single context window.
   * A final model call reasons over the notes to produce an answer, summary, or transformation.

These phases can be controlled independently:

* --skip-inference returns raw notes only
* Different models can be used per phase (“hybrid models”)

Conceptually, ECW behaves like a human researcher who reads an entire library, takes notes on what matters, and then writes an answer based on those notes — except it does so deterministically, in parallel, and at massive scale.

---

## Catalogs

A **catalog** is Awarity’s persistent, filesystem-backed representation of a document corpus.

A catalog contains:

* **Chunked text files**
  Each source document is split into ~16k-token text chunks (.txt.1, .txt.2, …) to enable parallel ECW processing.
* **Metadata sidecars**
  A single *.metadata file per source document stores provenance and ingest details (source URI, token counts, timestamps, etc.).
* **Optional derived artifacts**
  Additional sidecar files (e.g. .abstract) can be materialized to cache higher-level semantic representations.

Catalogs are:

* Explicitly created and updated via ingest
* Reusable across commands (ask, query, extract, ask-abstracts)
* Free of embeddings or vector indexes
* Designed to trade storage for **repeatability, transparency, and scale**

In short:
**Catalogs store the corpus. ECW is how Awarity thinks over it.**


Commit Merged...

stevenic/abstracts: Abstracts

Abstracts let you zoom out.

An abstract is a cached, high-level semantic summary of a single source document in a catalog. Abstracts are generated once and stored as sidecar files, allowing Awarity to reason over an entire corpus without rereading every document.

Instead of running ECW across all chunks of all files, Awarity can:

Generate one abstract per document (using ECW at the document level)

Answer questions by reasoning over only those abstracts

This makes it possible to:

Ask corpus-level questions quickly (“What are these papers about?”)

Reason over thousands of documents at once

Dramatically reduce cost and latency

Create a semantic index without embeddings or vector databases

Abstracts trade depth for breadth: they sacrifice fine-grained detail in exchange for speed, scale, and a global view of the corpus. They are the foundation for higher-level workflows like classification, routing, and large-scale triage.

Commit Merged...

## Lens

A **lens** is a persistent set of instructions that defines **how Awarity should interpret and reason over a corpus**.

In practice, a lens is provided via --context <file> and is applied uniformly across the entire Elastic Context Window (ECW) process:

* during chunk-level note-taking
* and again during final inference

### What a lens does

A lens does **not** change the data being read.
It changes **what Awarity is looking for** and **how it should understand what it finds**.

A lens can specify:

* what information is relevant
* what to extract or ignore
* how to structure results
* what rules, schemas, or templates to apply

### How it’s applied

* The lens is shown to **every model call**
* It sits alongside the user’s query or goal
* It augments the task rather than overriding it
* Conceptually, it is “passed over” the entire corpus

### Why lenses matter

Lenses turn Awarity from:

* “answer questions about text”

into:

* “apply this domain-specific way of thinking to an entire corpus”

They are the primary mechanism for:

* schema-driven extraction
* classification
* red-flag detection
* report generation
* repeatable, auditable workflows

### Intuition

If the corpus is a library:

* the **query** is the question you ask
* the **lens** is the perspective you bring (legal, financial, compliance, research)
* the **ECW** is the act of reading every book with that perspective in mind

In short:

> **A lens defines how Awarity looks; the ECW defines how far it looks.**

This concept becomes even more powerful once you introduce **classification** and **for-each**, because lenses can be reused, composed, and operationalized across large corpora.

Commit Merged...

## Models in Awarity

Models determine **how hard Awarity thinks** when reading, reasoning, and writing.

You select a model using --model <alias>, where the alias maps to a configuration in your .awarity file. This controls the balance between **speed, cost, and output quality** across the entire workflow.

### When to choose a different model

You typically change models when:

* **Output quality matters more than speed or cost**
  → choose a stronger model (e.g. best)
* **You’re doing fast, exploratory analysis**
  → a cheaper, faster model may be sufficient
* **The task is domain-specific** (e.g. coding, structured transformation)
  → use a specialized model configured for that purpose

Most users default to a balanced model and only switch when they have a clear reason to do so.

---

## Hybrid models

Awarity supports **hybrid models**, meaning different models can be used for different phases of the Elastic Context Window (ECW):

* A **fast, inexpensive model** is used for chunk-level reading and note-taking
* A **slower, more capable model** is used for final inference and synthesis

### Does reasoning quality degrade with hybrid models?

In practice, **we observe the opposite**.

Hybrid models are not only faster and cheaper — they often **improve reasoning quality**. This is a side effect of how ECW works:

* The note-taking phase benefits from speed and coverage, not deep reasoning
* Using a fast model allows ECW to extract more complete, less filtered notes across the entire corpus
* The final inference model then reasons over a **clean, focused set of notes**, rather than raw text

This separation mirrors how humans work: skimming broadly first, then thinking deeply once the relevant information is gathered.

### Benefits of hybrid models

* Lower cost for large catalogs
* Faster end-to-end execution
* Better scaling as corpora grow
* Equal or improved reasoning quality
* Flexibility to mix models (and even providers) per phase

In short:

> **Hybrid models let Awarity read quickly, then think carefully —
> and ECW works better when those concerns are separated.**

Commit Merged...

## Classification & Hierarchical Classification

### Classification

**Classification** in Awarity assigns each document in a catalog to **zero or more predefined labels**, based on a user-defined task.

You provide:

* a **task** (how the labels should be applied)
* a **labels file** (the allowed labels and their meanings)
* a **catalog**

Awarity then reasons over each document (or its abstract) and produces a **CSV file** mapping documents to labels.

Key characteristics:

* Labels are **explicit and controlled** (not inferred)
* Output is **materialized** (CSV, not hidden metadata)
* Classification can be:

  * single-label (default)
  * multi-label (--allow-multi)

This makes classification:

* auditable
* repeatable
* easy to inspect and refine

---

### Abstract-based classification

For large catalogs, you can use **classify-abstracts** to classify documents based on their abstracts instead of full text.

This:

* dramatically reduces runtime and cost
* preserves high-level intent and topic
* is ideal for first-pass routing and triage

Abstract-based classification trades depth for speed, and is usually “good enough” to decide **where to look next**.

---

### Hierarchical classification

Classification is designed to be **multi-stage**, not one-shot.

A typical workflow looks like:

1. **Broad first pass**

   * Use classify-abstracts
   * Apply coarse labels (e.g. document type, domain)
2. **Filter results**

   * Open the CSV in Excel or another tool
   * Filter by one or more labels
   * Export the relevant document IDs or URIs
3. **Refine**

   * Run classify again on the filtered subset
   * Use a new labels file with more specific categories

Each pass:

* operates on fewer documents
* uses more targeted labels
* produces higher-quality structure

This enables **hierarchical classification**, where understanding becomes more precise as scope narrows.

---

### Using classification to filter reasoning

Classification becomes actionable when combined with **catalog filtering**.

From a classification CSV:

* Extract document IDs or URIs
* Save them to a .list file (same format as ingest -l)

You can then scope any command using:


bash
--catalog-filter filter.list


This allows you to:

* run ask over only a subset of documents
* use ask-abstracts on just the relevant files
* apply extract or other workflows selectively

Instead of re-reading the entire catalog every time, Awarity:

* reasons **only where it matters**
* avoids rediscovering known structure

---

### Putting it all together

* **Abstracts** let you zoom out
* **Classification** turns understanding into structure
* **Hierarchical classification** refines that structure iteratively
* **Catalog filters** turn structure back into focused reasoning

In practice:

> You read broadly, label coarsely, filter aggressively,
> then reason deeply only on the documents that matter.

This is how Awarity scales reasoning across very large corpora without embeddings or vector databases.