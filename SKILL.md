---
name: offerhelper
description: >
  Tailor Zijian Ding's job application documents for a specific role.
  Trigger this skill when the user shares a job posting URL or pastes a job description
  and wants a customized German resume, a German Anschreiben, or both.
  This skill analyzes the job requirements, maps them to the candidate profile,
  updates the configured resume template, and prepares export-ready application artifacts.
---

# OfferHelper Skill

Use this skill for a single-candidate application workflow built around a maintained
candidate profile, a fixed resume template, and a German cover-letter format.

## Read First
- Read `references/candidate-profile.md` before tailoring any content.
- Read `references/canva-layout-map.md` before changing the resume layout.
- If a private runtime config exists outside the public repo, read it before editing or exporting.
- Use `references/private-config.example.md` only to understand the expected private fields.

## Required Inputs
- One of:
  - a job posting URL
  - a pasted job description
- The user should specify whether they want:
  - resume only
  - Anschreiben only
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
| **DA-heavy** | SQL, dashboard, metrics, data pipeline, visualization, analytics engineering | SQL experience, analysis pipelines, data-driven decision support, tooling |
| **BA-heavy** | requirements, process, stakeholder, KPI definition, business case, gap analysis | Stakeholder alignment, KPI reporting, cross-functional coordination, problem framing |
| **Strategy / Ops** | workflow optimization, OKR, go-to-market, efficiency, business operations | Workflow improvement, business case thinking, project ownership, outcome-driven framing |

Record the role type as part of the analysis output. Use it to select the dominant evidence cluster from `references/candidate-profile.md`.

### 2. Build a Tailoring Strategy
- Map the top requirements to verified candidate evidence from `references/candidate-profile.md`.
- Use the role type from Step 1a to select which competency cluster to lead with.
- Prioritize the strongest evidence in the current-role bullets and skills area.
- Do not invent tools, metrics, projects, or responsibilities that are not supported by the profile or user-supplied context.
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

Examples of the transformation:
- ❌ `Analyzed data to support business decisions`
- ✅ `Used SQL to analyze user retention across 3 segments, identifying a 15% drop in cohort 2 that led to a product fix`

- ❌ `Supported project coordination with stakeholders`
- ✅ `Aligned engineering, quality, and supplier teams on release blockers, reducing open issue resolution time by consolidating status tracking in a single dashboard`

Apply this formula to all 4 current-role bullets before writing them into the template.

### 3. Update the Resume Template
- Only perform direct template editing when the required private config and editing capability are available.
- Follow the logical field rules in `references/canva-layout-map.md`.
- Update exactly these 4 logical content areas:
  - subtitle / target role line
  - current-role achievement bullets
  - prior-experience block
  - skills list
- Do not change education, languages, contact details, photo, or section headers unless the user explicitly requests it.
- **Anti-overlap rule**: Canva text boxes have fixed positions. If updated content is longer than the original, it overflows and overlaps adjacent elements. Always respect the hard limits in `references/canva-layout-map.md` (character caps per section, line limits per bullet). When in doubt, trim first — never let content exceed those limits.
- **Self-check before writing**: Count characters in each section draft. If any section exceeds its limit, rewrite to compress before issuing the edit command.
- If editing capability or private template metadata is missing, produce a structured edit plan instead of pretending the edit was completed.

### 4. Export the Resume
- Export only after the template update is complete.
- If export succeeds, return the resume artifact link or file path.
- If export fails, report the failure briefly and give the next manual step needed to finish the export.

### 5. Generate the Anschreiben
- Produce a German DIN 5008 style cover letter in `.docx` when the user requests it.
- Keep it to one A4 page in Arial 11pt.
- Preferred structure:
  - sender block
  - recipient block
  - date line
  - bold subject line
  - salutation
  - short introduction
  - two compact body paragraphs
  - short closing
  - greeting, signature gap, bold name
- If the draft exceeds one page, compress wording before finalizing.
- If `.docx` generation is unavailable, return the finalized letter text and state that a manual document export is still needed.

## Output Contract
- User-facing final output:
  - resume artifact link or file path when generated
  - Anschreiben artifact link or file path when generated
  - brief fallback note only when a required step could not be completed
- Operator-facing change log:
  - changed logical field
  - key terms added or removed
  - reason for the change
- Keep the operator-facing log separate from the final user-facing artifact response unless the user explicitly asks for both.

## Constraints
- Support both job-posting URLs and pasted job descriptions.
- Treat private identity data, template IDs, edit URLs, and element IDs as external configuration, not public repo content.
- Prefer truthful compression over aggressive keyword stuffing.
- Do not claim completion of editing, export, or document generation if the required tool capability is unavailable.

## Files
- `references/candidate-profile.md` — verified candidate evidence and public-safe guidance
- `references/canva-layout-map.md` — logical template zones and edit boundaries
- `references/private-config.example.md` — sample shape for private runtime configuration
