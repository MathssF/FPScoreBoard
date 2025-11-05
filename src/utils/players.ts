import PlayerMatch, { Player } from "@/interfaces/players";
import Match from "@/interfaces/matchs";
import { match } from "assert";

export function generatePlayerStats(playerMatches: PlayerMatch[], steamid64: number): Player | undefined {
  const matches = playerMatches.filter((p) => p.steamid64 === steamid64);
  if (matches.length === 0) return undefined;

  const currentName = matches[matches.length - 1].name;
  const oldNames = Array.from(new Set(matches.map((p) => p.name).filter((n) => n !== currentName)));

  const totalKills = sum(matches.map((p) => p.kills));
  const totalDeaths = sum(matches.map((p) => p.deaths));
  const totalAssists = sum(matches.map((p) => p.assists));
  const totalDamage = sum(matches.map((p) => p.damage));
  const totalKillReward = sum(matches.map((p) => p.kill_reward));
  const totalShotsFired = sum(matches.map((p) => p.shots_fired_total));
  const totalShotsOnTarget = sum(matches.map((p) => p.shots_on_target_total));
  const totalMoneySaved = sum(matches.map((p) => p.money_saved));
  const totalEquipmentValue = sum(matches.map((p) => p.equipment_value));
  const totalUtilityDamage = sum(matches.map((p) => p.utility_damage));
  const totalEnemiesFlashed = sum(matches.map((p) => p.enemies_flashed));
  const totalLiveTime = sum(matches.map((p) => p.live_time));

  const totalRounds = matches.length; 

  const averageKDR = totalDeaths > 0 ? totalKills / totalDeaths : totalKills;
  const averageADR = totalDamage / totalRounds;
  const averageHSPercent =
    totalKills > 0
      ? (sum(matches.map((p) => p.head_shot_kills)) / totalKills) * 100
      : 0;
  const averageAccuracy =
    totalShotsFired > 0 ? totalShotsOnTarget / totalShotsFired : 0;

  const winRate = undefined;

  const player: Player = {
    steamid64,
    currentName,
    oldNames,
    matchs: Array.from(new Set(matches.map((p) => p.matchid))),

    totalKills,
    totalDeaths,
    totalAssists,
    totalDamage,
    totalKillReward,
    totalShotsFired,
    totalShotsOnTarget,

    averageKDR,
    averageADR,
    averageHSPercent,
    averageAccuracy,

    winRate,
    totalLiveTime,
    totalRounds,

    totalMoneySaved,
    totalEquipmentValue,
    totalUtilityDamage,
    totalEnemiesFlashed,

    lastMatchId: matches[matches.length - 1].matchid,
    lastActive: '',
    registeredAt: '',
    country: undefined,
    avatarUrl: undefined,
  };

  return player;
}

export function setTimeData(matchs: Match[], player: Player) {
  const lastMatch = matchs.find((elem) => {
    elem.matchid === player.lastMatchId;
  });
  if (!lastMatch) {
    player.lastActive = '';
  } else {
    player.lastActive = lastMatch.end_time ? lastMatch?.end_time : lastMatch?.start_time;
  }
  const registre = matchs.find((elem) => {
    elem.matchid === player.matchs[0];
  })
  if (!registre) {
    player.registeredAt = '';
  } else {
    player.registeredAt = registre.start_time;
  }
}

function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + (v || 0), 0);
}
