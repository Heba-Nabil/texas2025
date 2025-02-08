import { generateState } from "arctic";
import { apple } from "@/server/lib/oauth";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = generateState();
  const scopes = ["name", "email"];

  const url = apple.createAuthorizationURL(state, scopes);
  url.searchParams.set("response_mode", "form_post");

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
