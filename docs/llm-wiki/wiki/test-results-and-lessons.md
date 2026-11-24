---
title: Test Results and Lessons
summary: Verified catalog-search results, specification defects, fixes, and unverified extension work.
sources:
  - raw/test-log.txt
  - raw/001-spec-snapshot.md
  - raw/changes-snapshot.md
  - raw/004-spec-snapshot.md
---

# Test Results and Lessons

## Verified test run

- Vitest 5.0.5 reported 8 passed test files and 9 passed tests, with no failures, in 3.21 seconds.
  Source: `docs/llm-wiki/raw/test-log.txt`.
- The run included dedicated files for AC-SEARCH-01 through AC-SEARCH-06 and AC-SEARCH-10, plus
  two tests in `test/index.spec.ts`. Source: `docs/llm-wiki/raw/test-log.txt`.
- The log proves those test files passed, but it does not include assertion bodies; exact assertion
  coverage beyond the filenames is **Not verified** from the raw test log alone. Source:
  `docs/llm-wiki/raw/test-log.txt`.

## Defects and lessons

- CHG-001 arose because surrounding spaces changed search results. The approved requirement trims
  leading and trailing whitespace, and the matching AC-SEARCH-06 test file passed in the ingested
  run. Source: `docs/llm-wiki/raw/changes-snapshot.md`,
  `docs/llm-wiki/raw/001-spec-snapshot.md`, and `docs/llm-wiki/raw/test-log.txt`.
- CHG-002 arose because a spaces-only query became an empty search pattern and returned HTTP 200
  with books. The approved requirement treats post-trim emptiness as HTTP 400 `EMPTY_QUERY`, and
  the AC-SEARCH-10 test file passed in the ingested run. Source:
  `docs/llm-wiki/raw/changes-snapshot.md`, `docs/llm-wiki/raw/001-spec-snapshot.md`, and
  `docs/llm-wiki/raw/test-log.txt`.
- Lesson: normalize input before emptiness validation when normalized emptiness is governed by the
  same contract as a truly empty value. Source: `docs/llm-wiki/raw/changes-snapshot.md`.
- Lesson: a change request should update the specification before implementation and add a focused
  regression test. Source: `docs/llm-wiki/raw/changes-snapshot.md` and
  `docs/llm-wiki/raw/test-log.txt`.

## Not verified

- Constraint rejection for primary keys, foreign keys, UNIQUE rules, and CHECK rules is **Not
  verified** by `test-log.txt`; the migration defines the constraints, but no constraint-test
  output is present in the ingested log. Source: `docs/llm-wiki/raw/migration-0001.sql` and
  `docs/llm-wiki/raw/test-log.txt`.
- Personalized-learning prerequisite ordering, deduplication, existing-book enforcement,
  self-prerequisite rejection, and cycle rejection are **Not verified** because the ingested test
  log contains no personalized-learning tests. Source: `docs/llm-wiki/raw/004-spec-snapshot.md`
  and `docs/llm-wiki/raw/test-log.txt`.
- The personalized-learning two-second success target is **Not verified**. Source:
  `docs/llm-wiki/raw/004-spec-snapshot.md` and `docs/llm-wiki/raw/test-log.txt`.

See also [[design-decisions|Design Decisions]].
