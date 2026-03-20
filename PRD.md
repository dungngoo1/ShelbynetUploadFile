# Product Requirements Document

## Project

Verifiable Decentralized File Uploader & Provenance Viewer

## Repository

`ShelbynetUploadFile`

## Document Status

Draft v1

## Last Updated

2026-03-20

## 1. Product Summary

This project is a lightweight web application built for `shelbynet` using Shelby's React SDK and browser SDK flow. The application allows users to connect an Aptos wallet, upload files to Shelby storage, retrieve file metadata, generate direct object links, and verify uploaded objects by account and object key.

The first version focuses on a safe public web architecture for a browser-based dApp. The MVP does not depend on exposing private signing material or trusted server credentials inside the frontend.

## 2. Problem Statement

Small AI teams, creators, and researchers often need a simple way to:

- upload media or small datasets
- share a retrievable file link
- inspect object metadata
- validate which account uploaded the object
- keep a verifiable trail tied to Shelby and Aptos-linked infrastructure

Traditional centralized storage solves upload and retrieval, but does not naturally provide a blockchain-adjacent workflow for account-linked object registration and verification. Shelby provides a developer network, SDKs, explorer tooling, and browser-compatible upload and download flows that make this possible.

## 3. Product Goal

Build a simple React-based dApp that proves the following user journey works well on `shelbynet`:

1. Connect wallet
2. Upload file
3. View resulting object metadata
4. Open object using a direct link
5. Verify an uploaded object later using account address and object key

## 4. Non-Goals for MVP

The MVP will not include the following unless an official Shelby public API or SDK flow is confirmed during implementation:

- generalized proof display for every `PUT` and `GET`
- on-chain read-authenticity proof for every object retrieval
- backendless S3 Gateway write flow in a public frontend
- production-grade persistent storage guarantees
- official Shelby pricing comparison claims against AWS S3
- gated dataset access control with Move modules
- team collaboration and role-based access management

## 5. Source-Verified Product Constraints

The following constraints are based on Shelby official documentation as of 2026-03-20:

- Shelby provides a React SDK and browser upload flow suitable for frontend apps.
- Browser upload is wallet-driven and requires an Aptos account.
- The SDK supports querying blob metadata and account blob listings.
- Download URLs can be constructed for browser retrieval.
- `shelbynet` is a developer prototype network and may be wiped roughly weekly.
- S3 Gateway is S3-compatible, but its configuration includes trusted signing material and secrets that are not appropriate to expose in a public browser app.
- Uploads require expiration values.

These constraints directly shape the MVP architecture.

## 6. Target Users

Primary users:

- AI image creators
- researchers sharing small datasets
- independent builders experimenting with decentralized media provenance
- web3 developers exploring Shelby storage

Secondary users:

- hackathon teams
- ecosystem reviewers
- technical evaluators testing Shelby SDK ergonomics in React apps

## 7. User Value Proposition

The user gets a simple browser app that can:

- upload a file to Shelby using wallet-based flow
- show object metadata in a clean interface
- provide a direct object link
- help verify an object by owner account and key
- show explorer-linked references for additional inspection

## 8. MVP Feature Set

### 8.1 Wallet Connection

The app must allow the user to connect an Aptos-compatible wallet supported by the Shelby browser flow.

MVP requirements:

- connect wallet
- display connected account
- block upload actions until wallet is connected

### 8.2 File Upload

The app must allow a connected user to upload one file at a time.

MVP requirements:

- choose a file from the browser
- enter or compute a blob name
- set expiration
- start upload
- show loading, success, and failure states

### 8.3 Upload Result View

After a successful upload, the app must show object details relevant to future verification.

MVP requirements:

- blob name
- owner account
- file size
- expiration value
- updated time if available
- direct download URL
- explorer link when available

### 8.4 Object Verification

The app must provide a verification page or panel where the user can input an account address and object key to inspect the object's metadata.

MVP requirements:

- input account address
- input blob name or object key
- query object metadata
- show found or not found state
- show metadata if present
- provide direct object link

