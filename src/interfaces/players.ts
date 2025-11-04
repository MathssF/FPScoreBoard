export default interface PlayerMatch {
  matchid: number;
  mapnumber: number;
  steamid64: number;
  team: string;
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  enemy5ks: number;
  enemy4ks: number;
  enemy3ks: number;
  enemy2ks: number;
  utility_count: number;
  utility_damage: number;
  utility_successes: number;
  utility_enemies: number;
  flash_count: number;
  flash_successes: number;
  health_points_removed_total: number;
  health_points_dealt_total: number;
  shots_fired_total: number;
  shots_on_target_total: number;
  v1_count: number;
  v1_wins: number;
  v2_count: number;
  v2_wins: number;
  entry_count: number;
  entry_wins: number;
  equipment_value: number;
  money_saved: number;
  kill_reward: number;
  live_time: number;
  head_shot_kills: number;
  cash_earned: number;
  enemies_flashed: number;
}

export interface Player {
  steamid64: number;
  currentName: string;
  oldNames: string[];
  matchs: number[];
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  totalDamge: number;
  totalKillReward: number;
  totalShotsFired: number;
  totalShotsOnTarget: number;
}