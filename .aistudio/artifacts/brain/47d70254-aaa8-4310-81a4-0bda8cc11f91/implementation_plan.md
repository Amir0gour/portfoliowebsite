# Implementation Plan: Address GitHub Google API Key Alert & Transition to Environment Variables

## Executive Summary
GitHub Secret Scanning sent an alert because `firebase-applet-config.json` containing a Google client API key (`AIza...`) was committed to the repository. While Firebase Web API keys are client-side public identifiers (secured by Firestore Security Rules and GCP restrictions rather than secrecy), migrating client credentials to Vite environment variables (`VITE_FIREBASE_*`), gitignoring local configuration files, and restricting the key in Google Cloud Platform eliminates GitHub scanner warnings, prevents unintended leaks, and aligns with production deployment best practices (e.g. Netlify / Vercel).

---

## User Review Required

> [!IMPORTANT]
> **Key Restriction in Google Cloud Console**:
> Even when using environment variables, Vite bundles `VITE_*` variables into client-side JavaScript. To ensure complete security against unauthorized domain usage:
> 1. Go to **Google Cloud Console** > **APIs & Services** > **Credentials**.
> 2. Select the API Key (`AIza...`).
> 3. Under **Set application restrictions**, choose **Websites / HTTP referrers** and add your approved domains (e.g., your Netlify domain `https://your-domain.netlify.app/*` and Cloud Run / AI Studio preview domains).
> 4. Under **API restrictions**, restrict key usage only to **Cloud Firestore API** and **Identity Toolkit API**.

---

## Proposed Changes

### Configuration & Environment Setup

#### [/.gitignore]
- Add `firebase-applet-config.json` to `.gitignore` so the raw file is never committed to GitHub or Git history in future pushes.

#### [/.env.example]
- Add placeholder definitions for all Firebase client configurations:
  ```env
  VITE_FIREBASE_API_KEY="your-api-key"
  VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
  VITE_FIREBASE_PROJECT_ID="your-project-id"
  VITE_FIREBASE_FIRESTORE_DATABASE_ID="your-database-id"
  VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
  VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
  VITE_FIREBASE_APP_ID="your-app-id"
  ```

#### [/.env]
- Create the local `.env` populated with the current Firebase values from `firebase-applet-config.json` so the app runs smoothly in development and AI Studio preview.

---

### Firebase Service Layer

#### [/src/services/firebase.ts]
- Update `src/services/firebase.ts` to dynamically assemble Firebase configuration:
  - First read from `import.meta.env.VITE_FIREBASE_*`.
  - Provide a safe fallback to `firebase-applet-config.json` if environment variables are not yet injected (preventing broken builds in environments where env vars haven't yet been configured).
- Ensure strict TypeScript typing and error messaging if configuration is missing.

---

### Documentation / Guide for Netlify

#### [/NETLIFY_FIREBASE_SETUP.md]
- Provide concise, step-by-step instructions for:
  1. Adding `VITE_FIREBASE_*` variables into the **Netlify Site Settings > Environment Variables** dashboard.
  2. Resolving or dismissing the GitHub alert with "False positive: public Firebase web client key" or "Used in tests/restricted key".
  3. Setting domain referrers in Google Cloud Console.

---

## Verification Plan

### Automated Checks
- Run `lint_applet` to verify no import or TypeScript errors in `src/services/firebase.ts`.
- Run `compile_applet` to ensure Vite successfully bundles the app with the new env variable pattern.

### Manual / Functional Verification
- Verify that Firestore queries and Firebase Authentication continue to initialize without connection errors.
- Confirm that `firebase-applet-config.json` and `.env` are properly ignored by Git rules.
