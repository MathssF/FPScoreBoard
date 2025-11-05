"use client";

import { useParams, useRouter } from "next/navigation";
import { usePlayers } from "@/context/players";
import { useMemo } from "react";

export default function PlayerDetailsPage() {
  const { steamid } = useParams<{ steamid: string }>();
  const { players, playerMatches, checkP } = usePlayers();
  const router = useRouter();

  // Procurar o jogador com base no steamid
  const player = useMemo(() => {
    const id = Number(steamid);
    return players.find((p) => p.steamid64 === id);
  }, [players, steamid]);

  // Filtra todas as partidas deste jogador
  const matches = useMemo(() => {
    if (!player) return [];
    return playerMatches.filter((m) => m.steamid64 === player.steamid64);
  }, [playerMatches, player]);

  if (!checkP) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-zinc-100">
        <p>Carregando informações do jogador...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-zinc-100">
        <h1 className="text-2xl font-bold mb-4">Jogador não encontrado</h1>
        <button
          onClick={() => router.push("/dashboard/players-matchs")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      <button
        onClick={() => router.push("/dashboard/players-matchs")}
        className="mb-6 text-blue-400 hover:underline"
      >
        ← Voltar para o histórico
      </button>

      {/* Cabeçalho do Jogador */}
      <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 mb-8">
        <h1 className="text-3xl font-bold mb-2">{player.currentName}</h1>
        <p className="text-zinc-400 mb-2">SteamID64: {player.steamid64}</p>
        {player.oldNames.length > 0 && (
          <p className="text-sm text-zinc-400 mb-2">
            Nomes antigos: {player.oldNames.join(", ")}
          </p>
        )}
        {player.country && (
          <p className="text-sm text-zinc-400 mb-2">País: {player.country}</p>
        )}
        {player.avatarUrl && (
          <img
            src={player.avatarUrl}
            alt="Avatar"
            className="w-20 h-20 rounded-full mt-4"
          />
        )}
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Kills" value={player.totalKills} />
        <StatCard title="Total Deaths" value={player.totalDeaths} />
        <StatCard title="Total Assists" value={player.totalAssists} />
        <StatCard title="Total Damage" value={player.totalDamage} />
        <StatCard title="Headshot %" value={`${player.averageHSPercent?.toFixed(1)}%`} />
        <StatCard title="K/D Ratio" value={player.averageKDR?.toFixed(2)} />
        <StatCard title="ADR" value={player.averageADR?.toFixed(1)} />
        <StatCard title="Accuracy" value={`${(player.averageAccuracy ?? 0 * 100).toFixed(1)}%`} />
        <StatCard title="Rounds" value={player.totalRounds} />
        <StatCard title="Enemies Flashed" value={player.totalEnemiesFlashed} />
        <StatCard title="Utility Damage" value={player.totalUtilityDamage} />
        <StatCard title="Money Saved" value={player.totalMoneySaved} />
      </div>

      {/* Histórico de Partidas */}
      <h2 className="text-2xl font-semibold mb-4">Partidas Recentes</h2>
      <div className="overflow-x-auto border border-zinc-700 rounded-lg bg-zinc-800 shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-700 text-zinc-100">
            <tr>
              <th className="py-3 px-4 text-left">Match ID</th>
              <th className="py-3 px-4 text-left">Mapa</th>
              <th className="py-3 px-4 text-left">Kills</th>
              <th className="py-3 px-4 text-left">Deaths</th>
              <th className="py-3 px-4 text-left">Assists</th>
              <th className="py-3 px-4 text-left">Damage</th>
              <th className="py-3 px-4 text-left">HS</th>
              <th className="py-3 px-4 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {matches.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-zinc-400">
                  Nenhuma partida registrada para este jogador.
                </td>
              </tr>
            ) : (
              matches.map((m) => (
                <tr
                  key={`${m.matchid}-${m.mapnumber}`}
                  className="border-t border-zinc-700 hover:bg-zinc-700/60 transition-colors"
                >
                  <td
                    className="py-2 px-4 cursor-pointer text-blue-400 hover:underline"
                    onClick={() => router.push(`/dashboard/match/${m.matchid}`)}
                  >
                    {m.matchid}
                  </td>
                  <td className="py-2 px-4">{m.mapnumber}</td>
                  <td className="py-2 px-4">{m.kills}</td>
                  <td className="py-2 px-4">{m.deaths}</td>
                  <td className="py-2 px-4">{m.assists}</td>
                  <td className="py-2 px-4">{m.damage}</td>
                  <td className="py-2 px-4">{m.head_shot_kills}</td>
                  <td className="py-2 px-4">{m.team}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente simples para exibir blocos de estatísticas
function StatCard({ title, value }: { title: string; value?: string | number }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center shadow">
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="text-xl font-bold mt-1">{value ?? "-"}</p>
    </div>
  );
}
