export default interface Match {
  matchid: number;
  start_time: string;
  end_time?: string | null;
  winner: string;
  series_type: string;
  team1_name: string;
  team1_score: number;
  team2_name: string;
  team2_score: number;
  server_ip: string;
}

export interface MatchsStats {
    Matchs: Match[];
    checked: boolean;
}