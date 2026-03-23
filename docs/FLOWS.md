# Part 3: Feature Flow by Component

## Purpose

This document explains how the current MVP behaves at runtime, component by component, based on the implementation now present in the repository.

It is the bridge between:

- [PRD.md](/d:/ShelbynetUploadFile/PRD.md)
- [ARCHITECTURE.md](/d:/ShelbynetUploadFile/docs/ARCHITECTURE.md)
- the live React code inside `src/`

## 1. Runtime Entry Flow

### 1.1 `src/main.tsx`

Responsibilities:

- boot the React application
- polyfill `Buffer` for browser compatibility
- dynamically import the real app tree through `RootApp`
- show a safe fallback if startup fails

Why it matters:

A previous runtime issue caused a blank page when browser-only dependencies failed at startup. The current bootstrap intentionally avoids hard-crashing the UI by rendering a visible loading or error state.

### 1.2 `src/app/RootApp.tsx`

Responsibilities:

- render `ErrorBoundary`
- mount `AppProviders`
- mount `RouterProvider`

This file is intentionally small so the bootstrap boundary stays clear.

## 2. App Shell Flow

### 2.1 `src/app/providers.tsx`

Responsibilities:

- create the React Query client
- create the Shelby client
- configure Aptos wallet adapter provider
- wrap the app with `ShelbyClientProvider`

Current runtime behavior:

- `autoConnect` is disabled to reduce silent boot errors
- Shelby browser client is created for `Network.SHELBYNET`
- optional frontend API keys are read from `VITE_SHELBY_API_KEY` and `VITE_APTOS_TESTNET_API_KEY`

### 2.2 `src/app/routes.tsx`

Routes:

- `/` -> `UploadPage`
- `/verify` -> `VerifyPage`
- `/history` -> `HistoryPage`

### 2.3 `src/app/App.tsx`

Responsibilities:

- render the shell layout
- render the light/dark mode toggle
- render wallet status summary and wallet connect panel
- render warning banner for `shelbynet`
- render navigation tabs
- render `<Outlet />` for feature pages

This component owns the global shell, but not feature logic.

## 3. Wallet Flow

### 3.1 `src/features/wallet/components/WalletPanel.tsx`

Responsibilities:

- detect wallet options from Aptos wallet adapter
- show wallet provider cards
- allow provider selection
- connect the selected wallet
- show connected wallet summary and copy action
- disconnect the wallet

Current UX behavior:

- if no wallet is connected, the panel shows selectable wallet cards
- if a wallet is connected, the panel switches to a compact connected state
- the connected state exposes a quick copy button for the connected address

Current design note:

Wallet visuals are now provider-card based instead of generic buttons, which better matches production dApp patterns.

## 4. Upload Flow

### 4.1 `src/features/upload/pages/UploadPage.tsx`

Responsibilities:

- manage upload form state
- validate wallet, file, file size, API key, blob name, and expiration range
- call `useUploadBlobs`
- store the latest successful upload summary in local component state

Local state owned here:

- `selectedFile`
- `blobName`
- `expirationDays`
- `localError`
- `latestUpload`

Validation flow:

1. wallet must be connected
2. file must be selected
3. file must be <= 10 MB
4. Shelby frontend API key must exist
5. blob name must be non-empty
6. expiration must be between 1 and 30 days

Mutation flow:

1. convert selected file to `Uint8Array`
2. call `uploadBlobs.mutateAsync()`
3. pass wallet signer and blob payload
4. on success, persist `latestUpload` summary locally

### 4.2 `src/features/upload/components/UploadResult.tsx`

Responsibilities:

- re-query blob metadata using `useBlobMetadata`
- display upload result details
- build direct object URL
- build filtered explorer URL

Important implementation detail:

The component normalizes the blob name before generating URLs. This avoids broken links when the metadata source includes a full blob key like `@account/blobName` instead of only the suffix.

## 5. Verify Flow

### 5.1 `src/features/verify/pages/VerifyPage.tsx`

Responsibilities:

- manage verify form state
- validate account and blob name input
- validate presence of frontend Shelby API key
- submit a verification target to child result view

Local state owned here:

- `account`
- `blobName`
- `submitted`
- `error`

The page does not fetch metadata itself. It passes the submitted target to `VerifyResult`.

### 5.2 `src/features/verify/components/VerifyResult.tsx`

Responsibilities:

- query `useBlobMetadata`
- show loading, error, or resolved object state
- display metadata fields
- generate direct object URL
- generate filtered explorer URL

Important implementation detail:

Like the upload result component, this component normalizes the blob name before generating URLs so the explorer link points to:

`/blobs?name=<blobName>`

instead of an unfiltered account blobs page.

## 6. History Flow

### 6.1 `src/features/history/pages/HistoryPage.tsx`

Responsibilities:

- read connected account from wallet state
- query account blobs with `useAccountBlobs`
- show account summary and recent blob list
- generate direct object URL per blob
- generate filtered explorer URL per blob

Why this page matters:

It is currently the most reliable source for normalized blob URLs because returned metadata often includes `blobNameSuffix`, which is the cleanest input for both blob links and explorer filtering.

## 7. Shared Utilities

### 7.1 `src/shared/lib/blob.ts`

Responsibilities:

- normalize blob names
- extract blob name suffix from a full blob key
- build direct object URLs
- build explorer URLs with `name=` query parameter
- format byte sizes
- create default blob names from local files
- calculate expiration timestamps in microseconds

This file is central to keeping Upload, Verify, and History consistent.

### 7.2 `src/shared/ui/Card.tsx`

Responsibilities:

- provide a reusable feature card wrapper
- keep page sections visually consistent

### 7.3 `src/shared/ui/KeyValueList.tsx`

Responsibilities:

- render metadata rows consistently
- support linked values for blob and explorer URLs

## 8. Current State Ownership Summary

### App Shell

Owned by:

- `App.tsx`

Includes:

- theme state
- shell layout
- navigation

### Wallet State

Owned by:

- Aptos wallet adapter provider
- consumed in `WalletPanel`, `UploadPage`, and `HistoryPage`

### Upload State

Owned by:

- `UploadPage`

Includes:

- file selection
- blob name input
- expiration input
- latest upload summary

### Verify State

Owned by:

- `VerifyPage`

Includes:

- account input
- blob name input
- submitted lookup target

### Remote Shelby State

Owned by:

- React Query hooks from `@shelby-protocol/react`

Includes:

- upload mutation state
- blob metadata query state
- account blob history query state

## 9. Known Gaps After Part 3

These are not blockers for the current MVP, but they are the next cleanup targets:

- add copy actions for direct object URL and explorer URL in result panels
- add toast notifications for connect, upload, and verification outcomes
- add loading overlays or skeleton states for richer UX
- split heavy runtime chunks further to reduce initial JS cost
- improve test coverage for blob name normalization helpers

## 10. Definition of Part 3 Completion

Part 3 is complete when:

- the routing tree is documented clearly
- each feature page has its runtime ownership described
- the wallet, upload, verify, and history flows are mapped component by component
- shared blob URL logic is identified as a cross-feature dependency
- the document reflects the code that currently exists in the repository
