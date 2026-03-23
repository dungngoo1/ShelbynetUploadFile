# ShelbynetUploadFile

React MVP for uploading files to Shelby testnet, viewing blob metadata, and verifying objects by account and blob name.

## Current Scope

- wallet-based upload flow for a public browser app
- metadata lookup for uploaded blobs
- account blob history view
- direct object URL generation
- explorer links for uploaded and verified blobs
- runtime-safe boot with visible error handling instead of blank-page failure

## Architecture

- [PRD.md](/d:/ShelbynetUploadFile/PRD.md)
- [ARCHITECTURE.md](/d:/ShelbynetUploadFile/docs/ARCHITECTURE.md)
- [FLOWS.md](/d:/ShelbynetUploadFile/docs/FLOWS.md)
- [QUALITY.md](/d:/ShelbynetUploadFile/docs/QUALITY.md)
- [ROADMAP.md](/d:/ShelbynetUploadFile/docs/ROADMAP.md)
- [WORKFLOW.md](/d:/ShelbynetUploadFile/docs/WORKFLOW.md)

## Environment

Copy `.env.example` to `.env` and fill in:

- `VITE_SHELBY_API_KEY`
- `VITE_APTOS_TESTNET_API_KEY`

Only frontend-safe keys belong here. Do not place private keys or S3 Gateway secrets in the browser app.

## Run

```bash
npm install
npm run dev
```

## Preview

```bash
npm run build
npm run preview
```

If `.env` is missing `VITE_SHELBY_API_KEY`, the app now renders a visible system-status warning instead of silently failing useful flows.

## Notes

- The frontend is designed for Shelby React SDK and browser SDK usage.
- `shelbynet` is a developer network and may be wiped.
- S3 Gateway credentials are intentionally out of scope for this public frontend.
- Current bundle size is large because Shelby SDK upload flow pulls in erasure-coding WASM. Code-splitting is a recommended next optimization.
