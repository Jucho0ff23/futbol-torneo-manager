/**
 * Tournament utility functions for password generation, fixture creation, and standings calculation
 */

/**
 * Generate a 4-character alphanumeric admin password (lowercase letters + numbers)
 * Example: "2b4k", "a9z1"
 */
export function generateAdminPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 4; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Generate a unique spectator code for sharing
 * Format: tournament-id-randomstring
 */
export function generateSpectatorCode(tournamentId: number): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `spec-${tournamentId}-${randomPart}`;
}

/**
 * Generate league fixture (round-robin)
 * Handles odd number of teams with a "PENDING" (rest) slot
 */
export function generateLeagueFixture(
  teamIds: number[],
  rounds: number = 1
): Array<{
  homeTeamId: number | null;
  awayTeamId: number | null;
  matchday: number;
  round: string;
  isPending: boolean;
}> {
  const matches: Array<{
    homeTeamId: number | null;
    awayTeamId: number | null;
    matchday: number;
    round: string;
    isPending: boolean;
  }> = [];

  const teams = [...teamIds];
  const isOdd = teams.length % 2 === 1;

  // Add a dummy team if odd number
  if (isOdd) {
    teams.push(-1); // -1 represents rest/pending
  }

  const n = teams.length;
  let matchday = 1;

  // Generate round-robin for each round
  for (let roundNum = 1; roundNum <= rounds; roundNum++) {
    // Generate matchdays for this round
    for (let day = 0; day < n - 1; day++) {
      // Rotate teams
      const rotated = [teams[0], ...teams.slice(1).reverse()];

      // Create matches for this matchday
      for (let i = 0; i < n / 2; i++) {
        const home = rotated[i];
        const away = rotated[n - 1 - i];

        if (home === -1 || away === -1) {
          // One team is resting
          matches.push({
            homeTeamId: home === -1 ? null : home,
            awayTeamId: away === -1 ? null : away,
            matchday,
            round: `Round ${roundNum}`,
            isPending: true,
          });
        } else {
          matches.push({
            homeTeamId: home,
            awayTeamId: away,
            matchday,
            round: `Round ${roundNum}`,
            isPending: false,
          });
        }
      }

      matchday++;

      // Rotate for next matchday
      teams.splice(1, 0, teams.pop()!);
    }
  }

  return matches;
}

/**
 * Generate group stage fixture
 */
export function generateGroupsFixture(
  teamIds: number[],
  numGroups: number,
  rounds: number = 1
): Array<{
  homeTeamId: number | null;
  awayTeamId: number | null;
  matchday: number;
  round: string;
  group: number;
  isPending: boolean;
}> {
  const matches: Array<{
    homeTeamId: number | null;
    awayTeamId: number | null;
    matchday: number;
    round: string;
    group: number;
    isPending: boolean;
  }> = [];

  // Distribute teams into groups
  const teamsPerGroup = Math.ceil(teamIds.length / numGroups);
  const groups: number[][] = [];

  for (let g = 0; g < numGroups; g++) {
    const start = g * teamsPerGroup;
    const end = Math.min(start + teamsPerGroup, teamIds.length);
    groups.push(teamIds.slice(start, end));
  }

  // Generate fixtures for each group
  let matchday = 1;
  for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
    const groupTeams = groups[groupIdx];
    const isOdd = groupTeams.length % 2 === 1;
    const teams = [...groupTeams];

    if (isOdd) {
      teams.push(-1);
    }

    const n = teams.length;

    for (let roundNum = 1; roundNum <= rounds; roundNum++) {
      for (let day = 0; day < n - 1; day++) {
        const rotated = [teams[0], ...teams.slice(1).reverse()];

        for (let i = 0; i < n / 2; i++) {
          const home = rotated[i];
          const away = rotated[n - 1 - i];

          if (home === -1 || away === -1) {
            matches.push({
              homeTeamId: home === -1 ? null : home,
              awayTeamId: away === -1 ? null : away,
              matchday,
              round: `Round ${roundNum}`,
              group: groupIdx + 1,
              isPending: true,
            });
          } else {
            matches.push({
              homeTeamId: home,
              awayTeamId: away,
              matchday,
              round: `Round ${roundNum}`,
              group: groupIdx + 1,
              isPending: false,
            });
          }
        }

        matchday++;
        teams.splice(1, 0, teams.pop()!);
      }
    }
  }

  return matches;
}

/**
 * Generate playoff bracket fixture
 */
