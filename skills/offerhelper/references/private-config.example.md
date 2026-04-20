# Private Config Example

This file is a public example only. Do not store real personal data, live edit URLs,
or production template IDs in this repository.

Create your actual private config as `references/private-config.md` outside version control,
or store it in a separate private repository.

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

## Output Preferences
- `resume_export_format`
- `cover_letter_format`
- `cover_letter_locale`
- `target_page_limit`

## Maintenance Notes
- Keep private config outside version control.
- When the template changes, update the field mapping first.
- When candidate facts change, update the private source of truth before using the skill for new applications.
