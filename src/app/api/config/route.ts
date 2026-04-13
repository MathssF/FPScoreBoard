import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export interface DatabaseConfig {
  mode: "api" | "mysql";
  apiBase?: string;

  host?: string;
  port?: string;
  user?: string;
  pass?: string;
  name?: string;

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

  // ---------- LANG ----------
  const jsonLangKey =
    json.options &&
    Object.keys(json.options).find(
      (k) => k.replace(":", "").trim().toLowerCase() === "lang"
    );

  const lang =
    process.env.APP_LANG ||
    (jsonLangKey ? json.options[jsonLangKey] : null) ||
    "en";

  // ---------- PRIORIDADE DA API ----------
  const envApiBase = process.env.CS_API_BASE;
  const jsonApiBase = json.altData;

  if (envApiBase) {
    return {
      mode: "api",
      apiBase: envApiBase,
      lists: json.lists || { users: [], players: [] },
      options: { lang: lang.toLowerCase() },
    };
  }

  if (jsonApiBase) {
    return {
      mode: "api",
      apiBase: jsonApiBase,
      lists: json.lists || { users: [], players: [] },
      options: { lang: lang.toLowerCase() },
    };
  }

  // ---------- PRIORIDADE DO MYSQL ----------
  const envDbExists =
    process.env.DB_HOST ||
    process.env.DB_USER ||
    process.env.DB_PASS ||
    process.env.DB_NAME;

  if (envDbExists) {
    return {
      mode: "mysql",
      host: process.env.DB_HOST || "",
      port: process.env.DB_PORT || "3306",
      user: process.env.DB_USER || "",
      pass: process.env.DB_PASS || "",
      name: process.env.DB_NAME || "",
      lists: json.lists || { users: [], players: [] },
      options: { lang: lang.toLowerCase() },
    };
  }

  // ---------- FALLBACK config.json ----------
  return {
    mode: "mysql",
    host: json.data?.host || "",
    port: json.data?.port || "3306",
    user: json.data?.user || "",
    pass: json.data?.pass || "",
    name: json.data?.name || "",
    lists: json.lists || { users: [], players: [] },
    options: { lang: lang.toLowerCase() },
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
