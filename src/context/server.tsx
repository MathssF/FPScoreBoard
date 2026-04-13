"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { DatabaseConfig } from "@/app/api/config/route";

interface DatabaseContextType {
  config: DatabaseConfig | null;
  loading: boolean;
  reloadConfig: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DatabaseConfig | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadConfig() {
    try {
      setLoading(true);
      const res = await fetch("/api/config", { cache: "no-store" });

      if (!res.ok) throw new Error("Failed to load config");

      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error("Erro carregando config:", err);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }

  async function reloadConfig() {
    await loadConfig();
  }

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <DatabaseContext.Provider value={{ config, loading, reloadConfig }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase deve ser usado dentro de DatabaseProvider");
  }
  return context;
}



/* 
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getDatabaseConfig, DatabaseConfig } from "@/app/api/config/route";

interface DatabaseContextType {
  config: DatabaseConfig;
  reloadConfig: () => void; // função para recarregar o config
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DatabaseConfig>(getDatabaseConfig());

  const reloadConfig = () => {
    setConfig(getDatabaseConfig());
  };

  return (
    <DatabaseContext.Provider value={{ config, reloadConfig }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase deve ser usado dentro de DatabaseProvider");
  }
  return context;
}
*/