---
name: open-pr
description: Open a GitHub pull request (a.k.a. merge request / MR) for a verified PetDB change - branch, commit, push, and create the PR linked to its Jira ticket. Use after a change is verified, or as the final phase of the ship-ticket workflow.
---

# Open the PR (GitHub pull request)

Package a verified change into a pull request. This repo is hosted on **GitHub**
(`github.com/lynzleb/PetDB`), so a "merge request" / "MR" here means a GitHub PR.
Only run this after verification is green.

## Preconditions

- Verification passed (`verify-unit` and/or `verify-chrome`).
- You know the Jira ticket key (e.g. `PET-123`) to reference in the branch and PR.

## Steps

1. **Branch.** Create a topic branch off `main` — never commit directly to `main`.
   Name it `feature/PET-123-short-slug` (or `fix/…` for bugs).
   `git switch -c feature/PET-123-short-slug`
2. **Stage precisely.** Add only the files this change touches (`git add <paths>`),
   not `git add .`. Flag any `.env`/secret-bearing files before staging — never
   commit them.
3. **Commit.** Only when the user has asked to ship (this workflow implies it).
   Message: `PET-123: <concise summary>` with a short body describing the change
   and how it was verified.
4. **Push.** `git push -u origin feature/PET-123-short-slug`.
5. **Open the PR.** Prefer the `gh` CLI: `gh pr create --base main --fill`,
   overriding title/body as below. If `gh` isn't available/authed, use the GitHub
   tooling to create the PR on `lynzleb/PetDB`.
   - **Title:** `PET-123: <concise summary>` (keep under ~70 chars).
   - **Body:** Summary of changes · What was verified (tests/Chrome) · Link to the
     Jira ticket: `https://lynzlebaldelomar.atlassian.net/browse/PET-123` · any
     follow-ups/blocked items.
6. **Link back to Jira.** Add a comment on the ticket with the PR URL via
   `addOrEditJiraIssueComment` (cloud ID `b70198dd-9e12-4d1c-a71f-ddc01cfe334a`).
   Optionally transition the ticket (e.g. to In Review) with `transitionJiraIssue`.

## Safety

- New branch + `git push -u`; do not force-push, reset --hard, or push to `main`.
- Don't skip hooks (`--no-verify`) unless explicitly asked.
- Report the branch name and PR URL when done.
