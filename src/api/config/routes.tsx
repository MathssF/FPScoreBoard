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
  try {
    const filePath = path.join(process.cwd(), "config.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(data);

    const langKey = Object.keys(json.options).find((k) =>
      k.replace(":", "").trim().toLowerCase() === "lang"
    );

    const langValue =
      langKey && json.options[langKey]
        ? json.options[langKey].toLowerCase()
        : "en";

    return {
      host: json.host || "",
      port: json.port || "3306",
      user: json.user || "",
      pass: json.pass || "",
      lists: json.lists || { users: [], players: [] },
      options: { lang: langValue },
    };
  } catch (error) {
    console.error("Error - Read config.json:", error);

    return {
      host: "",
      port: "3306",
      user: "",
      pass: "",
      lists: { users: [], players: [] },
      options: { lang: "en" },
    };
  }
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
