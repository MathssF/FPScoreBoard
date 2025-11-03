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

/**
 * Função utilitária: lê todo o database.json
 */
export function getDatabaseConfig(): DatabaseConfig {
  try {
    const filePath = path.join(process.cwd(), "database.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(data);

    // Corrige possíveis erros de digitação na chave "lang"
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
      options: {
        lang: langValue,
      },
    };
  } catch (error) {
    console.error("Erro ao ler o arquivo database.json:", error);

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
 * Fetch 1: Retorna toda a configuração
 */
export async function fetchDatabaseConfig() {
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

/**
 * Fetch 2: Retorna apenas o idioma
 */
export async function fetchLanguage() {
  try {
    const config = getDatabaseConfig();
    return NextResponse.json({ lang: config.options.lang });
  } catch (err) {
    console.error("Erro ao obter idioma do database.json:", err);
    return NextResponse.json({ lang: "en" });
  }
}
