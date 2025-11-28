// /lib/arcjet-protect.js
import arcjet, { shield, detectBot } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "DRY_RUN" }), // Use "LIVE" later
    detectBot({
      mode: "DRY_RUN",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    }),
  ],
});

// ✅ A safe wrapper to protect any request
export async function protectRequest(req, userId = null) {
  try {
    const decision = await aj.protect(req, { userId });
    if (decision.isDenied()) {
      throw new Error("Blocked by Arcjet policy");
    }
  } catch (error) {
    console.error("Arcjet Protection Error:", error.message);
    throw new Error("Request denied for security reasons");
  }
}
