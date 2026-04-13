"use client";

import { useState, useMemo } from "react";
import { usePlayers } from "@/context/players";
import { useRouter } from "next/navigation";
import Header from "@/component/header";
import LangFlags from "@/component/langFlags";

export default function PlayersMatchesPage() {
  const { playerMatches, loading, error } = usePlayers();
  const [playerFilter, setPlayerFilter] = useState("");
  const [matchFilter, setMatchFilter] = useState("");
  const router = useRouter();

  const filteredMatches = useMemo(() => {
    return playerMatches.filter((pm) => {
      const matchByPlayer =
        !playerFilter ||
        pm.name.toLowerCase().includes(playerFilter.toLowerCase()) ||
        pm.steamid64.toString().includes(playerFilter);
      const matchByMatch =
        !matchFilter ||
        pm.matchid.toString().includes(matchFilter);
      return matchByPlayer && matchByMatch;
    });
  }, [playerMatches, playerFilter, matchFilter]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-zinc-100">
        <Header />
        <LangFlags />
        <p>Carregando dados dos jogadores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-red-400">
        <Header />
        <LangFlags />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">

      <Header />
      <LangFlags />
      <h1 className="text-3xl font-bold mb-6 text-center">Histórico de Players & Partidas</h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Filtrar por jogador (nome ou SteamID)"
          value={playerFilter}
          onChange={(e) => setPlayerFilter(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
        />
        <input
          type="text"
          placeholder="Filtrar por Match ID"
          value={matchFilter}
          onChange={(e) => setMatchFilter(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
        />
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto border border-zinc-700 rounded-lg bg-zinc-800 shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-700 text-zinc-100">
            <tr>
              <th className="py-3 px-4 text-left">Match ID</th>
              <th className="py-3 px-4 text-left">SteamID64</th>
              <th className="py-3 px-4 text-left">Nome</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Kills</th>
              <th className="py-3 px-4 text-left">Deaths</th>
              <th className="py-3 px-4 text-left">Assists</th>
              <th className="py-3 px-4 text-left">Damage</th>
              <th className="py-3 px-4 text-left">HS Kills</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-zinc-400">
                  Nenhum resultado encontrado.
                </td>
              </tr>
            ) : (
              filteredMatches.map((pm) => (
                <tr
                  key={`${pm.matchid}-${pm.steamid64}`}
                  className="border-t border-zinc-700 hover:bg-zinc-700/60 transition-colors"
                >
                  <td
                    className="py-2 px-4 cursor-pointer text-blue-400 hover:underline"
                    onClick={() => router.push(`/dashboard/match/${pm.matchid}`)}
                  >
                    {pm.matchid}
                  </td>
                  <td
                    className="py-2 px-4 cursor-pointer text-blue-400 hover:underline"
                    onClick={() => router.push(`/dashboard/player/${pm.steamid64}`)}
                  >
                    {pm.steamid64}
                  </td>
                  <td
                    className="py-2 px-4 cursor-pointer text-blue-400 hover:underline"
                    onClick={() => router.push(`/dashboard/player/${pm.steamid64}`)}
                  >
                    {pm.name}
                  </td>
                  <td className="py-2 px-4">{pm.team}</td>
                  <td className="py-2 px-4">{pm.kills}</td>
                  <td className="py-2 px-4">{pm.deaths}</td>
                  <td className="py-2 px-4">{pm.assists}</td>
                  <td className="py-2 px-4">{pm.damage}</td>
                  <td className="py-2 px-4">{pm.head_shot_kills}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
