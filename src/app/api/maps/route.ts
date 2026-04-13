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
      
      const base = config.apiBase!.replace(/\/$/, "");
      const path = (config.apiMap || "maps").replace(/^\//, "");

      const res = await fetch(`${base}/${path}, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();

      // esperado: { maps: [...] }
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