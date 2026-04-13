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

    if (json.altData) {
      return {
        host: 
      }
    }

    if (!json.data) throw new Error("Invalid config: missing 'data'.");

    return {
      host: json.data.host,
      port: json.data.port || "3306",
      user: json.data.user,
      password: json.data.pass,
      database: json.data.name,
      alt: false
    };
  } catch (error) {
    console.error("Error loading config.json:", error);
    throw new Error("Config file error.");
  }
}

// GET players stats
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
        steamid64,
        team,
        name,
        kills,
        deaths,
        assists,
        damage,
        enemy5ks,
        enemy4ks,
        enemy3ks,
        enemy2ks,
        utility_count,
        utility_damage,
        utility_successes,
        utility_enemies,
        flash_count,
        flash_successes,
        health_points_removed_total,
        health_points_dealt_total,
        shots_fired_total,
        shots_on_target_total,
        v1_count,
        v1_wins,
        v2_count,
        v2_wins,
        entry_count,
        entry_wins,
        equipment_value,
        money_saved,
        kill_reward,
        live_time,
        head_shot_kills,
        cash_earned,
        enemies_flashed
      FROM matchzy_stats_players
    `);

    await connection.end();

    return NextResponse.json({ players: rows });
  } catch (error) {
    console.error("Error: Player Matchs not found:", error);
    return NextResponse.json(
      { players: [], error: "Error loading player matchs." },
      { status: 500 }
    );
  }
}
