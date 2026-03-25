---
name: surecart-feature-doc
description: Use this skill when the user asks to "generate feature doc", "update PR description", "add feature documentation to PR", "document this PR", or after completing user-facing changes. Analyzes the current branch diff and generates/updates the Feature Documentation section in the GitHub PR description.
version: 1.0.0
---

# Feature Documentation for PR

Generates feature documentation from the current branch changes and updates the GitHub PR description automatically.

## Instructions

### Step 1 — Determine PR Context

1. Get the current branch name: `git branch --show-current`
2. Find the open PR for this branch: `gh pr view --json number,title,body`
3. If no PR exists, inform the user and stop — this skill only updates existing PRs.
4. Get the version from `surecart.php` header (`Version: X.Y.Z`).

### Step 2 — Analyze Changes

1. Get the full diff against main: `git diff main...HEAD`
2. Get the commit log: `git log main..HEAD --oneline`
3. Read changed files as needed to understand the feature.
4. Determine if changes are user-facing. If purely internal (refactors, test-only, no visible change), set the Feature Documentation section to "N/A — no user-facing changes" and skip to Step 4.

### Step 3 — Generate Feature Documentation

Based on the diff analysis, generate documentation following this structure:

```markdown
## Feature Documentation

**Version:** {version from surecart.php}

### Overview
{Brief description of what this feature does and why it was built}

### User-Facing Changes
{Bullet list of what changed from the user's perspective — new UI, settings, behaviors}

### How It Works (Step-by-Step)
{Numbered steps showing the user flow}

### Settings / Options
{Table of any new settings, or remove this section if none}

| Setting | Location | Default | Description |
|---------|----------|---------|-------------|

### Screenshots
{Checklist describing what screenshots the docs team should capture}

### Edge Cases / Notes
{Limitations, known behaviors, compatibility notes}

### Related Features
{Links to related features or docs}
```

Remove any sections that don't apply (e.g., no Settings table if no new settings were added).

### Step 4 — Update PR Description

1. Read the current PR body: `gh pr view --json body -q '.body'`
2. Preserve everything above the `## Feature Documentation` section (like Testing Instructions).
3. Replace the `## Feature Documentation` section (and everything below it) with the generated content.
4. If there's no existing `## Feature Documentation` section, append it at the end.
5. Update the PR: `gh pr edit {number} --body "{new body}"`
6. Show the user the PR URL and a summary of what was documented.

### Important Notes

- Always preserve the user's Testing Instructions and any other content above Feature Documentation.
- Use the actual code changes to write accurate documentation — don't guess or hallucinate features.
- Keep descriptions concise and focused on what the docs team needs to write user-facing documentation.
- If the PR has multiple features, document all of them under the same Feature Documentation section.
