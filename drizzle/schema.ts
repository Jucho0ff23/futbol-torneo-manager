import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const tournaments = mysqlTable("tournaments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  format: mysqlEnum("format", ["league", "groups", "playoffs", "combined"]).notNull(),
  status: mysqlEnum("status", ["draft", "active", "finished"]).default("draft").notNull(),
  adminPassword: varchar("adminPassword", { length: 10 }).notNull(),
  spectatorCode: varchar("spectatorCode", { length: 20 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = typeof tournaments.$inferInsert;

export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull().references(() => tournaments.id),
  name: varchar("name", { length: 255 }).notNull(),
  shieldUrl: varchar("shieldUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull().references(() => tournaments.id),
  homeTeamId: int("homeTeamId").notNull().references(() => teams.id),
  awayTeamId: int("awayTeamId").notNull().references(() => teams.id),
  homeScore: int("homeScore"),
  awayScore: int("awayScore"),
  status: mysqlEnum("status", ["pending", "live", "finished", "postponed"]).default("pending").notNull(),
  matchday: int("matchday").notNull(),
  round: varchar("round", { length: 50 }),
  isReturn: int("isReturn").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

export const standings = mysqlTable("standings", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull().references(() => tournaments.id),
  teamId: int("teamId").notNull().references(() => teams.id),
  position: int("position"),
  played: int("played").default(0).notNull(),
  wins: int("wins").default(0).notNull(),
  draws: int("draws").default(0).notNull(),
  losses: int("losses").default(0).notNull(),
  goalsFor: int("goalsFor").default(0).notNull(),
  goalsAgainst: int("goalsAgainst").default(0).notNull(),
  goalDifference: int("goalDifference").default(0).notNull(),
  points: int("points").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Standing = typeof standings.$inferSelect;
export type InsertStanding = typeof standings.$inferInsert;

export const tournamentSettings = mysqlTable("tournamentSettings", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull().references(() => tournaments.id).unique(),
  pointsWin: int("pointsWin").default(3).notNull(),
  pointsDraw: int("pointsDraw").default(1).notNull(),
  pointsLoss: int("pointsLoss").default(0).notNull(),
  rounds: int("rounds").default(1).notNull(),
  numGroups: int("numGroups"),
  playoffType: mysqlEnum("playoffType", ["single", "double"]),
  thirdPlaceMatch: int("thirdPlaceMatch").default(0),
});

export type TournamentSettings = typeof tournamentSettings.$inferSelect;
export type InsertTournamentSettings = typeof tournamentSettings.$inferInsert;
