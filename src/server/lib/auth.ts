import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";
import { defaultSession, SESSION } from "@/utils/constants";
// Types
import { SessionDataProps } from "@/types";

const secret = process.env.HASH_SECRET;

if (!secret) throw new Error("Missing Hash Secret");

export const sessionOptions: SessionOptions = {
  password: secret,
  cookieName: SESSION,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
  },
};

// Retrieve Session
export async function getSession() {
  const session = await getIronSession<SessionDataProps>(
    cookies(),
    sessionOptions,
  );

  if (!session?.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.guestId = defaultSession.guestId;
    session.userId = defaultSession.userId;
  }

  return session;
}

// IsAuth
export async function isAuthenticated() {
  const session = await getSession();

  return session?.userId ? session?.userId : session?.guestId;
}