export function generatePlayoffFixture(
  teamIds: number[],
  isSingleMatch: boolean = true,
  includeThirdPlace: boolean = false
): Array<{
  homeTeamId: number | null;
  awayTeamId: number | null;
  matchday: number;
  round: string;
  isPending: boolean;
  isReturn?: boolean;
}> {
  const matches: Array<{
    homeTeamId: number | null;
    awayTeamId: number | null;
    matchday: number;
    round: string;
    isPending: boolean;
    isReturn?: boolean;
  }> = [];

  const teams = [...teamIds];
  const n = teams.length;

  // Determine round names
  const getRoundName = (remaining: number): string => {
    switch (remaining) {
      case 2:
        return "Final";
      case 4:
        return "Semifinals";
      case 8:
        return "Quarterfinals";
      case 16:
        return "Round of 16";
      case 32:
        return "Round of 32";
      default:
        return `Round (${remaining} teams)`;
    }
  };

  // Handle odd number of teams with direct passes
  let currentTeams = teams;
  let matchday = 1;
  let roundNum = 0;

  while (currentTeams.length > 1) {
    const roundName = getRoundName(currentTeams.length);
    const nextRoundTeams: number[] = [];

    // Create matches
    for (let i = 0; i < currentTeams.length; i += 2) {
      const home = currentTeams[i];
      const away = currentTeams[i + 1] || null;

      if (away === null) {
        // Direct pass (odd team)
        nextRoundTeams.push(home);
        matches.push({
          homeTeamId: home,
          awayTeamId: null,
          matchday,
          round: `${roundName} (Direct Pass)`,
          isPending: true,
        });
      } else {
        // Regular match
        matches.push({
          homeTeamId: home,
          awayTeamId: away,
          matchday,
          round: roundName,
          isPending: false,
        });

        // Add return match if double elimination
        if (!isSingleMatch) {
          matches.push({
            homeTeamId: away,
            awayTeamId: home,
            matchday: matchday + 1,
            round: `${roundName} (Return)`,
            isPending: false,
            isReturn: true,
          });
        }

        // Placeholder for winner (will be determined after match)
        nextRoundTeams.push(home);
      }
    }

    currentTeams = nextRoundTeams;
    matchday = isSingleMatch ? matchday + 1 : matchday + 2;
    roundNum++;
  }

  // Add third-place match if requested
  if (includeThirdPlace && matchday > 1) {
    matches.push({
      homeTeamId: null,
      awayTeamId: null,
      matchday: matchday + 1,
      round: "Third Place Match",
      isPending: true,
    });
  }

  return matches;
}

/**
 * Calculate standings from matches
 */
export function calculateStandings(
  matches: Array<{
    homeTeamId: number;
    awayTeamId: number;
    homeScore?: number;
    awayScore?: number;
    status: string;
  }>,
  teamIds: number[],
  pointsWin: number = 3,
  pointsDraw: number = 1,
  pointsLoss: number = 0
): Record<
  number,
  {
    teamId: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }
> {
  const standings: Record<
    number,
    {
      teamId: number;
      played: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
      points: number;
    }
  > = {};

  // Initialize standings for all teams
  for (const teamId of teamIds) {
    standings[teamId] = {
      teamId,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  }

  // Process finished matches
  for (const match of matches) {
    if (match.status === "finished" && match.homeScore !== undefined && match.awayScore !== undefined) {
      const home = standings[match.homeTeamId];
      const away = standings[match.awayTeamId];

      if (home && away) {
        home.played++;
        away.played++;
        home.goalsFor += match.homeScore;
        home.goalsAgainst += match.awayScore;
        away.goalsFor += match.awayScore;
        away.goalsAgainst += match.homeScore;

        if (match.homeScore > match.awayScore) {
          home.wins++;
          home.points += pointsWin;
          away.losses++;
          away.points += pointsLoss;
        } else if (match.homeScore < match.awayScore) {
          away.wins++;
          away.points += pointsWin;
          home.losses++;
          home.points += pointsLoss;
        } else {
          home.draws++;
          away.draws++;
          home.points += pointsDraw;
          away.points += pointsDraw;
        }

        home.goalDifference = home.goalsFor - home.goalsAgainst;
        away.goalDifference = away.goalsFor - away.goalsAgainst;
      }
    }
  }

  return standings;
}

/**
 * Sort standings by points, goal difference, goals for
 */
export function sortStandings(
  standings: Record<
    number,
    {
      teamId: number;
      played: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
      points: number;
    }
  >
): Array<{
  position: number;
  teamId: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}> {
  const sorted = Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return sorted.map((team, index) => ({
    position: index + 1,
    ...team,
  }));
}
