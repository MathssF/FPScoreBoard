import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
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

    const query = `
      SELECT
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
      FROM matchzy_stats_matches
    `;

    const [rows] = await connection.execute<RowDataPacket[]>(query);

    /* const [rows] = await connection.execute<Match[]>(
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
    ); */

    await connection.end();

    const matches: Match[] = (rows as RowDataPacket[]).map((r: any) => ({
      matchid: Number(r.matchid),
      start_time: String(r.start_time),
      end_time: r.end_time ? String(r.end_time) : null,
      winner: String(r.winner),
      series_type: String(r.series_type),
      team1_name: String(r.team1_name),
      team1_score: Number(r.team1_score),
      team2_name: String(r.team2_name),
      team2_score: Number(r.team2_score),
      server_ip: String(r.server_ip),
    }));

    // return NextResponse.json({ matches: rows });
    return NextResponse.json({ matches });

  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    return NextResponse.json(
      { matches: [], error: "Erro ao buscar partidas" },
      { status: 500 }
    );
  }
}
