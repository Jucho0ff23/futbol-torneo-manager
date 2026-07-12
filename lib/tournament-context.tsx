import React, { createContext, useContext, useState, useCallback } from "react";

export interface Tournament {
  id: number;
  userId: number;
  name: string;
  description?: string;
  format: "league" | "groups" | "playoffs" | "combined";
  status: "draft" | "active" | "finished";
  adminPassword: string;
  spectatorCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: number;
  tournamentId: number;
  name: string;
  shieldUrl?: string;
  createdAt: Date;
}

export interface Match {
  id: number;
  tournamentId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore?: number;
  awayScore?: number;
  status: "pending" | "live" | "finished" | "postponed";
  matchday: number;
  round?: string;
  isReturn?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Standing {
  id: number;
  tournamentId: number;
  teamId: number;
  position?: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  updatedAt: Date;
}

interface TournamentContextType {
  currentTournament: Tournament | null;
  setCurrentTournament: (tournament: Tournament | null) => void;
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  standings: Standing[];
  setStandings: (standings: Standing[]) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  adminPassword: string;
  setAdminPassword: (password: string) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const value: TournamentContextType = {
    currentTournament,
    setCurrentTournament,
    teams,
    setTeams,
    matches,
    setMatches,
    standings,
    setStandings,
    isAdmin,
    setIsAdmin,
    adminPassword,
    setAdminPassword,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within TournamentProvider");
  }
  return context;
}
