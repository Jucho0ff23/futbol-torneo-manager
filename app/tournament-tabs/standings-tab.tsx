import { View, Text, FlatList, ScrollView, Image } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";

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

interface Team {
  id: number;
  name: string;
  shieldUrl?: string;
}

interface StandingsTabProps {
  standings: Standing[];
  teams: Map<number, Team>;
}

export function StandingsTab({ standings, teams }: StandingsTabProps) {
  const colors = useColors();

  const getPositionColor = (position: number, total: number) => {
    if (position === 1) return colors.success; // Leader
    if (position <= Math.ceil(total * 0.5)) return colors.primary; // Playoff zone
    return colors.error; // Relegation zone
  };

  const getPositionLabel = (position: number) => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return `${position}°`;
  };

  const StandingRow = ({ standing, index }: { standing: Standing; index: number }) => {
    const team = teams.get(standing.teamId);
    const positionColor = getPositionColor(standing.position, standings.length);

    return (
      <View
        className="flex-row items-center gap-3 px-4 py-3 border-b border-border"
        style={{
          backgroundColor: index % 2 === 0 ? colors.background : colors.surface,
        }}
      >
        {/* Position */}
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: positionColor }}
        >
          <Text className="text-xs font-bold text-background">
            {standing.position}
          </Text>
        </View>

        {/* Team Shield and Name */}
        <View className="flex-row items-center flex-1 gap-2">
          {team?.shieldUrl ? (
            <Image
              source={{ uri: team.shieldUrl }}
              style={{ width: 28, height: 28, borderRadius: 14 }}
            />
          ) : (
            <View
              className="w-7 h-7 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Ionicons name="shield" size={14} color={colors.background} />
            </View>
          )}
          <Text className="text-sm font-semibold text-foreground flex-1">
            {team?.name || "Equipo"}
          </Text>
        </View>

        {/* Stats - Compact */}
        <View className="flex-row gap-2 items-center">
          <View className="items-center">
            <Text className="text-xs text-muted">PJ</Text>
            <Text className="text-sm font-semibold text-foreground">{standing.played}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-muted">V</Text>
            <Text className="text-sm font-semibold text-success">{standing.wins}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-muted">E</Text>
            <Text className="text-sm font-semibold text-warning">{standing.draws}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-muted">D</Text>
            <Text className="text-sm font-semibold text-error">{standing.losses}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-muted">GF</Text>
            <Text className="text-sm font-semibold text-foreground">{standing.goalsFor}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-muted">GC</Text>
            <Text className="text-sm font-semibold text-foreground">{standing.goalsAgainst}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-muted">DG</Text>
            <Text className="text-sm font-semibold text-foreground">{standing.goalDifference}</Text>
          </View>
          <View className="items-center bg-primary bg-opacity-10 px-2 py-1 rounded">
            <Text className="text-xs text-muted">Pts</Text>
            <Text className="text-sm font-bold text-primary">{standing.points}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="min-w-full">
        {/* Header */}
        <View className="bg-surface border-b-2 border-primary px-4 py-3 flex-row gap-3">
          <View className="w-8" />
          <View className="flex-1 min-w-32">
            <Text className="text-xs font-bold text-muted">EQUIPO</Text>
          </View>
          <View className="flex-row gap-2">
            <View className="items-center">
              <Text className="text-xs font-bold text-muted">PJ</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-bold text-muted">V</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-bold text-muted">E</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-bold text-muted">D</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-bold text-muted">GF</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-bold text-muted">GC</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-bold text-muted">DG</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-bold text-primary">Pts</Text>
            </View>
          </View>
        </View>

        {/* Standings Rows */}
        {standings.length > 0 ? (
          standings.map((standing, index) => (
            <StandingRow key={standing.id} standing={standing} index={index} />
          ))
        ) : (
          <View className="items-center justify-center py-12 gap-2">
            <Ionicons name="podium-outline" size={48} color={colors.muted} />
            <Text className="text-foreground font-semibold">Sin clasificación</Text>
            <Text className="text-muted text-center text-sm">
              La clasificación se actualizará cuando se registren resultados
            </Text>
          </View>
        )}

        {/* Spacer */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}

export default StandingsTab;
