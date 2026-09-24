---
name: analyze-jira-ticket
description: Analyze a PetDB Jira ticket (project PET) with its parent and merged sibling tickets, pull the GitHub diffs of those merged siblings, and turn it all into a structured work spec with acceptance criteria. Use when starting work from a Jira ticket, when given a PET-123 style key, or as the analysis phase of the ship-ticket workflow.
---

# Analyze a Jira ticket (with parent + merged siblings) into a work spec

Analyze a PetDB Jira ticket into a clear, actionable work spec. Gather surrounding
context — the parent ticket and any already-merged sibling tickets, plus the
GitHub diffs of those siblings — so the plan and implementation follow the patterns
of related merged work.

## PetDB references

- **Jira cloud ID:** `b70198dd-9e12-4d1c-a71f-ddc01cfe334a` (pass as `cloudId` on every Atlassian call)
- **Jira site:** https://lynzlebaldelomar.atlassian.net
- **Jira project key:** `PET`
- **GitHub repo:** `lynzleb/PetDB`

## Steps

1. **Resolve the ticket key.** Accept a key like `PET-123`, a full Jira URL, or a
   plain number (prefix with `PET-`). If none was given, ask which ticket.
2. **Fetch the ticket.** Use `getJiraIssue` with the cloud ID above and
   `view: "full"` so you get the description and fields. If it fails, fall back to
   `searchJiraIssuesUsingJql` with `jql: "key = PET-123"`.
3. **Read comments if the description is thin.** Use `listJiraIssueComments` (via
   the execute/discover tools) to catch clarifications and acceptance criteria that
   live in comments.
4. **Fetch the parent ticket.** If this ticket is a sub-task or has a parent
   (check the `parent` field, or use `getJiraIssue` method `get_parent`), fetch the
   parent with `view: "full"`. Capture the parent's goal so this ticket is framed
   within the larger effort.
5. **Find merged sibling tickets.** Siblings are the other children under the same
   parent. List them (e.g. `getJiraIssue` method `get_sub_issues` on the parent, or
   `searchJiraIssuesUsingJql` with `jql: "parent = <PARENT-KEY> AND key != PET-123"`).
   Keep the ones that are **merged/done** — status Done/Closed, or with a merged PR.
6. **Pull the GitHub diffs of merged siblings.** For each merged sibling, find its
   pull request on `lynzleb/PetDB` and fetch the diff:
   - Resolve the PR: prefer the PR link on the Jira ticket (dev-status/remote link
     or a PR URL in comments). Otherwise search GitHub —
     `search_pull_requests` with `query: "PET-123 in:title"` (matching the sibling
     key), or `list_pull_requests` filtered to merged.
   - Fetch the diff with `pull_request_read` method `get_diff` (fall back to
     `get_files` for large PRs). Skim for the files touched, patterns used, and
     conventions to reuse. Note the sibling key → PR number → key files.
   - If a sibling has no discoverable PR, note that and move on; don't block.
7. **Produce the work spec.** Output this structure:
   - **Ticket:** key + summary + issue type + current status
   - **Parent:** key + summary + one-line goal (or "none")
   - **Merged siblings:** list of `KEY — summary — PR #N` with a one-line takeaway
     from each diff (pattern/files to mirror). "none found" if there are none.
   - **Goal:** one or two sentences on what to build/fix
   - **Acceptance criteria:** a checklist. If the ticket lists them, use them
     verbatim. If not, infer them from the description and mark them `(inferred)`.
   - **Scope hints:** which part of the repo is affected — `backend/`
     (Fastify + Prisma API), `frontend/` (React + Vite), or both. Ground these in
     the sibling diffs where possible.
   - **Verification path:** decide `unit` vs `chrome` vs `both`:
     - backend logic / API / data changes → **unit**
     - UI / frontend behavior a user sees → **chrome**
     - full features touching both → **both**
8. **Confirm ambiguity only when it blocks work.** If acceptance criteria are
   genuinely unclear, ask one focused question; otherwise proceed with inferred
   criteria clearly marked.

## Output

End with the work spec in the chat so it can be handed to the `plan-ticket` phase.
Keep it concise and skimmable — summarize sibling diffs as takeaways, don't paste
full patches.
