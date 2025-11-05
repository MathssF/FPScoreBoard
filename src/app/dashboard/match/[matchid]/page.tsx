"use client";

import { useParams } from "next/navigation";
import { useMatch } from "@/context/matchs";
import { usePlayers } from "@/context/players";
import { useMaps } from "@/context/maps";
import { makeMatchDetails } from "@/utils/matchs";
import { useEffect, useState } from "react";

import type { MatchDetails, PlayerInMatch } from "@/interfaces/matchs";
import type Match from "@/interfaces/matchs";
import type PlayerMatch from "@/interfaces/players";
import type MapStats from "@/interfaces/maps";
import MatchsStatsPage from "../../matchs-stats/page";
import LangFlags from "@/component/langFlags";
import Header from "@/component/header";

export default function MatchDetailsPage() {
  const { matchid } = useParams<{ matchid: string }>();
  const { matches, checkM } = useMatch();
  const { playerMatches, checkP } = usePlayers();
  const { maps, checkMaps } = useMaps();

  console.log('Player Matches: ', playerMatches);
  console.log('Maps: ', maps);
  console.log('Matches: ', matches);

  const [matchDetail, setMatchDetail] = useState<MatchDetails | null>(null);

  useEffect(() => {
    if (!checkM || !checkP || !checkMaps) return;

    const match = matches.find((m) => m.matchid === Number(matchid));
    if (!match) return;

    const playerData: PlayerMatch[] = playerMatches.filter(
      (p) => p.matchid === match.matchid
    );
    const mapData: MapStats[] = maps.filter((m) => m.matchid === match.matchid);

    const details = makeMatchDetails(match, playerData, mapData);
    setMatchDetail(details);
  }, [checkM, checkP, checkMaps, matches, playerMatches, maps, matchid]);

  if (!checkM || !checkP || !checkMaps) {
    return <p className="text-zinc-400 p-4">Carregando dados...</p>;
  }

  if (!matchDetail) {
    return (
      <div className="p-6">
          <Header />
          <LangFlags />
        <h1 className="text-xl font-semibold text-red-400">Partida não encontrada</h1>
      </div>
    );
  }

  const slug = Number(matchid);
  const mapsInMatch = matchDetail.maps || [];
  const match = matches.find((elem) => elem.matchid === slug) as Match | undefined;
  const players: PlayerMatch[] = playerMatches.filter((elem) => elem.matchid === slug);

  if (!match) {
    return (
      <div className="p-6">        
        <Header />
        <LangFlags />
        <p>Partida não encontrada</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
        <Header />
        <LangFlags />
      <header className="border-b border-zinc-700 pb-4">
        <h1 className="text-2xl font-bold text-white">
          Partida #{match.matchid} — {match.team1_name} vs {match.team2_name}
        </h1>
        <p className="text-sm text-zinc-400">
          Início: {match.start_time} | Fim: {match.end_time ?? "Em andamento"}
        </p>
        <p className="text-zinc-300">
          Vencedor:{" "}
          <span className="font-semibold text-green-400">{match.winner}</span>
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">Mapas</h2>
        {mapsInMatch && mapsInMatch.length > 0 ? (
          <ul className="space-y-2">
            {mapsInMatch.map((m) => (
              <li
                key={`${m.matchid}-${m.mapnumber}`}
                className="border border-zinc-700 rounded p-3"
              >
                <strong>{m.mapname}</strong> — {m.team1_score} x {m.team2_score} (
                {m.winner})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">Nenhum mapa encontrado.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">Jogadores</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse border border-zinc-700">
            <thead className="bg-zinc-800 text-zinc-300">
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
              {players.map((p) => (
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
