import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { hasAdminRole, hasSecondFactor } from "./lib/auth-claims";

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (!hasAdminRole(sessionClaims)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (!hasSecondFactor(sessionClaims)) {
      return NextResponse.redirect(new URL("/verify-mfa", req.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/app") && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next internals + static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
