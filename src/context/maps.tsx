"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import MapStats from "@/interfaces/maps";

interface MapsContextType {
  maps: MapStats[];
  loading: boolean;
  error: string | null;
  fetchMaps: () => Promise<void>;
}

const MapsContext = createContext<MapsContextType | undefined>(undefined);

export function MapsProvider({ children }: { children: ReactNode }) {
  const [maps, setMaps] = useState<MapStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMaps() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/maps", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("API returned error");
      }

      const data = await res.json();

      // payload resiliente (igual players e matches)
      const mapsPayload: MapStats[] =
        data.maps ||
        data.mapStats ||
        data.data ||
        data.result ||
        [];

      if (!Array.isArray(mapsPayload)) {
        throw new Error("Invalid maps payload");
      }

      setMaps(mapsPayload);
    } catch (err) {
      console.error("Erro ao carregar mapas:", err);
      setError("Falha ao carregar mapas");
      setMaps([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMaps();
  }, []);

  return (
    <MapsContext.Provider value={{ maps, loading, error, fetchMaps }}>
      {children}
    </MapsContext.Provider>
  );
}

export function useMaps() {
  const ctx = useContext(MapsContext);
  if (!ctx) throw new Error("useMaps deve ser usado dentro de MapsProvider");
  return ctx;
}