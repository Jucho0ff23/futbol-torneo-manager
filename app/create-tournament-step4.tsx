import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface Team {
  id: string;
  name: string;
  shieldUrl?: string;
}

interface CreateTournamentStep4Props {
  tournamentName: string;
  format: "league" | "groups" | "playoffs" | "combined";
  teams: Team[];
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  rounds: number;
  onConfirm: () => Promise<void>;
  onBack?: () => void;
}

export function CreateTournamentStep4({
  tournamentName,
  format,
  teams,
  pointsWin,
  pointsDraw,
  pointsLoss,
  rounds,
  onConfirm,
  onBack,
}: CreateTournamentStep4Props) {
  const colors = useColors();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      await onConfirm();
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al crear el torneo");
    } finally {
      setLoading(false);
    }
  };

  const formatLabel = {
    league: "Liga",
    groups: "Grupos",
    playoffs: "Eliminatorias",
    combined: "Combinado",
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View>
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
              <Text className="text-background font-bold">4</Text>
            </View>
            <Text className="text-lg font-semibold text-foreground">Resumen</Text>
          </View>
          <Text className="text-sm text-muted">
            Revisa los datos antes de crear el torneo
          </Text>
        </View>

        {/* Tournament Info */}
        <View className="bg-surface rounded-lg p-4 border border-border gap-3">
          <Text className="text-sm font-semibold text-foreground mb-2">Información del torneo</Text>
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Nombre</Text>
            <Text className="text-sm font-semibold text-foreground">{tournamentName}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Formato</Text>
            <Text className="text-sm font-semibold text-primary">
              {formatLabel[format]}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Equipos</Text>
            <Text className="text-sm font-semibold text-foreground">{teams.length}</Text>
          </View>
        </View>

        {/* Scoring System */}
        <View className="bg-surface rounded-lg p-4 border border-border gap-3">
          <Text className="text-sm font-semibold text-foreground mb-2">Sistema de puntuación</Text>
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Victoria</Text>
            <Text className="text-sm font-semibold text-success">{pointsWin} pts</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Empate</Text>
            <Text className="text-sm font-semibold text-warning">{pointsDraw} pts</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Derrota</Text>
            <Text className="text-sm font-semibold text-error">{pointsLoss} pts</Text>
          </View>
          {(format === "league" || format === "groups") && (
            <View className="flex-row justify-between border-t border-border pt-3 mt-3">
              <Text className="text-xs text-muted">Vueltas</Text>
              <Text className="text-sm font-semibold text-primary">{rounds}</Text>
            </View>
          )}
        </View>

        {/* Teams List */}
        <View className="bg-surface rounded-lg p-4 border border-border gap-3">
          <Text className="text-sm font-semibold text-foreground mb-2">Equipos participantes</Text>
          {teams.map((team, index) => (
            <View key={team.id} className="flex-row items-center gap-3">
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-background font-bold text-xs">{index + 1}</Text>
              </View>
              <Text className="text-sm text-foreground flex-1">{team.name}</Text>
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View className="bg-primary bg-opacity-10 rounded-lg p-4 border border-primary border-opacity-30 gap-2">
          <View className="flex-row items-start gap-2">
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text className="text-xs text-foreground flex-1">
              Se generará automáticamente el fixture con todos los partidos organizados por jornadas.
            </Text>
          </View>
        </View>

        {/* Spacer */}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row gap-3 px-4 pb-6 border-t border-border pt-4">
        {onBack && (
          <Pressable
            onPress={onBack}
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
            <Text className="text-center font-semibold text-foreground">Atrás</Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleConfirm}
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
              <Ionicons name="checkmark-done" size={18} color={colors.background} />
              <Text className="font-semibold text-background">Crear torneo</Text>
            </View>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

export default CreateTournamentStep4;