### 8.5 Upload History

The app must show recent uploaded objects associated with the currently connected account.

MVP requirements:

- list objects returned from account blob query
- sort by newest activity if possible
- allow click-through to detail or verify view

## 9. UX Principles

The MVP should feel clear and trustworthy rather than overloaded.

UX principles:

- show the system state at each step
- clearly distinguish upload, verification, and history
- never hide testnet limitations
- make copyable values easy to use
- let users open explorer and download links directly

## 10. User Stories

### Upload Stories

- As a user, I want to connect my wallet so I can upload files to Shelby.
- As a user, I want to choose a file and submit it so I can store it on `shelbynet`.
- As a user, I want to set an expiration so the upload request is accepted by the protocol flow.

### Verification Stories

- As a user, I want to inspect the metadata of a known object so I can confirm it exists.
- As a user, I want to verify an object using account plus object key so I can reference it later.

### Retrieval Stories

- As a user, I want a direct link to the uploaded object so I can open or share it quickly.
- As a user, I want to view my uploaded objects so I can manage what I created in the current session or account.

## 11. Functional Requirements

### FR-1 Wallet

- The system shall support wallet connection before protected actions.
- The system shall show the currently connected account address.

### FR-2 Upload Form

- The system shall accept one local file from the user.
- The system shall capture a blob name.
- The system shall capture an expiration value.
- The system shall prevent submission when required input is missing.

### FR-3 Upload Execution

- The system shall invoke Shelby upload through the React or browser SDK flow.
- The system shall show upload progress state to the user.
- The system shall handle success and error states without reloading the page.

### FR-4 Metadata Display

- The system shall display uploaded object metadata returned from Shelby queries.
- The system shall display direct retrieval information when available.
- The system shall provide a way to copy key object identifiers.

### FR-5 Verification

- The system shall accept account address and blob name or object key as user input.
- The system shall query object metadata using Shelby SDK query capabilities.
- The system shall show whether the object could be resolved.

### FR-6 History

- The system shall query blobs for the connected account.
- The system shall render a list of blobs in the UI.

### FR-7 Error Handling

- The system shall show clear validation errors for wallet, upload form, and verification input.
- The system shall show network or RPC failure states in human-readable language.

## 12. Non-Functional Requirements

### NFR-1 Security

- No trusted private key shall be embedded in the frontend.
- No S3 Gateway shared secret shall be embedded in the frontend.
- The app shall use the correct Shelby key type for browser usage.
- User inputs shall be validated before SDK execution.

### NFR-2 Performance

- The app should respond immediately to user actions with visible UI feedback.
- The app should avoid blocking the interface during upload and metadata queries.

### NFR-3 Reliability

- The app must degrade gracefully if `shelbynet` data is unavailable or reset.
- The app must warn users that the developer network can be wiped.

### NFR-4 Developer Experience

- The codebase should keep upload, verification, and history logic separated by feature.
- The app should be easy to extend with future wallet, explorer, and backend integrations.

## 13. Security Requirements

This project has a strict public frontend security boundary.

Required controls:

- never expose `aptosPrivateKey` in browser code
- never expose S3 Gateway `secretAccessKey` in browser code
- use frontend-safe API credentials only
- validate file size before upload
- validate file type when possible
- normalize blob naming rules
- restrict invalid expiration input
- surface `shelbynet` instability clearly in the UI

## 14. Recommended Architecture

### Frontend

- React application
- TanStack Query
- Shelby React SDK
- Aptos wallet adapter integration

### Core Modules

- `wallet`
- `upload`
- `verify`
- `history`
- `shared/ui`
- `shared/lib`

### External Systems

- Shelby RPC
- Shelby explorer
- Aptos wallet provider

## 15. Data Flow

### Upload Flow

1. User connects wallet.
2. User selects file and expiration.
3. Frontend invokes Shelby upload mutation.
4. Frontend receives upload result.
5. Frontend queries or renders metadata.
6. Frontend shows direct link and verification fields.

