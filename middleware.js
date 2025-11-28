// // middleware.js
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)",
//   "/account(.*)",
//   "/transaction(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, redirectToSignIn } = await auth();

//   if (!userId && isProtectedRoute(req)) {
//     return redirectToSignIn();
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|svg|ttf|woff2?|ico)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };

// middleware.js

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ---- Arcjet: dynamic import (to keep Edge bundle small) ----
let ajInstance;

/**
 * Lazily load Arcjet on first request.
 */
async function getArcjet() {
  if (!ajInstance) {
    const arcjetModule = await import("@arcjet/next");
    const arcjet = arcjetModule.default;
    const { shield, detectBot } = arcjetModule;

    ajInstance = arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        // Shield protection
        shield({
          mode: "LIVE", // use "DRY_RUN" if you only want to log
        }),
        // Bot detection
        detectBot({
          mode: "LIVE", // use "DRY_RUN" to not block
          allow: [
            "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
            "GO_HTTP",                // For Inngest or similar
          ],
        }),
      ],
    });
  }
  return ajInstance;
}

// ---- Clerk: protected routes ----
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// ---- Combined middleware: Arcjet first, then Clerk ----
export default clerkMiddleware(async (auth, req) => {
  // 1) Arcjet protection
  const aj = await getArcjet();
  await aj.protect(req);

  // 2) Clerk auth
  const { userId, redirectToSignIn } = await auth();

  // Redirect unauthenticated users trying to access protected routes
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // Allow request to continue
  return NextResponse.next();
});

// ---- Middleware config ----
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
