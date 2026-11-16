import { readdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supportedExtensions = new Set([".pdf", ".png", ".jpg", ".jpeg", ".webp"]);

export async function GET() {
  const directory = path.join(process.cwd(), "certificate");

  try {
    const files = await readdir(directory, { withFileTypes: true });
    const certificates = files
      .filter((file) => file.isFile() && supportedExtensions.has(path.extname(file.name).toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      .map((file) => ({
        name: file.name,
        title: path.basename(file.name, path.extname(file.name)).replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim(),
        type: path.extname(file.name).toLowerCase() === ".pdf" ? "pdf" : "image",
        url: `/api/certificates/${encodeURIComponent(file.name)}`,
      }));

    return NextResponse.json(certificates, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json([], { headers: { "Cache-Control": "no-store" } });
  }
}
