"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Match from "@/interfaces/matchs";
import { setupFsCheck } from "next/dist/server/lib/router-utils/filesystem";

interface MatchContextType {
  matches: Match[];
  fetchMatches: () => Promise<void>;
  checkM: boolean;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [checkM, setCheckM] = useState<boolean>(false);

  
  async function fetchMatches() {
    // GET();
    try {
      const res = await fetch("/api/matchs", { cache: "no-store" });
      const data = await res.json();
      setCheckM(true);
      setMatches(data.matches || []);
    } catch (error) {
      console.error("Error: Matchs not found:", error);
      setCheckM(true);
      setMatches([]);
  
    }
  }

  useEffect(() => {
  fetchMatches();
  }, []);

  return (
    <MatchContext.Provider value={{ matches, fetchMatches, checkM }}> /*checked, fetchMatches*/
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("Error in 'useMatch' or  'MatchProvider'");
  return ctx;
}
