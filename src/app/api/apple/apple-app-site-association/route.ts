import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    ".well-known",
    "apple-app-site-association",
  );

  try {
    const appleAppSiteAssociation = await fs.readFile(filePath, "utf-8");

    return NextResponse.json(JSON.parse(appleAppSiteAssociation));
  } catch (error) {
    return redirect("/");
  }
}
