# Auth integration

This project is configured to use **Clerk** authentication.

## Environment

Set these variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Roles

Set `publicMetadata.role` (or `metadata.role`) to `ADMIN` for admin users.

## MFA-capable setup

1. In Clerk Dashboard, enable MFA methods (TOTP, OTP, or WebAuthn).
2. For admin routes, this project requires a verified second factor (`amr` claim must include one of: `otp`, `totp`, `webauthn`).
3. Non-admin signed-in routes under `/app/*` only require authentication.

## Route protection

- `/app/*` => any authenticated user
- `/admin/*` => authenticated user with `ADMIN` role and MFA

Server-side helper APIs are in `lib/auth.ts`.
