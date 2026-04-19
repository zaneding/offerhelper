# Canva Layout Map — Public Reference

This file describes the logical edit areas of the resume template without exposing
private template identifiers, edit URLs, or element IDs. Store those values in a
private config file and keep this public file focused on behavior and boundaries.

## Template Assumptions
- The current workflow assumes a two-column resume layout with a header area, an experience column, and a skills column.
- The preferred template supports dynamic text boxes so content can expand without fixed-height clipping.
- Even with dynamic sizing, edited text should stay concise to preserve readability and balance.

## Editable Logical Areas

### 1. Subtitle / Target Role Line
- Purpose: align the visible target role with the current application.
- Content style: short role-oriented phrase matching the JD vocabulary.
- Typical use: convert a generic engineer title into a role-specific headline.

### 2. Current-Role Achievement Bullets
- Purpose: surface the strongest, most recent evidence for the target job.
- Content limit: **strictly 4 bullets maximum**; each bullet must fit on **one line** (≤ 90 characters including leading dash and space).
- If a bullet would exceed 90 characters, split it into two shorter bullets or trim to the most impactful fragment — never let it wrap onto a second line inside the template text box.
- Prioritization:
  - direct JD match first
  - measurable or concrete work second
  - domain relevance before generic claims

### 3. Prior-Experience Block
- Purpose: cover secondary JD signals not already proven in the current role.
- Content style: concise summary of earlier relevant experience.
- **Hard character limit: ≤ 300 characters total** for this block (including all line breaks). Count before writing.
- Typical use: reinforce supplier-side perspective, earlier automotive exposure, or adjacent engineering context.
- If verified detail is missing, keep this block short and factual.

### 4. Skills List
- Purpose: make keyword alignment legible for human and ATS-style scanning.
- Content limit: **up to 10 items**; each item ≤ 25 characters.
- Ordering rule: place JD-priority skills first.
- Do not pad the list with weak or unverified keywords.

## Protected Areas
- Education
- Languages
- Contact details
- Photo
- Section headers

Do not edit protected areas unless the user explicitly requests a template or identity change.

## Per-Job Edit Rules
- Update exactly 4 logical content areas per application:
  - subtitle / target role line
  - current-role bullets
  - prior-experience block
  - skills list
- Keep wording consistent with the verified candidate profile.
- Prefer truthful compression over keyword-heavy rewrites.
- Record operator notes for each changed area:
  - what changed
  - which keywords were introduced or removed
  - why the change improves job fit

## Failure and Fallback Rules
- If private template metadata is missing, do not guess element IDs or claim the edit succeeded.
- If edit capability is unavailable, return a structured manual edit plan mapped to the 4 logical areas.
- If the updated content would visibly overload the template, trim weaker bullets before touching protected areas.
