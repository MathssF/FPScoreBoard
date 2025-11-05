"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import PlayerMatch, { Player } from "@/interfaces/players";
import { generatePlayerStats, setTimeData } from "@/utils/players";
import Match from "@/interfaces/matchs";

interface PlayerContextType {
  playerMatches: PlayerMatch[];
  players: Player[];
  fetchPlayers: () => Promise<void>;
  checkP: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerMatches, setPlayerMatches] = useState<PlayerMatch[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [checkP, setCheckP] = useState<boolean>(false);

  const [playerId, serPlayerId] = useState<Player | null>(null);

  async function fetchPlayers() {
    try {
      const res = await fetch("/api/players", { cache: "no-store" });
      if (!res.ok) throw new Error(`Erro ao buscar players: ${res.statusText}`);

      const data = await res.json();

      const matches: PlayerMatch[] = data.players || data.playerMatches || [];
      setPlayerMatches(matches);

      const uniqueSteamIDs = Array.from(new Set(matches.map((p) => p.steamid64)));

      const generatedPlayers: Player[] = uniqueSteamIDs
        .map((id) => generatePlayerStats(matches, id))
        .filter((p): p is Player => !!p);

      setPlayers(generatedPlayers);
      setCheckP(true);
    } catch (error) {
      console.error("Erro ao carregar PlayerMatches:", error);
      setPlayerMatches([]);
      setPlayers([]);
      setCheckP(true);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <PlayerContext.Provider
      value={{ playerMatches, players, fetchPlayers, checkP }}
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
