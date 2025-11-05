"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import MapStats from "@/interfaces/maps";

interface MapsContextType {
  maps: MapStats[];
  fetchMaps: () => Promise<void>;
  checkMaps: boolean;
}

const MapsContext = createContext<MapsContextType | undefined>(undefined);

export function MapsProvider({ children }: { children: ReactNode }) {
  const [maps, setMaps] = useState<MapStats[]>([]);
  const [checkMaps, setCheckMaps] = useState<boolean>(false);

  async function fetchMaps() {
    try {
      const res = await fetch("/api/maps", { cache: "no-store" });
      if (!res.ok) throw new Error(`Erro ao buscar mapas: ${res.statusText}`);

      const data = await res.json();
      setMaps(data.maps || []);
      setCheckMaps(true);
    } catch (error) {
      console.error("Erro ao carregar mapas:", error);
      setMaps([]);
      setCheckMaps(true);
    }
  }

  useEffect(() => {
    fetchMaps();
  }, []);

  return (
    <MapsContext.Provider value={{ maps, fetchMaps, checkMaps }}>
      {children}
    </MapsContext.Provider>
  );
}

export function useMaps() {
  const ctx = useContext(MapsContext);
  if (!ctx) throw new Error("useMaps deve ser usado dentro de MapsProvider");
  return ctx;
}
