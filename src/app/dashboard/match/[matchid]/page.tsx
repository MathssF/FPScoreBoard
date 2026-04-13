"use client";

import { useParams, useRouter } from "next/navigation";
import { useMatch } from "@/context/matchs";
import { usePlayers } from "@/context/players";
import { useMaps } from "@/context/maps";
import { makeMatchDetails } from "@/utils/matchs";
import { useMemo } from "react";

import type PlayerMatch from "@/interfaces/players";
import type MapStats from "@/interfaces/maps";
import Header from "@/component/header";
import LangFlags from "@/component/langFlags";

export default function MatchDetailsPage() {
  const { matchid } = useParams<{ matchid: string }>();
  const router = useRouter();

  const { matches, loading: matchLoading, error: matchError } = useMatch();
  const { playerMatches, loading: playerLoading, error: playerError } = usePlayers();
  const { maps, loading: mapsLoading, error: mapsError } = useMaps();

  const loading = matchLoading || playerLoading || mapsLoading;
  const error = matchError || playerError || mapsError;

  const matchIdNumber = Number(matchid);

  // 🔹 match base
  const match = useMemo(
    () => matches.find((m) => m.matchid === matchIdNumber),
    [matches, matchIdNumber]
  );

  // 🔹 players da partida
  const playersInMatch: PlayerMatch[] = useMemo(
    () => playerMatches.filter((p) => p.matchid === matchIdNumber),
    [playerMatches, matchIdNumber]
  );

  // 🔹 mapas da partida
  const mapsInMatch: MapStats[] = useMemo(
    () => maps.filter((m) => m.matchid === matchIdNumber),
    [maps, matchIdNumber]
  );

  // 🔹 details agregados
  const matchDetail = useMemo(() => {
    if (!match) return null;
    return makeMatchDetails(match, playersInMatch, mapsInMatch);
  }, [match, playersInMatch, mapsInMatch]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <Header />
        <LangFlags />
        <div className="p-6">Carregando dados da partida...</div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 text-red-400">
        <Header />
        <LangFlags />
        <div className="p-6">{error}</div>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!match || !matchDetail) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <Header />
        <LangFlags />
        <div className="p-6">
          <h1 className="text-xl font-semibold text-red-400">
            Partida não encontrada
          </h1>
        </div>
      </div>
    );
  }

  // ================= PAGE =================
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6 space-y-6">
      <Header />
      <LangFlags />

      <button
        onClick={() => router.back()}
        className="text-blue-400 hover:underline"
      >
        ← Voltar
      </button>

      {/* Header da partida */}
      <header className="border-b border-zinc-700 pb-4">
        <h1 className="text-2xl font-bold">
          Partida #{match.matchid} — {match.team1_name} vs {match.team2_name}
        </h1>
        <p className="text-sm text-zinc-400">
          Início: {match.start_time} | Fim: {match.end_time ?? "Em andamento"}
        </p>
        <p>
          Vencedor:{" "}
          <span className="font-semibold text-green-400">{match.winner}</span>
        </p>
      </header>

      {/* Mapas */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Mapas</h2>
        {mapsInMatch.length === 0 ? (
          <p className="text-zinc-500">Nenhum mapa encontrado.</p>
        ) : (
          <ul className="space-y-2">
            {mapsInMatch.map((m) => (
              <li
                key={`${m.matchid}-${m.mapnumber}`}
                className="border border-zinc-700 rounded p-3"
              >
                <strong>{m.mapname}</strong> — {m.team1_score} x {m.team2_score} ({m.winner})
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Jogadores */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Jogadores</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-zinc-700">
            <thead className="bg-zinc-800">
              <tr>
                <th className="p-2">Nome</th>
                <th className="p-2">Time</th>
                <th className="p-2 text-center">Kills</th>
                <th className="p-2 text-center">Deaths</th>
                <th className="p-2 text-center">Assists</th>
                <th className="p-2 text-center">Dano</th>
              </tr>
            </thead>
            <tbody>
              {playersInMatch.map((p) => (
                <tr
                  key={p.steamid64}
                  className="border-t border-zinc-700 hover:bg-zinc-800/40"
                >
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.team}</td>
                  <td className="p-2 text-center">{p.kills}</td>
                  <td className="p-2 text-center">{p.deaths}</td>
                  <td className="p-2 text-center">{p.assists}</td>
                  <td className="p-2 text-center">{p.damage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}