"use client";

import { useMaps } from "@/context/maps";
import { useMemo, useState } from "react";
import Header from "@/component/header";
import LangFlags from "@/component/langFlags";

export default function MapsStatsPage() {
  const { maps, loading, error } = useMaps();
  const [filter, setFilter] = useState("");

  // agregação por mapa
  const aggregated = useMemo(() => {
    const grouped: Record<string, any> = {};

    for (const m of maps) {
      if (!grouped[m.mapname]) {
        grouped[m.mapname] = {
          map: m.mapname,
          matches: 0,
          team1Wins: 0,
          team2Wins: 0,
          totalRounds: 0,
        };
      }

      grouped[m.mapname].matches += 1;
      grouped[m.mapname].totalRounds += m.team1_score + m.team2_score;

      if (m.winner === "team1") grouped[m.mapname].team1Wins++;
      if (m.winner === "team2") grouped[m.mapname].team2Wins++;
    }

    return Object.values(grouped);
  }, [maps]);

  const filtered = useMemo(() => {
    return aggregated.filter((m: any) =>
      m.map.toLowerCase().includes(filter.toLowerCase())
    );
  }, [aggregated, filter]);

  // ---------------- loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-zinc-100">
        <Header />
        <LangFlags />
        <p>Carregando estatísticas de mapas...</p>
      </div>
    );
  }

  // ---------------- error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-red-400">
        <Header />
        <LangFlags />
        <p>{error}</p>
      </div>
    );
  }

  // ---------------- page
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      <Header />
      <LangFlags />

      <h1 className="text-3xl font-bold mb-6 text-center">
        Estatísticas de Mapas
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Filtrar mapa..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 w-80"
        />
      </div>

      <div className="overflow-x-auto border border-zinc-700 rounded-lg bg-zinc-800 shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-700">
            <tr>
              <th className="py-3 px-4 text-left">Mapa</th>
              <th className="py-3 px-4 text-left">Partidas</th>
              <th className="py-3 px-4 text-left">Vitórias T1</th>
              <th className="py-3 px-4 text-left">Vitórias T2</th>
              <th className="py-3 px-4 text-left">Winrate T1</th>
              <th className="py-3 px-4 text-left">Rounds médios</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-zinc-400">
                  Nenhum mapa encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((m: any) => {
                const winrate =
                  m.matches > 0
                    ? ((m.team1Wins / m.matches) * 100).toFixed(1)
                    : "0";

                const avgRounds =
                  m.matches > 0
                    ? (m.totalRounds / m.matches).toFixed(1)
                    : "0";

                return (
                  <tr
                    key={m.map}
                    className="border-t border-zinc-700 hover:bg-zinc-700/60"
                  >
                    <td className="py-2 px-4 font-semibold">{m.map}</td>
                    <td className="py-2 px-4">{m.matches}</td>
                    <td className="py-2 px-4">{m.team1Wins}</td>
                    <td className="py-2 px-4">{m.team2Wins}</td>
                    <td className="py-2 px-4">{winrate}%</td>
                    <td className="py-2 px-4">{avgRounds}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}