import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { InfoTab } from "./tournament-tabs/info-tab";
import { ParticipantsTab } from "./tournament-tabs/participants-tab";
import { ResultsTab } from "./tournament-tabs/results-tab";
import { StandingsTab } from "./tournament-tabs/standings-tab";

interface Tournament {
  id: number;
  name: string;
  description?: string;
  format: "league" | "groups" | "playoffs" | "combined";
  status: "draft" | "active" | "finished";
  adminPassword: string;
  spectatorCode?: string;
}

interface Team {
  id: number;
  name: string;
  shieldUrl?: string;
}

interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore?: number;
  awayScore?: number;
  status: "pending" | "live" | "finished" | "postponed";
  matchday: number;
  round?: string;
}

interface Standing {
  id: number;
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

export default function TournamentDetail() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // TODO: Load tournament data from API
    setLoading(false);
  }, []);

  const teamsMap = new Map(teams.map((t) => [t.id, t]));

  const tabs = [
    {
      name: "Información",
      icon: "information-circle",
      component: (
        <InfoTab
          tournament={tournament}
          isAdmin={isAdmin}
          onDeletePress={() => {
            // TODO: Handle delete
          }}
        />
      ),
    },
    {
      name: "Participantes",
      icon: "people",
      component: (
        <ParticipantsTab
          teams={teams}
          isAdmin={isAdmin}
          onEditTeam={() => {
            // TODO: Handle edit team
          }}
          onDeleteTeam={() => {
            // TODO: Handle delete team
          }}
        />
      ),
    },
    {
      name: "Resultados",
      icon: "football",
      component: (
        <ResultsTab
          matches={matches}
          teams={teamsMap}
          isAdmin={isAdmin}
          onEditResult={() => {
            // TODO: Handle edit result
          }}
        />
      ),
    },
    {
      name: "Clasificación",
      icon: "podium",
      component: <StandingsTab standings={standings} teams={teamsMap} />,
    },
  ];

  if (loading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!tournament) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-foreground">Torneo no encontrado</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="px-4 pt-4 pb-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">{tournament.name}</Text>
        <Text className="text-sm text-muted mt-1">
          {tournament.format === "league"
            ? "Liga"
            : tournament.format === "groups"
              ? "Grupos"
              : tournament.format === "playoffs"
                ? "Eliminatorias"
                : "Combinado"}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-border bg-surface">
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveTab(index);
            }}
            style={({ pressed }) => [
              {
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderBottomWidth: activeTab === index ? 3 : 0,
                borderBottomColor: activeTab === index ? colors.primary : "transparent",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View className="items-center gap-1">
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={activeTab === index ? colors.primary : colors.muted}
              />
              <Text
                className="text-xs font-semibold"
                style={{
                  color: activeTab === index ? colors.primary : colors.muted,
                }}
              >
                {tab.name}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Tab Content */}
      <View className="flex-1">{tabs[activeTab].component}</View>
    </ScreenContainer>
  );
}
