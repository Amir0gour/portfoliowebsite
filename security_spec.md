# Security Spec

## Data Invariants
1. Portfolio data at `/portfolio/main` is publicly readable by all visitors to render the portfolio website, but updates require authentication and valid schema.
2. Inquiries at `/messages/{messageId}` can be created by visitors if payload adheres to length and field constraints (`name`, `email`, `subject`, `message`), but read, update, and delete access is restricted to authenticated administrators.
3. `/settings/admin` stores global admin configuration (like admin notification email). Read and write access is restricted to authenticated users / admins.
4. Catch-all: all other paths are strictly closed by default.

## Dirty Dozen Payloads (Target Rejections)
1. Unauthenticated write to `/portfolio/main` with arbitrary script payload -> DENIED.
2. Creation of `/messages/{messageId}` with oversized message (>5000 chars) -> DENIED.
3. Creation of `/messages/{messageId}` with missing `email` or `name` -> DENIED.
4. Anonymous visitor listing `/messages` -> DENIED.
5. Anonymous visitor reading other messages -> DENIED.
6. Malicious user modifying `/messages/{messageId}` -> DENIED.
7. Deletion of `/messages/{messageId}` by unauthenticated caller -> DENIED.
8. Unauthorized reading of `/settings/admin` without authentication -> DENIED.
9. Writing arbitrary collections `/unknown_col/{id}` -> DENIED by default match.
10. Writing invalid message ID like `../../evil` -> DENIED by `isValidId`.
11. Updating message status with ghost keys -> DENIED.
12. Attempt to write to `/admins/{uid}` without master rights -> DENIED.
