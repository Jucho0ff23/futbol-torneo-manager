/**
 * Fixture Generator
 * Generates tournament fixtures for all 4 formats:
 * 1. League (Liga) - All vs All
 * 2. Groups (Grupos) - Groups + Playoffs
 * 3. Playoffs (Eliminatorias) - Single/Double elimination
 * 4. Combined (Combinado) - Multiple phases
 */

export interface Match {
  homeTeamId: number;
  awayTeamId: number;
  matchday: number;
  round?: string;
  isReturn?: boolean;
}

/**
 * Generate League Format Fixture
 * All teams play against each other (1 to N rounds)
 */
export function generateLeagueFixture(
  teamIds: number[],
  rounds: number = 1
): Match[] {
  const matches: Match[] = [];
  let matchday = 1;

  for (let round = 0; round < rounds; round++) {
    const roundMatches = generateRoundRobinMatches(teamIds, matchday, round === 1);
    matches.push(...roundMatches);
    matchday += Math.ceil(teamIds.length / 2);
  }

  return matches;
}

/**
 * Generate Round Robin matches for a single round
 */
function generateRoundRobinMatches(
  teamIds: number[],
  startMatchday: number,
  isReturn: boolean = false
): Match[] {
  const matches: Match[] = [];
  const n = teamIds.length;
  const isOdd = n % 2 === 1;
  const teams = [...teamIds];

  // If odd number of teams, add a "bye" team (represented as -1)
  if (isOdd) {
    teams.push(-1);
  }

  const numRounds = teams.length - 1;
  let matchday = startMatchday;

  for (let round = 0; round < numRounds; round++) {
    const roundMatches: Match[] = [];

    // First team stays fixed, rotate others
    for (let i = 1; i < teams.length / 2; i++) {
      const home = teams[0];
      const away = teams[i];

      // Skip if either team is the bye (represented as -1)
      if (home !== -1 && away !== -1) {
        roundMatches.push({
          homeTeamId: home,
          awayTeamId: away,
          matchday,
          isReturn,
        });
      }

      // Also add the reverse match in the same matchday
      if (home !== -1 && away !== -1) {
        roundMatches.push({
          homeTeamId: away,
          awayTeamId: home,
          matchday,
          isReturn,
        });
      }
    }

    // Rotate teams (keep first fixed)
    const last = teams.pop();
    if (last !== undefined) {
      teams.splice(1, 0, last);
    }

    // If odd number of teams, one team has a bye
    // Add a marker for the bye (PENDIENTE)
    if (isOdd && roundMatches.length > 0) {
      // The bye is handled by having one team not play
      matchday++;
    } else {
      matchday++;
    }

    matches.push(...roundMatches);
  }

  return matches;
}

/**
 * Generate Groups Format Fixture
 * Teams are divided into groups, play within groups, then playoffs
 */
export function generateGroupsFixture(
  teamIds: number[],
  numGroups: number = 2,
  rounds: number = 1
): Match[] {
  const matches: Match[] = [];

  // Divide teams into groups
  const groups = divideIntoGroups(teamIds, numGroups);

  // Generate matches within each group
  let matchday = 1;
  groups.forEach((group, groupIndex) => {
    const groupMatches = generateLeagueFixture(group, rounds);
    groupMatches.forEach((match) => {
      match.round = `Grupo ${String.fromCharCode(65 + groupIndex)}`; // A, B, C, etc.
      match.matchday = matchday + match.matchday - 1;
    });
    matchday += Math.ceil(group.length / 2) * rounds;
    matches.push(...groupMatches);
  });

  // TODO: Generate playoff matches based on group standings

  return matches;
}

/**
 * Divide teams into groups
 */
function divideIntoGroups(teamIds: number[], numGroups: number): number[][] {
  const groups: number[][] = Array.from({ length: numGroups }, () => []);
  teamIds.forEach((teamId, index) => {
    groups[index % numGroups].push(teamId);
  });
  return groups;
}

/**
 * Generate Playoffs Format Fixture
 * Single or double elimination bracket
 */
export function generatePlayoffsFixture(
  teamIds: number[],
  isDoubleElimination: boolean = false,
  includeThirdPlace: boolean = false
): Match[] {
  const matches: Match[] = [];

  // Sort teams to create bracket
  const bracket = createPlayoffBracket(teamIds);

  // Generate first round matches
  let matchday = 1;
  let round = 1;

  const roundMatches = bracket.map((pair, index) => ({
    homeTeamId: pair[0],
    awayTeamId: pair[1],
    matchday,
    round: `${getRoundName(bracket.length)} - Partido ${index + 1}`,
  }));

  matches.push(...roundMatches);

  // TODO: Generate subsequent rounds based on winners
  // TODO: Handle double elimination if needed
  // TODO: Generate third place match if needed

  return matches;
}

/**
 * Create playoff bracket from teams
 */
function createPlayoffBracket(teamIds: number[]): [number, number][] {
  const bracket: [number, number][] = [];
  const n = teamIds.length;

  // Pair teams for bracket
  for (let i = 0; i < n; i += 2) {
    if (i + 1 < n) {
      bracket.push([teamIds[i], teamIds[i + 1]]);
    } else {
      // Odd team gets a bye (represented as -1)
      bracket.push([teamIds[i], -1]);
    }
  }

  return bracket;
}

/**
 * Get round name based on number of teams
 */
function getRoundName(numMatches: number): string {
  const totalTeams = numMatches * 2;

  if (totalTeams === 2) return "Final";
  if (totalTeams === 4) return "Semifinal";
  if (totalTeams === 8) return "Cuartos";
  if (totalTeams === 16) return "Octavos";
  if (totalTeams === 32) return "16avos";
  if (totalTeams === 64) return "32avos";

  return `Ronda de ${totalTeams}`;
}

/**
 * Generate Combined Format Fixture
 * Multiple phases (e.g., Groups -> Playoffs)
 */
export function generateCombinedFixture(
  teamIds: number[],
  phases: Array<{ type: "league" | "groups" | "playoffs"; config: any }>
): Match[] {
  const matches: Match[] = [];
  let currentTeams = teamIds;
  let matchday = 1;

  phases.forEach((phase, phaseIndex) => {
    let phaseMatches: Match[] = [];

    if (phase.type === "league") {
      phaseMatches = generateLeagueFixture(currentTeams, phase.config.rounds || 1);
    } else if (phase.type === "groups") {
      phaseMatches = generateGroupsFixture(
        currentTeams,
        phase.config.numGroups || 2,
        phase.config.rounds || 1
      );
    } else if (phase.type === "playoffs") {
      phaseMatches = generatePlayoffsFixture(
        currentTeams,
        phase.config.isDoubleElimination || false,
        phase.config.includeThirdPlace || false
      );
    }

    // Update matchday and round for phase
    phaseMatches.forEach((match) => {
      match.matchday = matchday + match.matchday - 1;
      if (!match.round) {
        match.round = `Fase ${phaseIndex + 1}`;
      } else {
        match.round = `Fase ${phaseIndex + 1} - ${match.round}`;
      }
    });

    matchday += Math.max(...phaseMatches.map((m) => m.matchday)) + 1;
    matches.push(...phaseMatches);

    // TODO: Filter teams for next phase based on standings
  });

  return matches;
}
