---
name: offerhelper
description: >
  Tailor Zijian Ding's job application documents for a specific role.
  Trigger this skill when the user shares a job posting URL or pastes a job description
  and wants a customized German resume, a German Anschreiben, or both.
  Also trigger when the user says things like "bewirb dich", "mach den Lebenslauf fertig",
  "update my CV for this job", or "Anschreiben schreiben".
  This skill analyzes the job requirements, maps them to the candidate profile,
  edits the live Canva resume template via Canva MCP, exports a PDF, and optionally
  generates a German DIN 5008 Anschreiben as a .docx file.
---
 
# OfferHelper Skill
 
Single-candidate application workflow for Zijian Ding.
Built around three reference files that must be read before any editing begins.
 
---
 
## Execution Mode: Silent (STRICT)
 
**No intermediate messages.** After the user triggers this skill, execute all steps
silently without any commentary, status updates, analysis summaries, or confirmations.
Do NOT output text between steps (no "Step 1 done", no "Analyzing…", no "Here's my strategy").
The only permitted output is the final deliverables:
1. The Canva CV edit link / export artifact
2. The Anschreiben .docx download link
If a step fails, output a single short error line and stop. No verbose explanations.
 
---
 
## Read First (mandatory before any step)
 
| File | When to read | What it provides |
|---|---|---|
| `references/candidate-profile.md` | Before Steps 1–2 | Verified evidence, competency clusters, tailoring routing rules |
| `references/canva-layout-map.md` | Before Step 3 | Template ID, page ID, every element ID, dynamic-box rules, per-job change rules |
| `references/private-config.example.md` | Before Steps 3–4 | Shape of private runtime config (contact fields, template metadata, export prefs) |
 
If a live private config file exists outside this repo (injected at runtime), read it
instead of the example. The example only documents the expected field names.
 
---
 
## Required Inputs
 
- One of: a job posting URL **or** a pasted job description
- Desired output: resume only / Anschreiben only / full package
- **Default if not stated: full package (CV + Anschreiben). Do NOT ask — proceed immediately.**
---
 
## Core Workflow
 
### Step 1 — Analyze the Job
 
- If URL: fetch and read the posting. On failure, ask user to paste.
- Extract: job title, company, must-have requirements, tech/domain keywords,
  soft-skill and stakeholder expectations.
- Identify the **top 3 screening criteria** from a hiring-manager perspective.
#### 1a — Classify Role Type
 
Assign exactly one primary type. This drives which evidence cluster leads the resume.
 
| Type | Signal words in JD | Lead evidence from profile |
|---|---|---|
| **DA-heavy** | SQL, dashboard, metrics, data pipeline, visualization, analytics | Database automation, analysis pipelines, AI-assisted pattern detection, SQL |
| **BA-heavy** | requirements, stakeholder, KPI definition, business case, gap analysis | Cross-functional alignment, feature-owner responsibility, KPI monitoring |
| **Strategy / Ops** | workflow optimization, OKR, go-to-market, efficiency, operations | Workflow improvement, OEM–supplier bridge, project ownership, outcome framing |
 
Record role type in the analysis output. Use it in Step 2 to route evidence selection.
 
---
 
### Step 2 — Build a Tailoring Strategy
 
- Map top JD requirements → verified candidate evidence in `references/candidate-profile.md`.
- Use role type to select the dominant competency cluster (see Tailoring Guidance section in profile).
- **Do not invent** tools, metrics, project names, or outcomes not present in the profile
  or explicitly provided by the user.
- Where evidence is thin for a requirement: use adjacent verified experience, not speculation.
#### 2a — Evidence Quality Test
 
Before drafting any bullet, it must pass at least one of:
- **Problem framing** — candidate decomposed a business or technical problem
- **Data → insight** — raw data translated into a finding or recommendation
- **Action-driven** — work led to a decision, fix, or measurable outcome
Reject pure activity descriptions. Rewrite using the formula below.
 
#### 2b — Bullet Rewriting Formula
 
> **[Business context / problem]** + **[Tool or method]** + **[Concrete impact or outcome]**
 
- ❌ `Analyzed data to support business decisions`
- ✅ `Used SQL to analyze user retention across 3 segments, identifying a 15% drop that led to a product fix`
- ❌ `Supported project coordination with stakeholders`
- ✅ `Aligned engineering, quality, and supplier teams on release blockers, consolidating status tracking into a single dashboard and reducing open-issue resolution time`
Apply to all BMW bullets before writing them into the template.
 
#### 2c — Draft the Four Content Areas
 
Prepare exact text for each editable zone before touching Canva:
 
1. **Subtitle** — one line, role title tailored to the JD
2. **BMW bullets** — exactly 4 items, one line each, formula applied
3. **Dräxlmaier + Praktikum block** — echo remaining JD keywords;
   Praktikum section appended as plain-text sub-block:
   `\n\nPraktikum & Masterarbeit  |  BMW Group  |  10.2020 – 01.2022\n[bullets]`
4. **Kompetenzen list** — max 10 items, `\n` between items,
   top JD-matching skills listed first
