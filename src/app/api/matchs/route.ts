import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import type Match from "@/interfaces/matchs";
import { getDatabaseConfig } from "../config/route";

// Converte rows MySQL → Match[]
function mapMatches(rows: RowDataPacket[]): Match[] {
  return rows.map((r: any) => ({
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
}

export async function GET() {
  try {
    const config = getDatabaseConfig();

    // =============================
    // MODO API
    // =============================
    if (config.mode === "api") {
      const res = await fetch(`${config.apiBase}/matches`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();

      // assumindo que a API já retorna { matches: [] }
      return NextResponse.json(data);
    }

    // =============================
    // MODO MYSQL
    // =============================
    const connection = await mysql.createConnection({
      host: config.host,
      port: Number(config.port),
      user: config.user,
      password: config.pass,
      database: config.name,
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
    await connection.end();

    const matches = mapMatches(rows);

    return NextResponse.json({ matches });

  } catch (error) {
    console.error("Error: Matches not found:", error);

    return NextResponse.json(
      { matches: [], error: "Error: Matches not found" },
      { status: 500 }
    );
  }
}