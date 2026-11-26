# APD Overwatch — Browser UI Demonstration

## What this repository contains

This repository currently contains a single large React JSX interface prototype for a group-home operations dashboard. It includes demonstration screens for resident profiles, medication records, behavior-plan views, incident reporting, staff handover, schedules, wallet tracking, and export-oriented workflows.

The project owner states that the underlying concepts and product direction originated with him. AI systems generated the implementation code and suggested technical mechanisms. NSDT and the Container Rule were introduced by AI as supporting implementation mechanisms within the owner's framework, not as independent conceptual origins.

## Critical limitations

- **Synthetic data only:** the resident, staff, home, medication, contact, financial, and incident records in the file are demonstration placeholders. Do not enter or connect real resident data or protected health information.
- **No secure backend:** the repository has no server, database, authentication service, role-based authorization, encryption-at-rest, audit logging, or tested data-retention controls.
- **PINs are not authentication:** the staff identifiers and PINs are client-side demonstration values. They do not secure records or establish staff identity.
- **AI is disabled:** the original direct browser call to Anthropic was removed. No resident content is sent to an external AI service by this prototype. A future AI feature requires an approved server-side integration and privacy/security review.
- **No HIPAA or APD compliance claim:** the prototype has not undergone a HIPAA security assessment, APD certification, legal review, or operational validation.
- **No clinical decision support:** the stage/NSDT classifier uses hand-authored values and weighted-distance/softmax calculations. It is not clinically validated, does not measure a resident's mental state, and must not be used to make care, medication, seizure-response, restraint, Baker Act, placement, or emergency decisions.
- **No live iConnect integration established:** the export-oriented UI is not proof of a live connection to APD iConnect. Review every exported file before use.
- **Legal and clinical content is illustrative:** any behavior, seizure, restraint, or Baker Act references are placeholders. Follow current law, approved individualized plans, facility policy, and qualified professional direction.

## Current technical state

- One JSX source file; no package manifest, lockfile, backend, or automated test suite is included.
- UI state is handled in the browser; no secure persistence or multi-user workflow is established.
- The app should be treated as a visual and workflow prototype, not a deployable group-home management system.

## Development required before any pilot

1. Define the exact operational workflow and remove all unnecessary clinical/financial data fields.
2. Build a secure server-side architecture with authenticated users, role-based permissions, encryption, audit trails, backups, and retention controls.
3. Obtain qualified privacy, legal, APD, clinical, and security review before handling any real resident information.
4. Verify each regulatory reference and remove any unverified legal or clinical threshold.
5. Test incident reporting, medication workflows, handover, exports, and permissions with synthetic data only.
6. Add a complete build configuration, dependency inventory, tests, and deployment process.

## Commercial assessment

The workflow-dashboard concept may be worth further development, but this repository is not a sellable or deployable product in its current form. Its most defensible near-term value is as a UI prototype for discussion with a qualified group-home operator and technical partner.