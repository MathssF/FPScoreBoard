"use client";

import Header from "@/component/header";
import LangFlags from "@/component/langFlags";
import { useMatch } from "@/context/matchs";
import { useRouter } from "next/navigation";

export default function MatchsStatsPage() {
  const { matches } = useMatch();
  const router = useRouter();

  if (!matches || matches.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400">
        Nenhuma partida encontrada.
      </div>
    );
  }

  return (
    <div className="p-8">
      <Header />
      <LangFlags />
      <h1 className="text-3xl font-bold text-zinc-100 mb-6">Partidas Registradas</h1>
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.matchid}
            onClick={() => router.push(`/dashboard/match/${match.matchid}`)}
            className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg p-4 border border-zinc-700"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                #{match.matchid} — {match.team1_name} vs {match.team2_name}
              </h2>
              <span className="text-sm text-zinc-400">
                {new Date(match.start_time).toLocaleString()}
              </span>
            </div>
            <p className="text-zinc-300 mt-1">
              {match.team1_score} × {match.team2_score} — Vencedor:{" "}
              <span className="font-bold text-lime-400">{match.winner}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