Self-check: BMW bullets = max 4 one-liners; Kompetenzen = max 10 items. Trim before proceeding.
 
---
 
### Step 3 — Update the Canva Resume Template
 
**Active template**: `DAHHVMTPJIg` (replaces old template `DAHHVLmJjNQ`)
**Edit URL**: https://www.canva.com/d/5yQTnHuNEN5sUU9
**Page ID**: `PBRmJK6zMjKljv3w`
 
All mutable text boxes are **dynamically sized** — they expand with content, no fixed-height overflow.
 
Use Canva MCP editing tools. Edit only the four mutable zones:
 
| Zone | Element ID | Content rules |
|---|---|---|
| Subtitle | `LBvd0cbRrF4GKqmX-LB6PXjdfsfjsn2fQ` | One line, role-tailored |
| BMW bullets | `LBvzlcVJHVS2j6M8-LBXcpqJVF0RQWy2j` | 4 items, `\n` between, dynamic height |
| Dräxlmaier + Praktikum | `LBvzlcVJHVS2j6M8-LBPCLTvB7ZQL6yPY` | Combined block, dynamic height |
| Kompetenzen | `LB7vTG8dhxBKYHQH` | Max 10 items, `\n` between, dynamic height |
 
**Do not touch**: all Ausbildung elements, Sprachen block, header contact info,
photo asset (`MAHHVDYfg2E`), section headers (`LBhP7Jf29DDSPNdD`, `LBS3nt1zqXmCl7T0`).
 
⚠️ Left-column element `left` ≈ **95.35** (not 110.83); Kompetenzen `left` ≈ **491.11**, `width` ≈ **276.92**.
Use values from `references/canva-layout-map.md` as the authoritative source if positions matter.
 
If Canva MCP is unavailable or private template metadata is missing:
produce a **structured edit plan** (zone → draft text → element ID) instead of claiming the edit was done.
 
---
 
### Step 4 — Export the Resume
 
- Export as PDF after template update is confirmed.
- Return the artifact link so the user can click and download in one step.
- On failure: state what failed and give the manual next step.
⚠️ **PDF URL output rule (CLICKABLE, NO SIGNATURE MANGLING):**
 
The Canva export URL is an AWS-signed URL containing `&X-Amz-Signature=...`.
Two output formats break the signature:
- ❌ Raw markdown link `[label](url)` — some clients re-encode `%2F` / `&` → `SignatureDoesNotMatch`
- ❌ Plain code block — preserves the URL but is NOT clickable; user must copy-paste manually
**Always emit the PDF export URL as a markdown autolink wrapped in angle brackets:**
 
```
<https://export-download.canva.com/...full...signed...url...>
```
 
This format:
1. Preserves the URL byte-for-byte (no encoding pass) → signature stays valid
2. Renders as a clickable hyperlink in Claude.ai's UI → one click opens the browser, browser downloads the PDF
3. Works on both desktop and mobile clients
Optionally also include the canonical Canva edit link (e.g. `https://www.canva.com/d/...`)
as a normal markdown link — it has no signature, so any format is safe.
 
**Do not** add a label, do not wrap in `[]()`, do not put it in a code fence.
Just: `<...full url...>` on its own line, prefixed with a short emoji + label like `📥 PDF: `.
 
---
 
### Step 5 — Generate the Anschreiben (if requested)
 
- German DIN 5008 style, `.docx`, one A4 page, Arial 11pt.
- Structure:
  - Sender block (inject from private config)
  - Recipient block
  - Date line
  - **Bold subject line**
  - Salutation
  - Short introduction (1–2 sentences, why this role)
  - Two compact body paragraphs (evidence mapped to top JD criteria)
  - Short closing
  - Greeting, signature gap, **bold name**
- If draft exceeds one page: compress wording, do not reduce font.
- If `.docx` generation is unavailable: return finalized letter text and note manual export needed.
---
 
## Output Contract
 
**Silent execution: no text output between steps.**
 
**User-facing final output only:**
- Resume: Canva edit link (markdown link, safe) + exported PDF URL **as `<https://...>` autolink** (clickable, AWS signature preserved)
- Anschreiben: .docx file delivered via `present_files` (always clickable/downloadable)
- On failure: one short error line only — no explanations
**Change log** (omit unless user explicitly requests it):
- Which of the 4 mutable elements changed
- Key terms added or removed per element
- Reason for each change (maps to which JD criterion)
---
 
## Constraints
 
- Support job-posting URLs and pasted descriptions equally.
- Treat private contact data, template IDs, edit URLs, and element IDs as external config —
  never hardcode into repo-committed files.
- Prefer truthful compression over keyword stuffing.
- Do not claim completion of any step if the required tool capability is unavailable.
- Languages: respond in the same language the user writes in (German or English);
  resume and Anschreiben content is always German.
---
 
## Files
 
- `references/candidate-profile.md` — verified evidence, competency clusters, role-type routing
- `references/canva-layout-map.md` — template ID, page ID, element IDs, dynamic-box rules, per-job rules
- `references/private-config.example.md` — expected shape of private runtime config
