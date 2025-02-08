"use server";

import { revalidatePath } from "next/cache";

export async function mutatePath(path: string) {
  revalidatePath(path);
}
