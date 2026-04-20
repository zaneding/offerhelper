# Resume Template Layout Map

Copy this file to your project's `references/resume-layout-map.md` and fill in your template's details.
You can also generate or refresh it from a private Markdown source referenced in `references/private-config.md`.
Private field IDs, edit URLs, and design IDs should live in `references/private-config.md` (outside version control).

---

## Template Overview
- **Template name**: [e.g., "Dark navy two-column" or any label you choose]
- **Design ID**: _(in private-config.md)_
- **Edit URL**: _(in private-config.md)_
- **Style**: [Brief description of layout, e.g., "two-column, photo top-right, white background"]

---

## Editable Zones

Define each zone you allow the skill to modify. For each zone, specify:
- **Logical name** — what the zone represents
- **Field ID** _(in private-config.md)_ — the template element identifier
- **Content rules** — character limits, line limits, formatting constraints

### Zone 1: Subtitle / Target Role Line
- **Purpose**: The role title shown below the candidate name
- **Field ID**: see `subtitle_field_id` in private config
- **Rules**: [e.g., max 60 characters, single line, update to match JD title]

### Zone 2: Current Role — Achievement Bullets
- **Purpose**: 3–4 achievement bullets for the most recent position
- **Field ID**: see `current_role_bullets_field_id` in private config
- **Rules**: [e.g., max 4 bullets, each bullet max 120 characters, one line per bullet, use \n as separator]

### Zone 3: Prior Experience Block
- **Purpose**: Bullets or summary for earlier roles
- **Field ID**: see `prior_experience_block_field_id` in private config
- **Rules**: [e.g., max 3 bullets per role, keep concise]

### Zone 4: Skills List
- **Purpose**: List of technical and professional skills
- **Field ID**: see `skills_list_field_id` in private config
- **Rules**: [e.g., max 10 items, one per line, reorder by JD relevance]

---

## Fixed Zones (Do Not Edit)

List sections that must never be changed by the skill:

- Education section
- Language proficiency block
- Contact details (name, phone, email, address, LinkedIn)
- Profile photo
- Section headers

---

## Per-Job Optimization Rules

### What to change per job:
1. **Subtitle** — tailor role title to the job posting
2. **Current-role bullets** — lead with most relevant keywords from JD
3. **Prior experience block** — echo remaining JD keywords
4. **Skills list** — reorder: put top JD skills first

### What NOT to change:
- All fixed zones listed above

### Content reminders:
- Always note which zones changed and what keywords were added or removed
- Respect the character/line limits for each zone — trim rather than overflow
- If the template uses fixed-size boxes, overflow causes visual overlap; dynamic boxes tolerate longer content but may affect visual quality
