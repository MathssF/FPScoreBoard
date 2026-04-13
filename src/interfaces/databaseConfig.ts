export interface DatabaseConfig {
  mode: "api" | "mysql";
  apiBase?: string;

  host?: string;
  port?: string;
  user?: string;
  pass?: string;
  name?: string;

  lists: {
    users: any[];
    players: any[];
  };

  options: {
    lang: string;
  };
}