"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Match from "@/interfaces/matchs";
import { MatchDetails } from "@/interfaces/matchs";
import { makeMatchDetails } from "@/utils/matchs";
import PlayerMatch from "@/interfaces/players";
import MapStats from "@/interfaces/maps";

/*
interface MatchContextType {
  matches: Match[];
  fetchMatches: () => Promise<void>;
  checkM: boolean;
}
*/

interface MatchContextType {
  matches: Match[];
  loading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

/*
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
  }

  
  async function fetchMatches() {
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
    <MatchContext.Provider value={{ matches, fetchMatches, checkM }}>
      {children}
    </MatchContext.Provider>
  );
}
*/

export function MatchProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMatches() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/matchs", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("API returned error");
      }

      const data = await res.json();

      // proteção contra API externa retornar formato errado
      if (!data?.matches || !Array.isArray(data.matches)) {
        throw new Error("Invalid matches payload");
      }

      setMatches(data.matches);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar partidas");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <MatchContext.Provider value={{ matches, loading, error, fetchMatches }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("Error in 'useMatch' or  'MatchProvider'");
  return ctx;
}
