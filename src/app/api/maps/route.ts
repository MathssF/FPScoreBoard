import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

// Lê config.json
function loadConfig() {
  try {
    const configPath = path.join(process.cwd(), "config.json");
    const file = fs.readFileSync(configPath, "utf-8");
    const json = JSON.parse(file);

    if (!json.data) throw new Error("Invalid config: missing 'data'.");

    return {
      host: json.data.host,
      port: json.data.port || "3306",
      user: json.data.user,
      password: json.data.pass,
      database: json.data.name,
    };
  } catch (error) {
    console.error("Error loading config.json:", error);
    throw new Error("Config file error.");
  }
}

// GET maps stats
export async function GET() {
  try {
    const dbConfig = loadConfig();

    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: Number(dbConfig.port),
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });

    const [rows] = await connection.execute<RowDataPacket[]>(`
      SELECT
        matchid,
        mapnumber,
        start_time,
        end_time,
        winner,
        mapname,
        team1_score,
        team2_score
      FROM matchzy_stats_maps
    `);

    await connection.end();

    return NextResponse.json({ maps: rows });
  } catch (error) {
    console.error("Error: Maps not found:", error);
    return NextResponse.json(
      { maps: [], error: "Error loading maps." },
      { status: 500 }
    );
  }
}
