import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), "config.json");
    let configExists = false;
    let needConfig = true;

    try {
      const data = fs.readFileSync(configPath, "utf-8");
      const json = JSON.parse(data);
      configExists = true;
      needConfig = json.needConfig !== false;
    } catch (error) {
      configExists = false;
    }

    if (!configExists) {
      const envNeedConfig = process.env.NEED_CONFIG;
      if (envNeedConfig === "false") {
        needConfig = false;
      } else {
        needConfig = true;
      }
    }

    return NextResponse.json({ needConfig });
  } catch (err) {
    return NextResponse.json({ needConfig: true });
  }
}
