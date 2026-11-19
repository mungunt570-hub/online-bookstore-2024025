# Online Bookstore LLM-Wiki Rules

## Sources
- Treat raw/ as read-only evidence.
- specs/ in the repository is the approved requirement source.
- Cite the source file path for every technical claim.
- Mark missing evidence as "Not verified". Never invent results.

## Pages
- wiki/index.md: topic index with one-line summaries
- wiki/log.md: append-only history of every operation
- wiki/design-decisions.md: data model, constraints, API decisions and why
- wiki/test-results-and-lessons.md: real results, defects, fixes, retests

## Allowed changes
- Create and update files under wiki/ only.
- Never change raw/, specs/, src/, migrations/, tests/, or docs/*.md.

## Operations
- Ingest: read new raw/ files, update pages, update index.md, append to log.md.
- Query: answer from wiki pages and name the supporting sources.
- Lint: report contradictions, outdated statements, missing evidence, broken links.