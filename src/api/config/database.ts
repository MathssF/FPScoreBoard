import fs from "fs";
import path from "path";

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
 * Lê e retorna o conteúdo do arquivo database.json
 * Se algo der errado, retorna valores padrão.
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
