"use server";

import { cookies } from "next/headers";

type CookieProps = {
  name: string;
  value: string;
  expiration?: Date;
};

export async function setServerCookie(args: CookieProps[]) {
  for (let i in args) {
    cookies().set(args[i].name, args[i].value, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      ...(args[i].expiration ? { expires: args[i].expiration } : {}),
    });
  }
}

export async function deleteServerCookie(args: string[]) {
  for (let i in args) {
    cookies().delete(args[i]);
  }
}
