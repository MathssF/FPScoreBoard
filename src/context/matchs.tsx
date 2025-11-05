"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Match from "@/interfaces/matchs";
import { MatchDetails } from "@/interfaces/matchs";
import { makeMatchDetails } from "@/utils/matchs";
import PlayerMatch from "@/interfaces/players";
import MapStats from "@/interfaces/maps";

interface MatchContextType {
  matches: Match[];
  fetchMatches: () => Promise<void>;
  checkM: boolean;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [checkM, setCheckM] = useState<boolean>(false);
  const [matchId, setMatchId] = useState<Match | null>(null);

  const [allMatchsDetails, setAllMatchsDetails] = useState<MatchDetails[]>([])
  const [matchDetail, setMatchDetail] = useState<MatchDetails | null>(null);

  async function makeDetails(
    match: Match[],
    players: PlayerMatch[],
    maps: MapStats[]
  ) {
    const list = match.map((elem) => {
      makeMatchDetails(elem, players, maps);
    })
    return list;
    // setAllMatchsDetails(makeDetails(matchs, players, maps);
  }

  
  async function fetchMatches() {
    try {
      const res = await fetch("/api/matchs", { cache: "no-store" }); // ChatGPT, o Erro ta aqui
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
