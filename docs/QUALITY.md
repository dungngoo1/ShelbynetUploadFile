# Part 4: Testing, Rollout, and Next Backlog

## Purpose

This document defines how to validate, ship, and continue improving the current MVP without losing product quality, security discipline, or implementation focus.

It should be used after:

- [PRD.md](/d:/ShelbynetUploadFile/PRD.md)
- [ARCHITECTURE.md](/d:/ShelbynetUploadFile/docs/ARCHITECTURE.md)
- [FLOWS.md](/d:/ShelbynetUploadFile/docs/FLOWS.md)

## 1. Test Philosophy

The current app is still early-stage, but it already crosses multiple risk boundaries:

- browser boot and polyfills
- wallet adapter state
- Shelby SDK mutations and queries
- link generation and explorer navigation
- testnet instability

Because of that, testing should focus first on:

- preventing blank-page regressions
- preventing broken upload and verify flows
- preventing incorrect blob and explorer URLs
- preventing trust-boundary mistakes in frontend config

## 2. Manual Test Matrix

### 2.1 Boot and Shell

Test goals:

- app mounts without a blank page
- shell renders in light mode and dark mode
- theme toggle persists correctly
- route navigation works between `Upload`, `Verify`, and `History`

Checklist:

1. run `npm run dev`
2. open `/`
3. verify shell loads without `Boot Error`
4. toggle light/dark mode
5. refresh the page
6. confirm theme is preserved
7. click `Verify`
8. click `History`

Expected result:

- all pages render
- no blank white screen
- no route crash after refresh

### 2.2 Wallet Connection

Test goals:

- wallet providers are detected correctly
- wallet selection works
- connected wallet state updates the shell
- address copy action works
- disconnect resets UI cleanly

Checklist:

1. install one supported wallet such as Petra
2. open the app in the same browser profile
3. verify provider card appears
4. connect wallet
5. confirm connected state appears
6. click copy
7. paste somewhere and verify copied address
8. disconnect

Expected result:

- correct provider card is shown
- connect and disconnect work
- copied address matches connected account

### 2.3 Upload Flow

Test goals:

- upload validation blocks bad input
- upload mutation completes successfully for small files
- result card shows usable links
- metadata resolves after upload

Checklist:

1. leave wallet disconnected and press upload
2. verify error is shown
3. connect wallet
4. try file > 10 MB
5. verify validation blocks submission
6. choose a small file
7. confirm blob name auto-fills
8. upload with default expiration
9. wait for success state
10. verify latest upload panel renders
11. open direct object URL
12. open explorer URL

Expected result:

- upload only works with valid input
- object URL opens the blob
- explorer URL opens account blobs page filtered with `?name=`

### 2.4 Verify Flow

Test goals:

- valid account and blob name resolve metadata
- invalid inputs surface friendly errors
- generated URLs match the uploaded object

Checklist:

1. upload a known file first
2. go to `Verify`
3. paste the owner account
4. paste the exact blob name suffix
5. submit verify form
6. confirm metadata appears
7. open direct object URL
8. open explorer URL
9. try a wrong blob name
10. confirm not-found or error state is rendered clearly

Expected result:

- valid object resolves cleanly
- invalid object does not crash the page
- links stay consistent with history and upload tabs

### 2.5 History Flow

Test goals:

- account blobs render for the connected wallet
- direct object URLs use the normalized blob suffix
- explorer URLs use filtered `name=` query
- responsive layout stays readable

Checklist:

1. connect a wallet with at least one uploaded object
2. open `History`
3. confirm blobs list appears
4. verify each item uses human-readable suffix, not full `@account/...`
5. open `Open blob`
6. open `Explorer`
7. resize to tablet/mobile width

Expected result:

- list remains readable
- actions work correctly
- no broken URL encoding from full blob keys

## 3. Pre-Release Checklist

Before each public demo, review, or ecosystem submission:

- `npm install` succeeds cleanly
- `npm run build` succeeds cleanly
- `.env` uses frontend-safe keys only
- no private keys are present in repo files
- upload flow tested with a fresh object
- verify flow tested with that same object
- history flow tested on the connected account
- explorer links checked manually
- direct object URLs checked manually
- light and dark mode checked manually

## 4. Debug Checklist

When something breaks, debug in this order.

### 4.1 Blank Screen

Check:

- does boot fallback appear?
- does browser console show startup import failure?
- did a polyfill regression break `main.tsx`?
- does the issue happen only after a hard refresh on nested routes?

### 4.2 Upload Failure

Check:

- wallet connected?
- `VITE_SHELBY_API_KEY` present?
- file under 10 MB?
- valid blob name?
- expiration within allowed range?
- Aptos wallet transaction prompt accepted?

### 4.3 Metadata or Verify Failure

Check:

- account address correct?
- blob name suffix correct?
- testnet object still exists?
- `shelbynet` reset happened?
- metadata query failing because of temporary index delay?

### 4.4 Broken URLs

Check:

- is the code using `blobNameSuffix`?
- did a full blob key like `@account/name` leak into link generation?
- does explorer URL include `?name=`?

## 5. Security Review Checklist

Every time frontend logic changes, verify:

- no trusted signer key is added to frontend code
- no S3 Gateway secret is added to frontend code
- no private environment variable is exposed via `VITE_`
- all generated links come from normalized blob suffixes
- form inputs are still validated before mutations run

## 6. Performance Watchlist

Current reality:

- bundle size is still large because Shelby SDK upload flow includes erasure coding and WASM

Short-term watch items:

- keep bootstrap lightweight
- preserve dynamic import for `RootApp`
- avoid importing more heavy protocol code into shell-only modules

Medium-term improvements:

- split upload-only code path further
- lazy-load history and verify sections if needed
- consider route-level chunking for future refinement

## 7. Recommended Next Backlog

### Priority 1: UX Reliability

- add copy buttons for blob name, object URL, and explorer URL
- add toast feedback for connect, upload, verify, and copy actions
- add success and error banners with clearer actionable messages

### Priority 2: Product Quality

- add loading skeletons for metadata and history
- add empty states with retry affordances
- improve file input with drag-and-drop interaction

### Priority 3: Code Quality

- add utility tests for `extractBlobNameSuffix`, `buildBlobUrl`, and `buildExplorerUrl`
- separate wallet icons into dedicated component files
- extract a reusable status message component

### Priority 4: Delivery Readiness

- add screenshots or demo GIFs to README
- add a setup section for supported wallets
- add known limitations section for `shelbynet`

## 8. Suggested Test Cases for Future Automation

When automated testing is introduced, start with these small cases first.

### Unit-level candidates

- `extractBlobNameSuffix("file.png") -> "file.png"`
- `extractBlobNameSuffix("@abc/file.png") -> "file.png"`
- `buildBlobUrl(account, suffix)` returns the expected Shelby blob URL
- `buildExplorerUrl(account, suffix)` returns `/blobs?name=<suffix>`

### Component-level candidates

- `WalletPanel` shows connect options when disconnected
- `WalletPanel` shows copyable connected state when connected
- `UploadPage` blocks submit without wallet
- `VerifyPage` blocks submit without required fields

## 9. Rollout Guidance for a Senior Workflow

Use this sequence for each meaningful product increment:

1. update docs first if the architecture or contract changes
2. implement the smallest working slice
3. manually validate Upload, Verify, and History flows
4. run `npm run build`
5. commit with a focused message
6. push only after URLs and wallet behavior are checked in-browser

This keeps the repo stable and avoids mixing speculative work with verified work.

## 10. Definition of Part 4 Completion

Part 4 is complete when:

- the project has a clear manual test matrix
- the project has a clear release checklist
- the project has a clear debug order for common failures
- the next backlog is prioritized by real impact
- the document supports continued development like an operating playbook
