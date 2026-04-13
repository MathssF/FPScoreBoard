import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export interface DatabaseConfig {
  mode: "api" | "mysql";
  apiBase?: string;
  apiMap?: string;
  apiMatches?: string;
  apiPlayerMatches?:string;

  host?: string;
  port?: string;
  user?: string;
  pass?: string;
  name?: string;

  needConfig?: boolean;

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

  // ---------- ENV VARS ----------
  const envApiBase = process.env.CS_API_BASE;
  const envApiMaps = process.env.CS_MAP;
  const envApiMatches = process.env.CS_MATCHES;
  const envApiPlayers = process.env.CS_PLAYER_MATCHES;

  const jsonApiBase = json.altData;

  // needConfig é só flag de setup (independente do mode)
  const needConfig =
    process.env.NEED_CONFIG === "true" ||
    json.needConfig === true ||
    false;

  const lists = json.lists || { users: [], players: [] };

  // =========================================================
  // PRIORIDADE A — API via ENV
  // =========================================================
  if (envApiBase) {
    return {
      mode: "api",
      apiBase: envApiBase,
      apiMap: envApiMaps || json.altApi?.maps || "maps",
      apiMatches: envApiMatches || json.altApi?.matches || "matches",
      apiPlayerMatches: envApiPlayers || json.altApi?.playerMatches || "players",
      lists,
      options: { lang: lang.toLowerCase() },
    };
  }

  // =========================================================
  // PRIORIDADE B — API via config.json
  // =========================================================
  if (jsonApiBase) {
    return {
      mode: "api",
      apiBase: jsonApiBase,
      apiMap: json.altApi?.maps || "maps",
      apiMatches: json.altApi?.matches || "matches",
      apiPlayerMatches: json.altApi?.playerMatches || "players",
      lists,
      options: { lang: lang.toLowerCase() },
    };
  }

  // =========================================================
  // PRIORIDADE C — MYSQL via ENV
  // =========================================================
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
      lists,
      options: { lang: lang.toLowerCase() },
    };
  }

  // =========================================================
  // PRIORIDADE D — MYSQL via config.json
  // =========================================================
  return {
    mode: "mysql",
    host: json.data?.host || "",
    port: json.data?.port || "3306",
    user: json.data?.user || "",
    pass: json.data?.pass || "",
    name: json.data?.name || "",
    lists,
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
