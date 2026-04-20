# Private Config Example

This file is a public example only. Do not store real personal data, live edit URLs,
or production template IDs in this repository.

Create your actual private config as `references/private-config.md` outside version control,
or store it in a separate private repository such as `offerhelpe_privat`.

## Candidate Identity
- `candidate_name`
- `phone`
- `email`
- `address`
- `linkedin_url`
- `default_output_language`

## Resume Template Metadata
- `template_name`
- `design_id`
- `edit_url`
- `page_id`

## Logical Field Mapping
- `subtitle_field_id`
- `current_role_bullets_field_id`
- `prior_experience_block_field_id`
- `skills_list_field_id`

## Optional Private Source Paths
- `candidate_source_path`
- `resume_layout_source_path`
- `contact_source_path`
- `cover_letter_source_path`

Example values:
- `candidate_source_path: ../offerhelpe_privat/candidate-source.md`
- `resume_layout_source_path: ../offerhelpe_privat/layout-source.md`
- `contact_source_path: ../offerhelpe_privat/contact-source.md`
- `cover_letter_source_path: ../offerhelpe_privat/cover-letter-source.md`

## Output Preferences
- `resume_export_format`
- `cover_letter_format`
- `cover_letter_locale`
- `target_page_limit`

## Maintenance Notes
- Keep private config outside version control.
- Keep real source-of-truth Markdown files outside the public repo.
- If the optional source paths exist, Claude can read them to generate or refresh local `references/candidate-profile.md` and `references/resume-layout-map.md`.
- When the template changes, update the field mapping first.
- When candidate facts change, update the private source of truth before using the skill for new applications.
