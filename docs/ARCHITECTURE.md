# Part 2: Frontend Architecture

## Purpose

This document defines the repository structure and implementation boundaries for the React MVP described in [PRD.md](/d:/ShelbynetUploadFile/PRD.md).

## Architecture Summary

The application is a public browser dApp built with React, TypeScript, TanStack Query, the Shelby React SDK, and Aptos wallet adapter integration.

The architecture follows a feature-first structure:

- `app`: routing, providers, and top-level shell
- `features/upload`: upload form and upload result display
- `features/verify`: object verification flow
- `features/history`: connected account blob listing
- `features/wallet`: wallet connection UI
- `shared`: reusable UI, config, utils, and types

## Security Boundary

This frontend must never contain trusted signing material.

Allowed in browser:

- Shelby public client configuration
- frontend-safe API key
- wallet adapter signer flow

Not allowed in browser:

- S3 Gateway shared secret
- Aptos private key for signing
- backend automation credentials

## Source Tree

```text
ShelbynetUploadFile/
  docs/
    ARCHITECTURE.md
  src/
    app/
      App.tsx
      providers.tsx
      routes.tsx
    features/
      history/
        components/
        pages/
      upload/
        components/
        pages/
      verify/
        components/
        pages/
      wallet/
        components/
    shared/
      config/
      lib/
      ui/
    main.tsx
    styles.css
  .env.example
  PRD.md
  README.md
  package.json
```

## Routing Model

- `/`: upload page and latest upload result
- `/verify`: object verification page
- `/history`: current wallet account history page

## State Model

Remote state:

- Shelby queries and mutations through React Query hooks

Local UI state:

- file selection
- blob name
- expiration form value
- last successful upload descriptor
- verification form values

## Data Ownership

Upload page owns:

- selected file
- upload form state
- last upload summary shown to the user

Verify page owns:

- verification account input
- verification blob name input
- current submitted verification target

History page owns:

- connected account derived from wallet

## Why This Structure

This structure keeps protocol interaction close to the feature that needs it, while shared concerns such as config, formatting, and shell layout stay centralized.

It is optimized for the next implementation phase:

- plugging in real Shelby hooks
- expanding validation
- adding tests later without reshuffling folders
