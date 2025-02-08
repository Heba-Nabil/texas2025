import { cookies } from "next/headers";
import { generateState } from "arctic";
import { facebook } from "@/server/lib/oauth";
import { facebook_oauth_state } from "@/utils/constants";

export async function GET() {
  const state = generateState();
  const scopes = ["email", "public_profile"];

  const url = facebook.createAuthorizationURL(state, scopes);

  cookies().set(facebook_oauth_state, state, {
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
