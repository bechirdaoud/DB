import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { hasAdminRole, hasSecondFactor } from "./lib/auth-claims";

const isClerkConfigured =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  if (!isClerkConfigured) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  }

  const { userId, sessionClaims, redirectToSignIn } = await auth();

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
