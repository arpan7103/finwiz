

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


// import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// // 🛡 Define protected routes
// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)",
//   "/account(.*)",
//   "/transaction(.*)",
// ]);

// // ⚙️ Arcjet setup (DRY_RUN = lightweight + deploys fine)
// const aj = arcjet({
//   key: process.env.ARCJET_KEY,
//   rules: [
//     shield({
//       mode: "DRY_RUN", // change to "LIVE" after testing
//     }),
//     detectBot({
//       mode: "DRY_RUN", // low-overhead bot check
//       allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
//     }),
//   ],
// });

// // 👤 Clerk setup
// const clerk = clerkMiddleware(async (auth, req) => {
//   const { userId, redirectToSignIn } = await auth();

//   if (!userId && isProtectedRoute(req)) {
//     return redirectToSignIn();
//   }

//   return NextResponse.next();
// });

// // ✅ Combine both
// export default createMiddleware(aj, clerk);

// // ✅ SINGLE config export — only one allowed
// export const config = {
//   matcher: [
//     // Exclude Next.js internals and static assets
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API and TRPC routes
//     "/(api|trpc)(.*)",
//   ],
// };


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
