import { View, Text, FlatList, ScrollView, Pressable, Image } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

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

interface Team {
  id: number;
  name: string;
  shieldUrl?: string;
}

interface ResultsTabProps {
  matches: Match[];
  teams: Map<number, Team>;
  isAdmin: boolean;
  onEditResult?: (match: Match) => void;
}

export function ResultsTab({ matches, teams, isAdmin, onEditResult }: ResultsTabProps) {
  const colors = useColors();

  // Group matches by matchday
  const groupedMatches = matches.reduce(
    (acc, match) => {
      const key = `${match.round || "Round"} - Jornada ${match.matchday}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(match);
      return acc;
    },
    {} as Record<string, Match[]>
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "PENDIENTE";
      case "live":
        return "EN VIVO";
      case "finished":
        return "FINALIZADO";
      case "postponed":
        return "APLAZADO";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.muted;
      case "live":
        return colors.warning;
      case "finished":
        return colors.success;
      case "postponed":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const handleEditResult = (match: Match) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onEditResult) {
      onEditResult(match);
    }
  };

  const MatchCard = ({ match }: { match: Match }) => {
    const homeTeam = teams.get(match.homeTeamId);
    const awayTeam = teams.get(match.awayTeamId);

    return (
      <Pressable
        onPress={() => isAdmin && handleEditResult(match)}
        style={({ pressed }) => [
          {
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 12,
            marginHorizontal: 16,
            marginBottom: 8,
            borderColor: colors.border,
            borderWidth: 1,
            opacity: pressed && isAdmin ? 0.7 : 1,
          },
        ]}
      >
        <View className="flex-row items-center justify-between gap-2">
          {/* Home Team */}
          <View className="flex-1 items-center gap-2">
            {homeTeam?.shieldUrl ? (
              <Image
                source={{ uri: homeTeam.shieldUrl }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            ) : (
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Ionicons name="shield" size={16} color={colors.background} />
              </View>
            )}
            <Text className="text-xs font-semibold text-foreground text-center">
              {homeTeam?.name || "Equipo"}
            </Text>
          </View>

          {/* Score */}
          <View className="items-center gap-1">
            {match.status === "finished" ? (
              <View className="flex-row items-center gap-1">
                <Text className="text-lg font-bold text-foreground">{match.homeScore}</Text>
                <Text className="text-xs text-muted">-</Text>
                <Text className="text-lg font-bold text-foreground">{match.awayScore}</Text>
              </View>
            ) : (
              <Text
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{ backgroundColor: getStatusColor(match.status), color: colors.background }}
              >
                {getStatusLabel(match.status)}
              </Text>
            )}
          </View>

          {/* Away Team */}
          <View className="flex-1 items-center gap-2">
            {awayTeam?.shieldUrl ? (
              <Image
                source={{ uri: awayTeam.shieldUrl }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            ) : (
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Ionicons name="shield" size={16} color={colors.background} />
              </View>
            )}
            <Text className="text-xs font-semibold text-foreground text-center">
              {awayTeam?.name || "Equipo"}
            </Text>
          </View>

          {/* Edit Button */}
          {isAdmin && match.status !== "finished" && (
            <Pressable
              onPress={() => handleEditResult(match)}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            >
              <Ionicons name="pencil" size={16} color={colors.primary} />
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {Object.entries(groupedMatches).length > 0 ? (
        Object.entries(groupedMatches).map(([key, matchList]) => (
          <View key={key} className="gap-2 mt-4">
            {/* Matchday Header */}
            <View className="px-4 py-2 bg-primary bg-opacity-10 border-l-4 border-primary">
              <Text className="text-sm font-bold text-primary">{key}</Text>
            </View>

            {/* Matches */}
            {matchList.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
        ))
      ) : (
        <View className="items-center justify-center py-12 gap-2">
          <Ionicons name="football-outline" size={48} color={colors.muted} />
          <Text className="text-foreground font-semibold">Sin partidos</Text>
          <Text className="text-muted text-center text-sm">
            El fixture aún no ha sido generado
          </Text>
        </View>
      )}

      {/* Spacer */}
      <View className="h-8" />
    </ScrollView>
  );
}

export default ResultsTab;
