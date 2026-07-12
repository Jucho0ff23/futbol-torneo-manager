import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore?: number;
  awayScore?: number;
  status: "pending" | "live" | "finished" | "postponed";
}

interface Team {
  id: number;
  name: string;
}

interface EditMatchResultProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  onSave: (homeScore: number, awayScore: number) => Promise<void>;
  onCancel: () => void;
}

export function EditMatchResult({
  match,
  homeTeam,
  awayTeam,
  onSave,
  onCancel,
}: EditMatchResultProps) {
  const colors = useColors();
  const [homeScore, setHomeScore] = useState(match.homeScore || 0);
  const [awayScore, setAwayScore] = useState(match.awayScore || 0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      await onSave(homeScore, awayScore);
    } catch (error) {
      console.error("Error saving result:", error);
      alert("Ocurrió un error al guardar el resultado");
    } finally {
      setLoading(false);
    }
  };

  const ScoreInput = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
  }) => (
    <View className="items-center gap-2">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => {
            if (value > 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(value - 1);
            }
          }}
          style={({ pressed }) => [
            {
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="remove" size={20} color={colors.foreground} />
        </Pressable>

        <View
          className="w-16 items-center justify-center py-3 rounded-lg"
          style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
        >
          <Text className="text-3xl font-bold text-primary">{value}</Text>
        </View>

        <Pressable
          onPress={() => {
            if (value < 20) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(value + 1);
            }
          }}
          style={({ pressed }) => [
            {
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={20} color={colors.background} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View>
          <Text className="text-2xl font-bold text-foreground mb-2">Resultado del partido</Text>
          <Text className="text-sm text-muted">Ingresa los goles de cada equipo</Text>
        </View>

        {/* Match Info */}
        <View className="bg-surface rounded-lg p-4 border border-border gap-4">
          {/* Home Team */}
          <View className="items-center gap-2">
            <Text className="text-sm font-semibold text-muted">LOCAL</Text>
            <Text className="text-lg font-bold text-foreground">{homeTeam.name}</Text>
          </View>

          {/* VS */}
          <View className="items-center">
            <Text className="text-xs text-muted font-semibold">VS</Text>
          </View>

          {/* Away Team */}
          <View className="items-center gap-2">
            <Text className="text-sm font-semibold text-muted">VISITANTE</Text>
            <Text className="text-lg font-bold text-foreground">{awayTeam.name}</Text>
          </View>
        </View>

        {/* Score Input */}
        <View className="flex-row items-end justify-around gap-4">
          <View className="flex-1">
            <ScoreInput label={homeTeam.name} value={homeScore} onChange={setHomeScore} />
          </View>

          <View className="items-center pb-2">
            <Text className="text-2xl font-bold text-primary">-</Text>
          </View>

          <View className="flex-1">
            <ScoreInput label={awayTeam.name} value={awayScore} onChange={setAwayScore} />
          </View>
        </View>

        {/* Result Preview */}
        <View className="bg-primary bg-opacity-10 rounded-lg p-4 border border-primary border-opacity-30">
          <Text className="text-xs text-muted mb-2">RESULTADO</Text>
          <View className="flex-row items-center justify-center gap-3">
            <Text className="text-lg font-semibold text-foreground">{homeTeam.name}</Text>
            <Text className="text-2xl font-bold text-primary">{homeScore}</Text>
            <Text className="text-lg font-semibold text-muted">-</Text>
            <Text className="text-2xl font-bold text-primary">{awayScore}</Text>
            <Text className="text-lg font-semibold text-foreground">{awayTeam.name}</Text>
          </View>
          <View className="mt-3 pt-3 border-t border-primary border-opacity-30">
            <Text className="text-xs text-muted text-center">
              {homeScore > awayScore
                ? `${homeTeam.name} gana`
                : homeScore < awayScore
                  ? `${awayTeam.name} gana`
                  : "Empate"}
            </Text>
          </View>
        </View>

        {/* Spacer */}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row gap-3 px-4 pb-6 border-t border-border pt-4">
        <Pressable
          onPress={onCancel}
          disabled={loading}
          style={({ pressed }) => [
            {
              flex: 1,
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 12,
              opacity: pressed || loading ? 0.7 : 1,
            },
          ]}
        >
          <Text className="text-center font-semibold text-foreground">Cancelar</Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={({ pressed }) => [
            {
              flex: 1,
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 12,
              opacity: pressed || loading ? 0.7 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="checkmark" size={18} color={colors.background} />
              <Text className="font-semibold text-background">Guardar</Text>
            </View>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

export default EditMatchResult;
