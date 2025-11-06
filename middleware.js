import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Import Arcjet dynamically to reduce Edge bundle size
let ajInstance;
async function getArcjet() {
  if (!ajInstance) {
    const arcjet = (await import("@arcjet/next")).default;
    const { shield, detectBot } = await import("@arcjet/next");
    ajInstance = arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        shield({ mode: "DRY_RUN" }), // use "LIVE" in production
        detectBot({
          mode: "DRY_RUN",
          allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
        }),
      ],
    });
  }
  return ajInstance;
}

// Define protected routes (Clerk)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Middleware
export default clerkMiddleware(async (auth, req) => {
  // Run Arcjet check first (lightweight async import)
  const aj = await getArcjet();
  await aj.protect(req);

  const { userId, redirectToSignIn } = await auth();

  // Redirect unauthenticated users
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // Allow the request
  return NextResponse.next();
});

// Config — only one export allowed
export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|png|svg|ttf|woff2?|ico|zip)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
