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

export interface PlayerInMatch {
  steamid64: number;
  name: string;
  team: string;

  kills: number;
  deaths: number;
  assists: number;
  damage: number;

  enemy5ks: number;
  enemy4ks: number;
  enemy3ks: number;
  enemy2ks: number;

  head_shot_kills: number;
  flash_count: number;
  flash_successes: number;
  enemies_flashed: number;

  utility_count: number;
  utility_damage: number;
  utility_successes: number;
  utility_enemies: number;

  v1_count: number;
  v1_wins: number;
  v2_count: number;
  v2_wins: number;

  entry_count: number;
  entry_wins: number;

  kill_reward: number;
  money_saved: number;
  equipment_value: number;
  cash_earned: number;

  live_time: number;
  shots_fired_total: number;
  shots_on_target_total: number;
}

export interface MatchDetails {
  Players: PlayerInMatch[];
  totalTime?: string;
}