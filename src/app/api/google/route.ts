import { cookies } from "next/headers";
import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/server/lib/oauth";
import { google_code_verifier, google_oauth_state } from "@/utils/constants";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];

  const url = google.createAuthorizationURL(state, codeVerifier, scopes);

  cookies().set(google_oauth_state, state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });
  cookies().set(google_code_verifier, codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
