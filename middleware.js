

// import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)",
//   "/account(.*)",
//   "/transaction(.*)",
// ]);

// // Create Arcjet middleware
// const aj = arcjet({
//   key: process.env.ARCJET_KEY,
//   // characteristics: ["userId"], // Track based on Clerk userId
//   rules: [
//     // Shield protection for content and security
//     shield({
//       mode: "LIVE",
//     }),
//     detectBot({
//       mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//       allow: [
//         "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
//         "GO_HTTP", // For Inngest
//         // See the full list at https://arcjet.com/bot-list
//       ],
//     }),
//   ],
// });

// // Create base Clerk middleware
// const clerk = clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();

//   if (!userId && isProtectedRoute(req)) {
//     const { redirectToSignIn } = await auth();
//     return redirectToSignIn();
//   }

//   return NextResponse.next();
// });

// // Chain middlewares - ArcJet runs first, then Clerk
// export default createMiddleware(aj, clerk);

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };
// middleware.js
import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protect these routes with Clerk authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// --- Arcjet Security Setup ---
const aj = arcjet({
  key: process.env.ARCJET_KEY, // Your Arcjet API Key from .env.local
  rules: [
    // Basic protection from malicious traffic
    shield({
      mode: "LIVE", // Use "DRY_RUN" for testing
    }),
    // Bot detection
    detectBot({
      mode: "LIVE", // Blocks bots in production
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Allow search engine crawlers
        "GO_HTTP", // Allow internal tools (e.g., Inngest)
      ],
    }),
  ],
});

// --- Clerk Authentication Setup ---
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Redirect unauthenticated users if accessing protected pages
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // Allow request to proceed
  return NextResponse.next();
});

// --- Combine Arcjet + Clerk ---
export default createMiddleware(aj, clerk);

// --- Config for Vercel Build ---
export const config = {
  // 👇 This line prevents the 1 MB "Edge Function too large" error
  runtime: "nodejs",

  matcher: [
    // Exclude Next.js internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run middleware for API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};

