# Video repository audit — Python Atelier and Pomegranate × Lily

Reviewed: 2026-10-17. Scope: ten programming repository recommendations from the founder-supplied video.

## Decision

Python Atelier is a **phone-first Pyodide coding workbench**, not a code search engine or an automatic package manager. Add a curated, locally authored study directory and context-specific reading links within existing CS50P practice, **not copied source code or unvetted live integrations**.

| Video project | Role in Atelier | Broader Pomegranate × Lily use | Priority |
| --- | --- | --- | --- |
| [freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp) | Free foundational study paired with Practice | General onboarding and developer skill-building | **Now** |
| [Free Programming Books](https://github.com/EbookFoundation/free-programming-books) | Find Python explanations and exercises | Technical reference for the company | **Now** |
| [Developer Roadmaps](https://roadmap.sh/python) | Python progression guide beyond the 5 Foundations challenges | Founder training and career development | **Now** |
| [Project-Based Learning](https://github.com/practical-tutorials/project-based-learning) | Small projects after guided challenges | POM feature prototyping; Packet Lily task flows | **Now** |
| [Public APIs](https://github.com/public-apis/public-apis) | Future JSON/HTTP/python data exercises | Evaluate *specific* APIs for POM only when needed | **Next**, not auto-call |
| [Awesome Python](https://github.com/vinta/awesome-python) | Research available libraries | POM tooling and evaluation inspiration | **Next**, dependency audit required |
| [Build Your Own X](https://github.com/codecrafters-io/build-your-own-x) | Advanced interpreter and systems learning | POM architecture education | **Later** |
| [System Design Primer](https://github.com/donnemartin/system-design-primer) | Advanced architecture, not beginner exercises | **High value** for POM request routing, Cloudflare fallbacks and rate limits; Packet Lily data flow and PDF generation | **Later in Atelier; high priority for app reviews** |
| [Coding Interview University](https://github.com/jwasham/coding-interview-university) | Structured interview preparation | Founder career goals, not immediate product features | **Later** |
| [Awesome](https://github.com/sindresorhus/awesome) | General index of specialized lists | Topic discovery across all products | **Later**, too broad to drive a practice curriculum |

## Applied improvements

1. Add **Resources** within `/app/` beside Workbench and Practice, with topic cards and one concrete Python task per link.
2. Prioritize beginner resources; keep intermediate/advanced resources behind category filters on narrow phone screens.
3. Give all five original CS50P Foundations challenges a relevant "Study beside this challenge" reference, without inserting answers into learners' work.
4. Keep links external with `target=_blank`, `rel=noopener noreferrer` and no referrer policy; there is **no** automatic GitHub repository fetching or third-party code execution.
5. Keep learner files, `input()`/console, Pyodide Worker, test grading, Seed ledger, Atelier Garden and storage formats untouched.
6. The resource list is editorial guidance. Links may change; no account, login, API key or paid service is required for Atelier's internal directory.

## Future project-specific recommendations (not implemented by this change)

**POM:** review architecture against System Design Primer principles: explicit trust boundary, timeouts, fallback states, independent evaluation runner, and observable error categories. No blanket dependency or API integration just because a repo is popular.

**Packet Lily:** use Project-Based Learning as a prototype library and System Design Primer concepts to test the chain **job details → proof/photos → invoice/payment status → single closeout PDF → follow-up queue**. Keep report data offline-first and minimize button presses. No automatic import of code or third-party API before user-value testing.

**Freedom Arkives / G-CAFL-QC:** Project-Based Learning for static publishing patterns, API catalogs only for rigorously validated market-data sources with provenance and contractual compliance. Repository star counts are **not** validation of data quality.

**Priority principle:** reading ten lists is not equivalent to producing ten features. The immediate win is easy access to targeted learning resources while coding on a phone.
