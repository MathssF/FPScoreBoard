import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import type Match from "@/interfaces/matchs";

// Util
function loadConfig() {
  try {
    const configPath = path.join(process.cwd(), "config.json");
    const file = fs.readFileSync(configPath, "utf-8");
    const json = JSON.parse(file);

    if (!json.data)
      throw new Error("Invalid Config: field 'data' not found.");

    return {
      host: json.data.host,
      port: json.data.port || "3306",
      user: json.data.user,
      password: json.data.pass,
      database: json.data.name,
    };
  } catch (error) {
    console.error("Error in config.json:", error);
    throw new Error("File Error: config.json .");
  }
}

// Main
export async function GET() {
  try {
    const dbConfig = loadConfig();

    // Connect MySQL
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

    return NextResponse.json({ matches });

  } catch (error) {
    console.error("Error: Matchs not found: ", error);
    return NextResponse.json(
      { matches: [], error: "Error: Matchs not found" },
      { status: 500 }
    );
  }
}
