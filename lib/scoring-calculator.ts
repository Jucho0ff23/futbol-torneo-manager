/**
 * Scoring Calculator
 * Calculates standings, points, and rankings based on match results
 */

export interface MatchResult {
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  status: "finished" | "pending" | "live" | "postponed";
}

export interface ScoringConfig {
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
}

export interface TeamStanding {
  teamId: number;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

/**
 * Calculate standings from match results
 */
export function calculateStandings(
  teamIds: number[],
  matches: MatchResult[],
  config: ScoringConfig
): TeamStanding[] {
  // Initialize standings for all teams
  const standings = new Map<number, TeamStanding>();
  teamIds.forEach((teamId) => {
    standings.set(teamId, {
      teamId,
      position: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  });

  // Process finished matches
  matches.forEach((match) => {
    if (match.status !== "finished") return;

    const homeStanding = standings.get(match.homeTeamId);
    const awayStanding = standings.get(match.awayTeamId);

    if (!homeStanding || !awayStanding) return;

    // Update played matches
    homeStanding.played++;
    awayStanding.played++;

    // Update goals
    homeStanding.goalsFor += match.homeScore;
    homeStanding.goalsAgainst += match.awayScore;
    awayStanding.goalsFor += match.awayScore;
    awayStanding.goalsAgainst += match.homeScore;

    // Determine result and update points
    if (match.homeScore > match.awayScore) {
      // Home team wins
      homeStanding.wins++;
      homeStanding.points += config.pointsWin;
      awayStanding.losses++;
      awayStanding.points += config.pointsLoss;
    } else if (match.homeScore < match.awayScore) {
      // Away team wins
      awayStanding.wins++;
      awayStanding.points += config.pointsWin;
      homeStanding.losses++;
      homeStanding.points += config.pointsLoss;
    } else {
      // Draw
      homeStanding.draws++;
      homeStanding.points += config.pointsDraw;
      awayStanding.draws++;
      awayStanding.points += config.pointsDraw;
    }
  });

  // Calculate goal difference
  standings.forEach((standing) => {
    standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
  });

  // Sort standings
  const sortedStandings = Array.from(standings.values()).sort((a, b) => {
    // 1. Points (descending)
    if (b.points !== a.points) return b.points - a.points;
    // 2. Goal difference (descending)
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    // 3. Goals for (descending)
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    // 4. Team ID (ascending) - for consistency
    return a.teamId - b.teamId;
  });

  // Assign positions
  sortedStandings.forEach((standing, index) => {
    standing.position = index + 1;
  });

  return sortedStandings;
}

/**
 * Calculate points for a single match result
 */
export function calculateMatchPoints(
  homeScore: number,
  awayScore: number,
  config: ScoringConfig
): { homePoints: number; awayPoints: number } {
  if (homeScore > awayScore) {
    return {
      homePoints: config.pointsWin,
      awayPoints: config.pointsLoss,
    };
  } else if (homeScore < awayScore) {
    return {
      homePoints: config.pointsLoss,
      awayPoints: config.pointsWin,
    };
  } else {
    return {
      homePoints: config.pointsDraw,
      awayPoints: config.pointsDraw,
    };
  }
}

/**
 * Get playoff winners based on standings
 * Returns top N teams for next round
 */
export function getPlayoffTeams(
  standings: TeamStanding[],
  count: number
): number[] {
  return standings.slice(0, count).map((s) => s.teamId);
}

/**
 * Get teams for third place match
 * Returns teams that were eliminated in semifinals
 */
export function getThirdPlaceTeams(
  semiFinalists: Array<{ winner: number; loser: number }>
): number[] {
  return semiFinalists.map((s) => s.loser);
}

/**
 * Validate scoring configuration
 */
export function validateScoringConfig(config: ScoringConfig): boolean {
  return (
    config.pointsWin > 0 &&
    config.pointsWin <= 5 &&
    config.pointsDraw >= 0 &&
    config.pointsDraw <= 2 &&
    config.pointsLoss >= 0 &&
    config.pointsLoss <= 1
  );
}
