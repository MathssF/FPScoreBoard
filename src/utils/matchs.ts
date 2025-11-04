import MapStats from "@/interfaces/maps";
import Match, { MatchDetails, PlayerInMatch } from "@/interfaces/matchs";
import PlayerMatch from "@/interfaces/players";

export function selectMatch(matches: Match[], id: number): Match | undefined {
  return matches.find((elem) => elem.matchid === id);
}

export function matchDetails(
  match: Match,
  players: PlayerMatch[],
  maps: MapStats[]
): MatchDetails {
  const { matchid } = match;

  const playerList = players.filter((p) => p.matchid === matchid);
  const mapList = maps.filter((m) => m.matchid === matchid);

  const playerMap = new Map<number, PlayerInMatch>();

  for (const p of playerList) {
    const existing = playerMap.get(p.steamid64);

    if (!existing) {
      playerMap.set(p.steamid64, {
        steamid64: p.steamid64,
        name: p.name,
        team: p.team,

        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
        damage: p.damage,

        enemy5ks: p.enemy5ks,
        enemy4ks: p.enemy4ks,
        enemy3ks: p.enemy3ks,
        enemy2ks: p.enemy2ks,

        head_shot_kills: p.head_shot_kills,
        flash_count: p.flash_count,
        flash_successes: p.flash_successes,
        enemies_flashed: p.enemies_flashed,

        utility_count: p.utility_count,
        utility_damage: p.utility_damage,
        utility_successes: p.utility_successes,
        utility_enemies: p.utility_enemies,

        v1_count: p.v1_count,
        v1_wins: p.v1_wins,
        v2_count: p.v2_count,
        v2_wins: p.v2_wins,

        entry_count: p.entry_count,
        entry_wins: p.entry_wins,

        kill_reward: p.kill_reward,
        money_saved: p.money_saved,
        equipment_value: p.equipment_value,
        cash_earned: p.cash_earned,

        live_time: p.live_time,
        shots_fired_total: p.shots_fired_total,
        shots_on_target_total: p.shots_on_target_total,
      });
    } else {
      existing.kills += p.kills;
      existing.deaths += p.deaths;
      existing.assists += p.assists;
      existing.damage += p.damage;

      existing.enemy5ks += p.enemy5ks;
      existing.enemy4ks += p.enemy4ks;
      existing.enemy3ks += p.enemy3ks;
      existing.enemy2ks += p.enemy2ks;

      existing.head_shot_kills += p.head_shot_kills;
      existing.flash_count += p.flash_count;
      existing.flash_successes += p.flash_successes;
      existing.enemies_flashed += p.enemies_flashed;

      existing.utility_count += p.utility_count;
      existing.utility_damage += p.utility_damage;
      existing.utility_successes += p.utility_successes;
      existing.utility_enemies += p.utility_enemies;

      existing.v1_count += p.v1_count;
      existing.v1_wins += p.v1_wins;
      existing.v2_count += p.v2_count;
      existing.v2_wins += p.v2_wins;

      existing.entry_count += p.entry_count;
      existing.entry_wins += p.entry_wins;

      existing.kill_reward += p.kill_reward;
      existing.money_saved += p.money_saved;
      existing.equipment_value += p.equipment_value;
      existing.cash_earned += p.cash_earned;

      existing.live_time += p.live_time;
      existing.shots_fired_total += p.shots_fired_total;
      existing.shots_on_target_total += p.shots_on_target_total;
    }
  }

  const playersInMatch: PlayerInMatch[] = Array.from(playerMap.values()).map((p) => ({
    ...p,
    kdr: p.deaths > 0 ? p.kills / p.deaths : p.kills,
    adr: p.damage,
    accuracy: p.shots_fired_total > 0 ? p.shots_on_target_total / p.shots_fired_total : 0,
    entry_success_rate: p.entry_count > 0 ? p.entry_wins / p.entry_count : 0,
  }));

  const details: MatchDetails = {
    ...match,
    maps: mapList,
    players: playersInMatch,
    totalTime: match.end_time && match.start_time
      ? calcDuration(match.start_time, match.end_time)
      : undefined,
    totalRounds: mapList.length * 30, 
    playerCount: playersInMatch.length,
  };

  return details;
}

function calcDuration(start: string, end: string): string {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}
