"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Match from "@/interfaces/matchs";
import { GET } from "@/api/matchs/routes";

interface MatchContextType {
  matches: Match[];
  // checked: boolean;
  fetchMatches: () => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);

  
  async function fetchMatches() {
    GET();
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
