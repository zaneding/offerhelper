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

A single-candidate application workflow built around a maintained candidate profile,
a configured resume template, and a target cover-letter format.

## Setup (First Time)

Before using this skill, configure three files in your project's `references/` directory:

1. **`references/candidate-profile.md`** — your verified experience, competency clusters, and tailoring guidance.  
   Copy `skills/offerhelper/references/candidate-profile-template.md` and fill it in.

2. **`references/resume-layout-map.md`** — your resume template's editable zones and field IDs.  
   Copy `skills/offerhelper/references/resume-layout-map-template.md` and fill it in.

3. **`references/private-config.md`** _(outside version control)_ — real template IDs, edit URLs, and personal contact details.  
   Use `skills/offerhelper/references/private-config.example.md` as the shape reference.

## Read First

- Read `references/candidate-profile.md` before tailoring any content.
- Read `references/resume-layout-map.md` before changing the resume layout.
- If a private runtime config exists, read it before editing or exporting.
- Use `references/private-config.example.md` only to understand the expected private fields.

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

### 2. Build a Tailoring Strategy

- Map the top requirements to verified candidate evidence from `references/candidate-profile.md`.
- Use the role type from Step 1a to select which competency cluster to lead with.
- Prioritize the strongest evidence in the current-role bullets and skills area.
- Do not invent tools, metrics, projects, or responsibilities not supported by the profile or user-supplied context.
- If verified evidence is thin for a requirement, keep the wording general and truthful instead of speculating.

#### 2a. Evidence Quality Test

Before drafting any bullet, ask: what does this sentence *prove*? Every bullet must demonstrate at least one of:

- **Problem framing** — the candidate can decompose a business or technical problem, not just execute a task.
- **Data → insight** — the candidate can translate raw data or analysis into a concrete finding or recommendation.
- **Action driven** — the candidate's work led to a follow-up decision, fix, or measurable outcome.

Reject bullets that only describe activity without demonstrating any of the above. Rewrite them using the formula below.

#### 2b. Bullet Rewriting Formula

Structure every achievement bullet as:
> **[Business context or problem]** + **[Tool or method used]** + **[Concrete impact or outcome]**

Examples:
- ❌ `Analyzed data to support business decisions`
- ✅ `Used SQL to analyze user retention across 3 segments, identifying a 15% drop that led to a product fix`

- ❌ `Supported project coordination with stakeholders`
- ✅ `Aligned engineering, quality, and supplier teams on release blockers, reducing resolution time by consolidating status tracking in a single dashboard`

Apply this formula to all current-role bullets before writing them into the template.

### 3. Update the Resume Template

- Only perform direct template editing when the required private config and editing capability are available.
- Follow the logical field rules in `references/resume-layout-map.md`.
- Update exactly the editable zones defined in that file (typically: subtitle/role line, current-role bullets, prior experience, skills list).
- Do not change education, languages, contact details, photo, or section headers unless the user explicitly requests it.
- **Anti-overlap rule**: If your template uses fixed-position text boxes, updated content longer than the original may overflow and overlap adjacent elements. Always respect the hard character/line limits in `references/resume-layout-map.md`. When in doubt, trim first.
- **Self-check before writing**: Verify each section draft stays within defined limits.
- If editing capability or private template metadata is missing, produce a structured edit plan instead of pretending the edit was completed.

### 4. Export the Resume

- Export only after the template update is complete.
- If export succeeds, return the resume artifact link or file path.
- If export fails, report the failure briefly and give the next manual step needed to finish the export.

### 5. Generate the Cover Letter

- Produce a cover letter in the format and language specified in your private config (default: German DIN 5008 style `.docx`).
- Keep it to one A4 page.
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
- If the draft exceeds one page, compress wording before finalizing.
- If `.docx` generation is unavailable, return the finalized letter text and state that a manual document export is still needed.

## Output Contract

- User-facing final output:
  - resume artifact link or file path when generated
  - cover letter artifact link or file path when generated
  - brief fallback note only when a required step could not be completed
- Operator-facing change log:
  - changed logical field
  - key terms added or removed
  - reason for the change
- Keep the operator-facing log separate from the final user-facing artifact response unless the user explicitly asks for both.

## Constraints

- Support both job-posting URLs and pasted job descriptions.
- Treat private identity data, template IDs, edit URLs, and element IDs as external configuration, not repo content.
- Prefer truthful compression over aggressive keyword stuffing.
- Do not claim completion of editing, export, or document generation if the required tool capability is unavailable.

## Files

- `references/candidate-profile.md` — verified candidate evidence and tailoring guidance
- `references/resume-layout-map.md` — template zones and edit boundaries
- `references/private-config.md` _(outside version control)_ — real template IDs, edit URLs, contact details
