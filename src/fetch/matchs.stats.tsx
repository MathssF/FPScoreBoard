import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import type Match from "@/interfaces/matchs";
import { MatchsStats } from "@/interfaces/matchs";

// Função auxiliar: lê o config.json na raiz
function loadConfig() {
  try {
    const configPath = path.join(process.cwd(), "config.json");
    const file = fs.readFileSync(configPath, "utf-8");
    const json = JSON.parse(file);

    if (!json.data)
      throw new Error("Config inválido: campo 'data' não encontrado.");

    return {
      host: json.data.host,
      port: json.data.port || "3306",
      user: json.data.user,
      password: json.data.pass,
      database: json.data.name,
    };
  } catch (error) {
    console.error("Erro ao ler config.json:", error);
    throw new Error("Falha ao ler o arquivo de configuração.");
  }
}

// Função principal do endpoint
export async function GET() {
  try {
    const dbConfig = loadConfig();

    // Conexão MySQL
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: Number(dbConfig.port),
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });

    const [rows] = await connection.execute<Match[]>(
      `SELECT 
        matchid,
        start_time,
        end_time,
        winner,
        series_type,
        team1_name,
        team1_score,
        team2_name,
        team2_score,
        server_ip
      FROM matchzy_stats_matches`
    );

    await connection.end();

    return NextResponse.json({ matches: rows });
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    return NextResponse.json(
      { matches: [], error: "Erro ao buscar partidas" },
      { status: 500 }
    );
  }
}
