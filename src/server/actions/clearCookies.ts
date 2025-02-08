"use server";

import { cookies } from "next/headers";

export async function clearServerCookie() {
  cookies()
    .getAll()
    .forEach((item) => cookies().delete(item.name));
}
