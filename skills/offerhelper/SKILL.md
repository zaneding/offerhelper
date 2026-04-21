---
name: offerhelper
description: >
  Tailor a candidate's job application documents for a specific role.
  Trigger this skill when the user shares a job posting URL or pastes a job description
  and wants a customized resume, a cover letter, or a full application package.
  This skill analyzes the job requirements, maps them to the candidate profile,
  updates the configured resume template, and prepares export-ready artifacts.
---

# OfferHelper Skill

A public-safe application workflow built around:

- a local `references/candidate-profile.md`
- a local `references/resume-layout-map.md`
- a local `references/private-config.md`

The public repo ships templates and onboarding only. Real candidate data, live template IDs, and private notes must stay in ignored local files or a separate private repository. In the maintainer's setup, that private repository can be named `offerhelpe_privat`.

## Setup (First Time)

Before using this skill, prepare a local `references/` directory in your project.

### Step 1: Create local runtime files from the public templates

Copy these public templates into local runtime files:

- `skills/offerhelper/references/candidate-profile-template.md` → `references/candidate-profile.md`
- `skills/offerhelper/references/resume-layout-map-template.md` → `references/resume-layout-map.md`
- `skills/offerhelper/references/private-config.example.md` → `references/private-config.md`

### Step 2: Fill `references/private-config.md`

Use `references/private-config.md` as the single runtime interface for:

- candidate identity and contact values
- template metadata such as design ID, edit URL, and page ID
- logical field mappings
- output preferences
- optional file paths to private Markdown source files

### Step 3: Optionally connect external private Markdown sources

If you keep your real source-of-truth files in a private repo or ignored local folder, add their paths to `references/private-config.md`.

Supported source categories include:

- `candidate_source_path`
- `resume_layout_source_path`
- `contact_source_path`
- `cover_letter_source_path`

Example private source paths:

```text
candidate_source_path: ../offerhelpe_privat/candidate-source.md
resume_layout_source_path: ../offerhelpe_privat/layout-source.md
contact_source_path: ../offerhelpe_privat/contact-source.md
cover_letter_source_path: ../offerhelpe_privat/cover-letter-source.md
```

### Step 4: Generate or refresh local `references/` files before tailoring

If `references/candidate-profile.md` or `references/resume-layout-map.md` is missing or incomplete, do this first:

1. Read `references/private-config.md`
2. If configured source paths exist, read those private Markdown files
3. Use the public templates as the target shape
4. Generate or refresh the local `references/` files before tailoring any job application content

Treat a local reference file as incomplete when:

- it does not exist
- it still contains placeholder text
- required sections are missing
- the current template mapping is outdated

## Read First

- Read `references/private-config.md` before editing or exporting.
- Read `references/candidate-profile.md` before tailoring any content.
- Read `references/resume-layout-map.md` before changing the resume layout.
- Use `skills/offerhelper/references/*.md` only as public templates, not as private source-of-truth files.
- **Never edit the master template (`master_template_id`) directly.** It is read-only after initial setup. Always duplicate it first and work on the copy.

## Required Inputs

- One of:
  - a job posting URL
  - a pasted job description
- The user should specify whether they want:
  - resume only
  - cover letter only
  - full application package

## Core Workflow

### 1. Analyze the Job

- If the input is a URL, fetch and read the job posting.
- If URL retrieval fails, ask the user to paste the job description instead.
- Extract:
  - job title
  - company
  - must-have requirements
  - relevant technologies or domain keywords
  - soft-skill or stakeholder expectations
- Identify the top 3 screening criteria from the hiring-manager perspective.

#### 1a. Classify the Role Type

Before tailoring anything, assign one primary type to the role. This drives which competency cluster to surface.

| Type | Signal words in JD | Resume emphasis |
|---|---|---|
| **DA-heavy** | SQL, dashboard, metrics, data pipeline, visualization, analytics engineering | Data experience, analysis pipelines, data-driven decision support, tooling |
| **BA-heavy** | requirements, process, stakeholder, KPI definition, business case, gap analysis | Stakeholder alignment, KPI reporting, cross-functional coordination, problem framing |
| **Strategy / Ops** | workflow optimization, OKR, go-to-market, efficiency, business operations | Workflow improvement, business case thinking, project ownership, outcome-driven framing |

Record the role type as part of the analysis output. Use it to select the dominant evidence cluster from `references/candidate-profile.md`.

### 2. Prepare Local References

- Read `references/private-config.md` before drafting tailored content.
- If configured private source paths exist, read those files.
- If `references/candidate-profile.md` or `references/resume-layout-map.md` is missing or incomplete, generate or refresh it locally before proceeding.
- Never write private source content into public template files under `skills/offerhelper/references/`.

### 3. Build a Tailoring Strategy

- Map the top requirements to verified candidate evidence from `references/candidate-profile.md`.
- Use the role type from Step 1a to select which competency cluster to lead with.
- Prioritize the strongest evidence in the current-role bullets and skills area.
- Do not invent tools, metrics, projects, or responsibilities not supported by the profile or user-supplied context.
- If verified evidence is thin for a requirement, keep the wording general and truthful instead of speculating.