### Verification Flow

1. User inputs account address and object key.
2. Frontend executes metadata query.
3. Frontend renders found or not found state.
4. Frontend provides link to object and explorer context.

### History Flow

1. User connects wallet.
2. Frontend queries account blobs.
3. Frontend lists returned objects.
4. User opens an object from the list to inspect details.

## 16. UI Pages

### Page 1: Home / Upload

Purpose:

- primary landing experience
- wallet connect
- upload form
- immediate upload result

### Page 2: Verify

Purpose:

- object metadata lookup by account and key

### Page 3: History

Purpose:

- account-level blob listing

## 17. Metrics for MVP

Primary metrics:

- successful wallet connections
- successful uploads
- successful metadata resolutions
- successful object link openings

Secondary metrics:

- upload failure rate
- verification failure rate
- median client-observed upload duration
- median client-observed metadata query duration

## 18. Risks

### Risk 1: Testnet Instability

`shelbynet` may be wiped, which can make historical uploads disappear.

Mitigation:

- add a persistent warning banner
- do not market the app as durable storage

### Risk 2: Overstated Provenance Claims

The term "cryptographic receipt for every read and write" may overpromise beyond what the public docs currently expose clearly in browser-facing flows.

Mitigation:

- describe the MVP around object metadata, explorer links, and account-linked upload verification
- add deeper proof views only if an official API is confirmed during implementation

### Risk 3: Security Misconfiguration

A developer may try to use S3 Gateway credentials in frontend code.

Mitigation:

- keep S3 Gateway outside MVP browser architecture
- document trust boundary in README and code comments

### Risk 4: User Input Errors

Account, object key, expiration, or file input may be malformed.

Mitigation:

- strict client-side validation
- clear inline error messages

## 19. Success Criteria

The MVP is successful when:

- a user can connect a wallet
- a user can upload a file successfully on `shelbynet`
- the app displays object metadata after upload
- the app can resolve a previously uploaded object using account and key
- the app clearly communicates developer-network limitations

## 20. Open Questions

These questions should be resolved during implementation and source validation:

- Which metadata fields are consistently returned by the current React SDK hooks?
- Which explorer deep-link pattern is most stable for object-level navigation?
- Is there a public SDK or API flow for displaying deeper proof artifacts beyond metadata and object registration context?
- Which wallet integration path is most stable with the current Shelby React SDK example set?

## 21. Delivery Plan

### Phase 1

- scaffold React app
- configure Shelby client provider
- add wallet connection

### Phase 2

- implement upload form
- implement upload mutation
- implement result display

### Phase 3

- implement verify page
- implement account history page

### Phase 4

- refine validation
- refine error states
- add warnings and docs

## 22. Definition of Done

The product increment is done when:

- all MVP features are present
- no trusted secrets are exposed in frontend code
- the upload flow works on `shelbynet`
- verification by account and key works
- README explains setup, limitations, and supported flows

## 23. Official References

- Shelby Docs home: https://docs.shelby.xyz/
- React SDK: https://docs.shelby.xyz/sdks/react
- React upload mutation: https://docs.shelby.xyz/sdks/react/mutations/use-upload-blobs
- React blob metadata query: https://docs.shelby.xyz/sdks/react/queries/use-blob-metadata
- React account blobs query: https://docs.shelby.xyz/sdks/react/queries/use-account-blobs
- Browser upload guide: https://docs.shelby.xyz/sdks/typescript/browser/guides/upload
- Browser download guide: https://docs.shelby.xyz/sdks/typescript/browser/guides/download
- Acquire API keys: https://docs.shelby.xyz/sdks/typescript/acquire-api-keys
- Networks: https://docs.shelby.xyz/protocol/architecture/networks
- Explorer docs: https://docs.shelby.xyz/tools/explorer
- Explorer app: https://explorer.shelby.xyz/
- S3 Gateway: https://docs.shelby.xyz/tools/s3-gateway
- S3 Gateway uploads: https://docs.shelby.xyz/tools/s3-gateway/uploads
