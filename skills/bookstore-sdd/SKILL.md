---
name: bookstore-sdd
description: Run spec-anchored SDD for the Online Bookstore capstone with Spec Kit skills, real tests, and student approval.
---

# Online Bookstore SDD

## Repository
- The workspace root is the repository. Run every command from the workspace root.

## Source of truth
- specs/<feature>/spec.md is the only approved requirement source.
- .specify/memory/constitution.md holds the project principles.
- docs/llm-wiki/ holds knowledge notes, never requirements.

## Workflow (one small feature at a time)
1. Identify the feature and its spec folder.
2. New feature: use speckit-specify. Existing feature: read spec.md first.
3. List ambiguities as questions. Never assume missing behavior.
4. Propose spec changes as a diff. Write them only after the student says "approve".
5. Run speckit-plan, then speckit-tasks. Show tasks.md and wait for approval.
6. Run speckit-implement for the approved tasks only.
7. Run the real tests: npx vitest run. Run SQL with wrangler d1 execute --local.
8. Compare every result with its acceptance criterion.
9. If a test reveals a missing rule, stop and propose a spec change (CHG-xxx in docs/changes.md).
10. Run speckit-converge before each Review.
11. Report changed files, commands run, real output, and unmet criteria.

## Write permissions
- May write: specs/ (after approval), src/, migrations/, tests/, sql/seed.sql.
- Wiki tasks may write only docs/llm-wiki/wiki/, following docs/llm-wiki/WIKI-RULES.md.
- Never write: docs/llm-wiki/raw/, .agents/skills/, skills/, AGENTS.md, docs/reviews.md, docs/reflection.md.

## Never
- Never invent test results or SQL output.
- Never run wrangler deploy or remote D1 migrations. Ask the student to run them.
- Never print or commit secrets (.dev.vars, API tokens).
- Never delete data or files without approval.
- Never use real payment information.

## Done
A task is done only when the student approves its spec, code, and test evidence.