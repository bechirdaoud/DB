export type AppRole = "ADMIN" | "USER";

type ClaimsLike = {
  metadata?: { role?: unknown };
  publicMetadata?: { role?: unknown };
  role?: unknown;
  amr?: unknown;
  [key: string]: unknown;
};

const MFA_METHODS = new Set(["otp", "totp", "webauthn"]);

export function getRoleFromClaims(claims: ClaimsLike | null | undefined): AppRole {
  const rawRole =
    claims?.metadata?.role ?? claims?.publicMetadata?.role ?? claims?.role;
  return rawRole === "ADMIN" ? "ADMIN" : "USER";
}

export function hasAdminRole(claims: ClaimsLike | null | undefined): boolean {
  return getRoleFromClaims(claims) === "ADMIN";
}

export function hasSecondFactor(claims: ClaimsLike | null | undefined): boolean {
  if (!Array.isArray(claims?.amr)) {
    return false;
  }

  return claims.amr.some(
    (method) => typeof method === "string" && MFA_METHODS.has(method),
  );
}
