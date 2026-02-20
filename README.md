# Auth integration

This project is configured to use **Clerk** authentication.

## How to run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template and fill values:
   ```bash
   cp .env.example .env.local
   ```
3. Add Clerk keys in `.env.local`.
4. Run Prisma migrations (or push schema) and seed if needed.
5. Start the app:
   ```bash
   npm run dev
   ```

## Required environment variables

- `DATABASE_URL` (PostgreSQL connection string)
- `ADMIN_EMAIL` (seed/admin bootstrap value)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Vercel deployment check

If Vercel shows `MIDDLEWARE_INVOCATION_FAILED`, make sure both Clerk keys are set in the Vercel project environment variables for the target environment (Preview/Production), then redeploy.


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
