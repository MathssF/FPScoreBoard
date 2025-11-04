import Match, { MatchDetails } from "@/interfaces/matchs";
import PlayerMatch from "@/interfaces/players";

export function selectMatch(matches: Match[], id: number): Match | undefined {
  return matches.find((elem) => {
    elem.matchid === id;
  })
}

export function matchDetails(match: Match, players: PlayerMatch[]) { // : MatchDetails {
  const { matchid } = match;
  const list = players.map((elem) => {
    elem.matchid === matchid;
  })
  
}