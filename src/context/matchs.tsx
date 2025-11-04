"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Match from "@/interfaces/matchs";
import { GET } from "@/fetch/matchs.stats";

interface MatchContextType {
  matches: Match[];
  // checked: boolean;
  fetchMatches: () => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);

  // Função que busca os dados do "banco"
  
  async function fetchMatches() {
    GET();

    /*
    try {
      const res = await fetch("/api/matchs"); // endpoint que criaremos depois
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error("Erro ao carregar partidas:", error);
      setMatches([]);
    }
    */
  }
  



  useEffect(() => {
  fetchMatches();
  }, []);

  return (
    <MatchContext.Provider value={{ matches, fetchMatches }}> /*checked, fetchMatches*/
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("useMatch deve ser usado dentro de MatchProvider");
  return ctx;
}
