# Part 5: Roadmap and Sprint Breakdown

## Purpose

This document turns the previous planning documents into an execution roadmap. It is written to help a single builder or a small team continue the project in a focused, senior-style way without losing scope control.

Use this after:

- [PRD.md](/d:/ShelbynetUploadFile/PRD.md)
- [ARCHITECTURE.md](/d:/ShelbynetUploadFile/docs/ARCHITECTURE.md)
- [FLOWS.md](/d:/ShelbynetUploadFile/docs/FLOWS.md)
- [QUALITY.md](/d:/ShelbynetUploadFile/docs/QUALITY.md)

## 1. Delivery Strategy

The recommended strategy is to ship the project in short, outcome-based increments.

Each increment should:

1. improve one real user outcome
2. preserve working upload, verify, and history flows
3. end with a clean `npm run build`
4. end with a manual browser validation pass

This avoids the common failure mode where UI work, protocol work, and infra work all move at once and break each other.

## 2. Current State Snapshot

Already present in the repo:

- React app scaffolded with Vite and TypeScript
- Shelby React SDK integration
- Aptos wallet adapter integration
- wallet connect UI
- upload flow
- verify flow
- history flow
- direct object URL generation
- explorer URL generation
- shell theming and route navigation
- PRD, architecture, flow, and quality documentation

What is still immature:

- copy interactions beyond wallet address
- toast and success/error feedback polish
- loading skeletons and richer UX states
- automated testing
- chunk-size optimization
- demo and delivery assets

## 3. Recommended Sprint Structure

A useful sprint cadence for this project is 5 focused sprints.

### Sprint 1: UX Reliability

Goal:

Make the current MVP feel dependable in daily use.

Tasks:

- add copy buttons for blob name, direct object URL, and explorer URL
- add success and error feedback for copy actions
- add consistent empty state copy across pages
- add better loading states for upload and verify results
- normalize any remaining layout inconsistencies between cards

Acceptance criteria:

- users can copy important values without using the browser address bar
- all major actions show visible feedback
- no page feels visually unfinished or inconsistent

### Sprint 2: Form and State Polish

Goal:

Reduce form friction and improve operator clarity.

Tasks:

- improve file picker UX
- add drag-and-drop upload affordance
- surface clearer validation messages
- make verify form easier to reuse from previous uploads
- add “use connected account” shortcut on verify page

Acceptance criteria:

- upload form feels simple and guided
- verify flow requires less manual typing
- validation messages explain exactly what needs fixing

### Sprint 3: Testing Foundation

Goal:

Protect critical logic from regressions.

Tasks:

- add unit tests for `extractBlobNameSuffix`
- add unit tests for `buildBlobUrl`
- add unit tests for `buildExplorerUrl`
- add component tests for wallet connected/disconnected states
- add component tests for upload validation and verify validation

Acceptance criteria:

- core URL logic is covered by automated tests
- wallet and form validation basics are covered
- known regressions can be caught before manual QA

### Sprint 4: Performance and Bundle Cleanup

Goal:

Reduce boot weight and make the app feel faster.

Tasks:

- identify heavy imports pulled into early boot
- split upload-only logic further if possible
- lazy-load non-critical feature code where safe
- review WASM-heavy path boundaries
- measure bundle impact after each change

Acceptance criteria:

- boot path stays minimal
- route entry feels lighter
- bundle strategy is documented and intentional

### Sprint 5: Demo and Delivery Readiness

Goal:

Make the repo ready for review, demos, or ecosystem submission.

Tasks:

- improve README onboarding
- add screenshots or demo GIFs
- document supported wallets clearly
- add known limitations section
- write a short demo script for reviewers

Acceptance criteria:

- a reviewer can run the app quickly
- demo path is obvious
- repo explains current limits without overselling

## 4. Issue Breakdown by Area

### Area A: Wallet Experience

Candidate tasks:

- add copy feedback state for wallet address
- refine selected-wallet visual state
- add provider ordering if multiple wallets appear
- move icon definitions into shared component files

### Area B: Upload Experience

Candidate tasks:

- add drag-and-drop
- add upload progress indicator
- add reusable post-upload action group
- support quick-copy of blob name and links

### Area C: Verify Experience

Candidate tasks:

- add autofill from latest upload
- add “paste owner from connected wallet” shortcut
- improve no-result messaging
- make explorer action more prominent

### Area D: History Experience

Candidate tasks:

- add sort and filter by blob name
- add created/expiration display if useful
- improve responsive card layout further
- add quick re-verify action per row

### Area E: Shared Platform

Candidate tasks:

- extract clipboard helper
- extract shared action-button row
- extract result metadata card pattern
- centralize user-facing status copy

## 5. Suggested Task Ordering

If working alone, do tasks in this order:

1. copy interactions and feedback
2. verify form shortcuts
3. upload drag-and-drop
4. URL helper tests
5. wallet panel cleanup and icon extraction
6. history sorting/filtering
7. bundle optimization
8. README/demo work

This ordering prioritizes the biggest usability gains before deeper refactors.

## 6. Definition of Ready for a Task

A task is ready when:

- the user outcome is clear
- affected files are known
- risk to upload/verify/history is understood
- manual test steps are written down before coding starts

## 7. Definition of Done for a Task

A task is done when:

- the behavior is implemented
- the UI is visually consistent with the rest of the app
- links and wallet states still work
- `npm run build` passes
- manual browser verification has been performed
- docs are updated if behavior changed

## 8. Senior Execution Rules for This Repo

To keep the project healthy, follow these rules:

- do not widen scope without updating docs first
- do not merge UI changes without rechecking blob and explorer URLs
- do not trust full blob keys in link generation without normalization
- do not add backend or secret-bearing flows into the public frontend
- do not leave temporary workaround code undocumented

## 9. Recommended Milestones

### Milestone A: Comfortable MVP

Meaning:

The app is pleasant enough for repeated internal use.

Signals:

- users can connect wallet easily
- upload and verify feel stable
- copy actions exist where needed
- no major layout problems remain

### Milestone B: Reviewable MVP

Meaning:

The repo is ready for ecosystem reviewers and demos.

Signals:

- README is clear
- docs are coherent
- screenshots or GIFs exist
- known limitations are documented

### Milestone C: Maintainable MVP

Meaning:

The app can be extended safely without constant regressions.

Signals:

- shared helpers are tested
- repeated UI patterns are extracted
- bootstrap/runtime issues are well-contained

## 10. Immediate Next 10 Tasks

Here is the most actionable near-term backlog.

1. Add copy buttons for object URL and explorer URL in upload result.
2. Add copy buttons for object URL and explorer URL in verify result.
3. Add copy feedback toast or inline success message.
4. Add verify shortcut that fills the connected account automatically.
5. Add drag-and-drop support to the upload file area.
6. Add a small reusable clipboard helper in `shared/lib`.
7. Add unit tests for blob URL helpers.
8. Add sort/filter controls in history.
9. Extract wallet icon components into `shared/ui` or `features/wallet/components/icons`.
10. Add README screenshots and a quick demo walkthrough.

## 11. Definition of Part 5 Completion

Part 5 is complete when:

- the project has a realistic roadmap
- the roadmap is broken down into small actionable increments
- the next tasks are prioritized by impact and risk
- the repo can move from planning into deliberate execution
