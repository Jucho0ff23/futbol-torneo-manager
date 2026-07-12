import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  tournaments,
  teams,
  matches,
  standings,
  tournamentSettings,
  InsertTournament,
  InsertTeam,
  InsertMatch,
  InsertStanding,
  InsertTournamentSettings,
} from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import {
  generateAdminPassword,
  generateSpectatorCode,
  generateLeagueFixture,
  generateGroupsFixture,
  generatePlayoffFixture,
  calculateStandings,
  sortStandings,
} from "@/lib/tournament-utils";

export const tournamentsRouter = router({
  /**
   * Create a new tournament
   */
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        format: z.enum(["league", "groups", "playoffs", "combined"]),
        userId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const adminPassword = generateAdminPassword();
      const spectatorCode = generateSpectatorCode(Date.now());

      await db
        .insert(tournaments)
        .values({
          userId: input.userId,
          name: input.name,
          description: input.description,
          format: input.format,
          adminPassword,
          spectatorCode,
          status: "draft",
        } as InsertTournament);

      // Get the created tournament
      const result = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.spectatorCode, spectatorCode))
        .limit(1);

      return result[0];
    }),

  /**
   * Get tournament by ID
   */
  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, input));

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    return tournament;
  }),

  /**
   * Get all tournaments for a user
   */
  getByUser: publicProcedure.input(z.number()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const userTournaments = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.userId, input));

    return userTournaments;
  }),

  /**
   * Add team to tournament
   */
  addTeam: publicProcedure
    .input(
      z.object({
        tournamentId: z.number(),
        name: z.string().min(1).max(255),
        shieldUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .insert(teams)
        .values({
          tournamentId: input.tournamentId,
          name: input.name,
          shieldUrl: input.shieldUrl,
        } as InsertTeam);

      // Get the created team
      const result = await db
        .select()
        .from(teams)
        .where(eq(teams.tournamentId, input.tournamentId))
        .orderBy((t: any) => t.id)
        .limit(1);

      return result[0];
    }),

  /**
   * Get teams for a tournament
   */
  getTeams: publicProcedure.input(z.number()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const teamList = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, input));

    return teamList;
  }),

  /**
   * Create tournament settings
   */
  createSettings: publicProcedure
    .input(
      z.object({
        tournamentId: z.number(),
        pointsWin: z.number().default(3),
        pointsDraw: z.number().default(1),
        pointsLoss: z.number().default(0),
        rounds: z.number().default(1),
        numGroups: z.number().optional(),
        playoffType: z.enum(["single", "double"]).optional(),
        thirdPlaceMatch: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .insert(tournamentSettings)
        .values({
          tournamentId: input.tournamentId,
          pointsWin: input.pointsWin,
          pointsDraw: input.pointsDraw,
          pointsLoss: input.pointsLoss,
          rounds: input.rounds,
          numGroups: input.numGroups,
          playoffType: input.playoffType,
          thirdPlaceMatch: input.thirdPlaceMatch ? 1 : 0,
        } as InsertTournamentSettings);

      // Get the created settings
      const result = await db
        .select()
        .from(tournamentSettings)
        .where(eq(tournamentSettings.tournamentId, input.tournamentId))
        .limit(1);

      return result[0];
    }),

  /**
   * Generate fixture for tournament
   */
  generateFixture: publicProcedure
    .input(z.number())
    .mutation(async ({ input: tournamentId }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Get tournament
      const [tournament] = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, tournamentId));

      if (!tournament) {
        throw new Error("Tournament not found");
      }

      // Get teams
      const teamList = await db
        .select()
        .from(teams)
        .where(eq(teams.tournamentId, tournamentId));

      if (teamList.length < 2) {
        throw new Error("Minimum 2 teams required");
      }

      const teamIds = teamList.map((t: any) => t.id);

      // Get settings
      const [settings] = await db
        .select()
        .from(tournamentSettings)
        .where(eq(tournamentSettings.tournamentId, tournamentId));

      let fixtureMatches: any[] = [];

      // Generate fixture based on format
      if (tournament.format === "league") {
        fixtureMatches = generateLeagueFixture(teamIds, settings?.rounds || 1);
      } else if (tournament.format === "groups") {
        fixtureMatches = generateGroupsFixture(
          teamIds,
          settings?.numGroups || 2,
          settings?.rounds || 1
        );
      } else if (tournament.format === "playoffs") {
        fixtureMatches = generatePlayoffFixture(
          teamIds,
          settings?.playoffType === "single",
          settings?.thirdPlaceMatch === 1
        );
      }

      // Insert matches
      for (const match of fixtureMatches) {
        if (!match.isPending && match.homeTeamId && match.awayTeamId) {
          await db
            .insert(matches)
            .values({
              tournamentId,
              homeTeamId: match.homeTeamId,
              awayTeamId: match.awayTeamId,
              matchday: match.matchday,
              round: match.round,
              status: "pending",
            } as InsertMatch);
        }
      }

      // Initialize standings
      for (const teamId of teamIds) {
        await db
          .insert(standings)
          .values({
            tournamentId,
            teamId,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
          } as InsertStanding);
      }

      // Update tournament status
      await db
        .update(tournaments)
        .set({ status: "active" })
        .where(eq(tournaments.id, tournamentId));

      return { success: true, matchCount: fixtureMatches.length };
    }),

  /**
   * Get matches for a tournament
   */
  getMatches: publicProcedure.input(z.number()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const matchList = await db
      .select()
      .from(matches)
      .where(eq(matches.tournamentId, input));

    return matchList;
  }),

  /**
   * Update match result
   */
  updateResult: publicProcedure
    .input(
      z.object({
        matchId: z.number(),
        homeScore: z.number().min(0),
        awayScore: z.number().min(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Get match
      const [match] = await db
        .select()
        .from(matches)
        .where(eq(matches.id, input.matchId));

      if (!match) {
        throw new Error("Match not found");
      }

      // Update match
      await db
        .update(matches)
        .set({
          homeScore: input.homeScore,
          awayScore: input.awayScore,
          status: "finished",
        })
        .where(eq(matches.id, input.matchId));

      // Update standings
      const tournament = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, match.tournamentId));

      if (tournament.length > 0) {
        const settings = await db
          .select()
          .from(tournamentSettings)
          .where(eq(tournamentSettings.tournamentId, match.tournamentId));

        const pointsWin = settings[0]?.pointsWin || 3;
        const pointsDraw = settings[0]?.pointsDraw || 1;
        const pointsLoss = settings[0]?.pointsLoss || 0;

        // Calculate new points
        let homePoints = 0;
        let awayPoints = 0;

        if (input.homeScore > input.awayScore) {
          homePoints = pointsWin;
          awayPoints = pointsLoss;
        } else if (input.homeScore < input.awayScore) {
          awayPoints = pointsWin;
          homePoints = pointsLoss;
        } else {
          homePoints = pointsDraw;
          awayPoints = pointsDraw;
        }

        // Update home team standing
        const [homeStanding] = await db
          .select()
          .from(standings)
          .where(
            and(
              eq(standings.tournamentId, match.tournamentId),
              eq(standings.teamId, match.homeTeamId)
            )
          );

        if (homeStanding) {
          await db
            .update(standings)
            .set({
              played: homeStanding.played + 1,
              wins:
                input.homeScore > input.awayScore
                  ? homeStanding.wins + 1
                  : homeStanding.wins,
              draws:
                input.homeScore === input.awayScore
                  ? homeStanding.draws + 1
                  : homeStanding.draws,
              losses:
                input.homeScore < input.awayScore
                  ? homeStanding.losses + 1
                  : homeStanding.losses,
              goalsFor: homeStanding.goalsFor + input.homeScore,
              goalsAgainst: homeStanding.goalsAgainst + input.awayScore,
              goalDifference:
                homeStanding.goalsFor +
                input.homeScore -
                (homeStanding.goalsAgainst + input.awayScore),
              points: homeStanding.points + homePoints,
            })
            .where(eq(standings.id, homeStanding.id));
        }

        // Update away team standing
        const [awayStanding] = await db
          .select()
          .from(standings)
          .where(
            and(
              eq(standings.tournamentId, match.tournamentId),
              eq(standings.teamId, match.awayTeamId)
            )
          );

        if (awayStanding) {
          await db
            .update(standings)
            .set({
              played: awayStanding.played + 1,
              wins:
                input.awayScore > input.homeScore
                  ? awayStanding.wins + 1
                  : awayStanding.wins,
              draws:
                input.homeScore === input.awayScore
                  ? awayStanding.draws + 1
                  : awayStanding.draws,
              losses:
                input.awayScore < input.homeScore
                  ? awayStanding.losses + 1
                  : awayStanding.losses,
              goalsFor: awayStanding.goalsFor + input.awayScore,
              goalsAgainst: awayStanding.goalsAgainst + input.homeScore,
              goalDifference:
                awayStanding.goalsFor +
                input.awayScore -
                (awayStanding.goalsAgainst + input.homeScore),
              points: awayStanding.points + awayPoints,
            })
            .where(eq(standings.id, awayStanding.id));
        }
      }

      return { success: true };
    }),

  /**
   * Get standings for a tournament
   */
  getStandings: publicProcedure.input(z.number()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const standingsList = await db
      .select()
      .from(standings)
      .where(eq(standings.tournamentId, input));

    // Sort by points, goal difference, goals for
    const sorted = standingsList.sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference)
        return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    return sorted.map((s: any, index: number) => ({
      ...s,
      position: index + 1,
    }));
  }),

  /**
   * Delete tournament (requires admin password)
   */
  delete: publicProcedure
    .input(
      z.object({
        tournamentId: z.number(),
        adminPassword: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [tournament] = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, input.tournamentId));

      if (!tournament) {
        throw new Error("Tournament not found");
      }

      if (tournament.adminPassword !== input.adminPassword) {
        throw new Error("Invalid admin password");
      }

      // Delete related data
      await db
        .delete(matches)
        .where(eq(matches.tournamentId, input.tournamentId));
      await db
        .delete(standings)
        .where(eq(standings.tournamentId, input.tournamentId));
      await db
        .delete(teams)
        .where(eq(teams.tournamentId, input.tournamentId));
      await db
        .delete(tournamentSettings)
        .where(eq(tournamentSettings.tournamentId, input.tournamentId));
      await db
        .delete(tournaments)
        .where(eq(tournaments.id, input.tournamentId));

      return { success: true };
    }),
});
