"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import PlayerMatch, { Player } from "@/interfaces/players";
import { generatePlayerStats } from "@/utils/players";

interface PlayerContextType {
  playerMatches: PlayerMatch[];
  players: Player[];
  loading: boolean;
  error: string | null;
  fetchPlayers: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerMatches, setPlayerMatches] = useState<PlayerMatch[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPlayers() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/player-matches", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("API returned error");
      }

      const data = await res.json();

      // 🔴 payload resiliente (igual fizemos no matches endpoint)
      const matches: PlayerMatch[] =
        data.players ||
        data.playerMatches ||
        data.data ||
        data.result ||
        [];

      if (!Array.isArray(matches)) {
        throw new Error("Invalid players payload");
      }

      setPlayerMatches(matches);

      // gera lista de players agregados
      const uniqueSteamIDs = Array.from(new Set(matches.map((p) => p.steamid64)));

      const generatedPlayers: Player[] = uniqueSteamIDs
        .map((id) => generatePlayerStats(matches, id))
        .filter((p): p is Player => !!p);

      setPlayers(generatedPlayers);

    } catch (err) {
      console.error("Erro ao carregar PlayerMatches:", err);
      setError("Falha ao carregar jogadores");
      setPlayerMatches([]);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <PlayerContext.Provider
      value={{ playerMatches, players, loading, error, fetchPlayers }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayers() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayers deve ser usado dentro de PlayerProvider");
  return ctx;
}