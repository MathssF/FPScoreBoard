"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Match from "@/interfaces/matchs";

/* interface Match {
  matchid: number;
  start_time: string;
  end_time?: string | null;
  winner: string;
  series_type: string;
  team1_name: string;
  team1_score: number;
  team2_name: string;
  team2_score: number;
  server_ip: string;
} */

interface MatchContextType {
  matches: Match[];
  fetchMatches: () => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);

  // Função que busca os dados do "banco"
  async function fetchMatches() {
    try {
      const res = await fetch("/api/matchs"); // endpoint que criaremos depois
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error("Erro ao carregar partidas:", error);
      setMatches([]);
    }
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <MatchContext.Provider value={{ matches, fetchMatches }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("useMatch deve ser usado dentro de MatchProvider");
  return ctx;
}
