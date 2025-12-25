import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export interface DatabaseConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
  lists: {
    users: any[];
    players: any[];
  };
  options: {
    lang: string;
  };
}

export function getDatabaseConfig(): DatabaseConfig {
  let json: any = {};

  try {
    const filePath = path.join(process.cwd(), "config.json");
    const data = fs.readFileSync(filePath, "utf-8");
    json = JSON.parse(data);
  } catch (error) {
    console.warn("config.json não encontrado, usando apenas .env");
  }

  const jsonLangKey =
    json.options &&
    Object.keys(json.options).find(
      (k) => k.replace(":", "").trim().toLowerCase() === "lang"
    );

  const lang =
    process.env.APP_LANG ||
    (jsonLangKey ? json.options[jsonLangKey] : null) ||
    "en";

  return {
    host: process.env.DB_HOST || json.data?.host || "",
    port: process.env.DB_PORT || json.data?.port || "3306",
    user: process.env.DB_USER || json.data?.user || "",
    pass: process.env.DB_PASS || json.data?.pass || "",
    lists: json.lists || { users: [], players: [] },
    options: {
      lang: lang.toLowerCase(),
    },
  };
}

/**
 * API Route Handler
 */
export async function GET() {
  try {
    const config = getDatabaseConfig();
    return NextResponse.json(config);
  } catch (err) {
    console.error("Erro ao obter database config:", err);

    return NextResponse.json({
      host: "",
      port: "3306",
      user: "",
      pass: "",
      lists: { users: [], players: [] },
      options: { lang: "en" },
    });
  }
}
