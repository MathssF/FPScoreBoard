import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "database.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(data);
    const lang = json?.options?.lang || "en";

    return NextResponse.json({ lang });
  } catch (err) {
    console.error("Erro ao ler o arquivo database.json:", err);
    return NextResponse.json({ lang: "en" });
  }
}
