

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

// 🛡 Define protected routes (Clerk will require login)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// ⚙️ Arcjet setup – lightweight mode for Edge runtime
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Basic request protection (DRY_RUN = logs only, low overhead)
    shield({
      mode: "DRY_RUN", // change to "LIVE" after verifying build works fine
    }),
    // Simple bot detection
    detectBot({
      mode: "DRY_RUN", // non-blocking to keep file size small
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    }),
  ],
});

// 👤 Clerk authentication middleware
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Redirect unauthenticated users accessing protected routes
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // Otherwise continue request
  return NextResponse.next();
});

// ✅ Chain Arcjet first, then Clerk
export default createMiddleware(aj, clerk);

// ✅ Config — no Node runtime here (Edge compatible)
export const config = {
  matcher: [
    // Exclude Next.js internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};


