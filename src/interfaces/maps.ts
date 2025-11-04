export default interface MapStats {
  matchid: number;
  mapnumber: number;
  start_time: string;
  end_time?: string | null;
  winner: string;
  mapname: string;
  team1_score: number;
  team2_score: number;
}