#### 3a. Evidence Quality Test

Before drafting any bullet, ask: what does this sentence prove? Every bullet must demonstrate at least one of:

- **Problem framing** — the candidate can decompose a business or technical problem, not just execute a task.
- **Data → insight** — the candidate can translate raw data or analysis into a concrete finding or recommendation.
- **Action driven** — the candidate's work led to a follow-up decision, fix, or measurable outcome.

Reject bullets that only describe activity without demonstrating any of the above. Rewrite them using the formula below.

#### 3b. Bullet Rewriting Formula

Structure every achievement bullet as:

> **[Business context or problem]** + **[Tool or method used]** + **[Concrete impact or outcome]**

Examples:

- ❌ `Analyzed data to support business decisions`
- ✅ `Used SQL to analyze user retention across 3 segments, identifying a 15% drop that led to a product fix`
- ❌ `Supported project coordination with stakeholders`
- ✅ `Aligned engineering, quality, and supplier teams on release blockers, reducing resolution time by consolidating status tracking in a single dashboard`

Apply this formula to all current-role bullets before writing them into the template.

### 4. Duplicate the Master Template

Before making any edits, create a per-job copy of the master:

1. Read `master_template_id` from `references/private-config.md`.
2. In Canva, open the master design and select **"..." → "Make a copy"** to create a new job-specific copy.
3. Record the new copy's `design_id` and `edit_url`.
4. All edits in Steps 4 and 5 happen on this copy only. Never open or modify `master_template_id`.
5. If Canva MCP duplication is available, use it instead of manual steps — but verify the result is a new independent design before proceeding.

If duplication cannot be confirmed, stop and ask the user to create the copy manually before continuing.

### 5. Update the Resume Copy

Using the per-job copy from Step 4:

- Only perform direct template editing when the required private config and editing capability are available.
- Follow the logical field rules in `references/resume-layout-map.md`.
- Update only the editable zones defined in that file.
- Do not change education, languages, contact details, photo, or section headers unless the user explicitly requests it.
- Respect the hard character and line limits in `references/resume-layout-map.md`. Trim rather than overflow.
- Keep Kompetenzen to a maximum of 12 items so it does not overlap with the Ausbildung section.
- If editing capability or private template metadata is missing, produce a structured edit plan instead of pretending the edit was completed.

### 6. Export the Resume

- Export only after the resume copy update is complete.
- If export succeeds, download the PDF and proceed to Step 8.
- If export fails, report the failure briefly and give the next manual step needed to finish the export.

### 7. Generate the Cover Letter

- Produce a cover letter in the format and language specified in `references/private-config.md`.
- Keep it to one A4 page unless the user explicitly requests otherwise.
- Generate the `.docx` file using the **Word By Anthropic MCP connector** (`create_document` → `save_document`). Do not use python scripts or any other method.
- Preferred structure:
  - sender block
  - recipient block
  - date line
  - bold subject line
  - salutation
  - short introduction
  - two compact body paragraphs
  - short closing
  - greeting, signature gap, name
- If the draft exceeds one page, compress wording before finalizing. Do not reduce font size.
- If `.docx` generation is unavailable, return finalized text and state that manual document export is still needed.

### 8. Package Output Files

After both documents are ready, create a job-specific output folder and save all artifacts there:

1. Create folder `~/Downloads/<Company>_<JobTitle>/` where `<Company>` and `<JobTitle>` are taken from the job posting (no spaces, underscores between words).
2. Save the exported resume PDF as `CV_ZijianDing.pdf`.
3. Save the cover letter as `Anschreiben_ZijianDing.docx`.
4. Create a `data.md` file in the folder with the following fields:
   - Company name
   - Position title
   - Application date (YYYY-MM-DD)
   - Job posting URL (if provided)
   - Canva edit URL of the per-job copy
   - **Top 3 screening criteria** from the hiring-manager perspective (from Step 1)
   - Summary of which CV elements were highlighted and why (subtitle, key bullets, Kompetenzen order)

The final `~/Downloads/<Company>_<JobTitle>/` folder must contain exactly:
- `CV_ZijianDing.pdf`
- `Anschreiben_ZijianDing.docx`
- `data.md`

## Output Contract

- User-facing final output:
  - full path to the output folder (e.g. `~/Downloads/Wiz_TechnicalAccountManager/`)
  - Canva edit link for the resume copy
  - brief fallback note only when a required step could not be completed
- Operator-facing change log:
  - changed logical field
  - key terms added or removed
  - reason for the change
- Keep the operator-facing log separate from the final user-facing artifact response unless the user explicitly asks for both.

## Constraints

- Support both job-posting URLs and pasted job descriptions.
- Treat private identity data, template IDs, edit URLs, page IDs, and element IDs as runtime-only configuration.
- Prefer truthful compression over aggressive keyword stuffing.
- Do not claim completion of editing, export, or document generation if the required tool capability is unavailable.

## Files

- `references/private-config.md` — single runtime interface for private data and source paths
- `references/candidate-profile.md` — verified candidate evidence and tailoring guidance
- `references/resume-layout-map.md` — template zones and edit boundaries
- `skills/offerhelper/references/*.md` — public templates only
