"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getDatabaseConfig, DatabaseConfig } from "@/api/config/route";

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
