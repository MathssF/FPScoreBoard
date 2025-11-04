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

    console.log('Entrou na função');

    try {

      console.log('Entrou no Try do Context')

      const res = await fetch("/api/matchs", { cache: "no-store" }); // ChatGPT, o Erro ta aqui
      console.log('Res do context: ', res); 
      const data = await res.json();

      console.log('Data do context: ', data); 

      setCheckM(true);
      setMatches(data.matches || []);
    } catch (error) {
      console.error("Error: Matchs not found:", error);
      setCheckM(true);
      setMatches([]);
  
    }
  }

  console.log('Na função, no meio');

  useEffect(() => {
  fetchMatches();
  }, []);

  console.log('No contexto, Matches> ', matches, ' e checked: ', checkM);

  return (
    <MatchContext.Provider value={{ matches, fetchMatches, checkM }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("Error in 'useMatch' or  'MatchProvider'");
  return ctx;
}
