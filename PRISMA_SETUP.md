# Prisma + Postgres setup

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

```bash
cp .env.example .env
```

Update `.env` with your real Postgres credentials and set `ADMIN_EMAIL` to your email.

## 3) Create and apply the initial migration

```bash
npx prisma migrate dev --name init
```

This command creates SQL migration files in `prisma/migrations`, applies them to your Postgres database, and generates the Prisma Client.

## 4) Seed admin user

```bash
npx prisma db seed
```

The seed script upserts a user by `ADMIN_EMAIL` and ensures their role is `ADMIN`.

## 5) Optional: regenerate Prisma Client later

```bash
npx prisma generate
```
