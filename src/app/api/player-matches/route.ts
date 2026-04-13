import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { getDatabaseConfig } from "../config/route";

export async function GET() {
  try {
    const config = getDatabaseConfig();

    // =============================
    // MODO API
    // =============================
    if (config.mode === "api") {
      const res = await fetch(`${config.apiBase}/players`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();

      // assumindo formato: { players: [...] }
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
    console.error("Error: Player Matches not found:", error);

    return NextResponse.json(
      { players: [], error: "Error loading player matches." },
      { status: 500 }
    );
  }
}