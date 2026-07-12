import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface Step3Data {
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  rounds: number;
}

interface CreateTournamentStep3Props {
  format: "league" | "groups" | "playoffs" | "combined";
  onNext: (data: Step3Data) => void;
  onBack?: () => void;
  initialData?: Step3Data;
}

export function CreateTournamentStep3({
  format,
  onNext,
  onBack,
  initialData,
}: CreateTournamentStep3Props) {
  const colors = useColors();
  const [pointsWin, setPointsWin] = useState(initialData?.pointsWin || 3);
  const [pointsDraw, setPointsDraw] = useState(initialData?.pointsDraw || 1);
  const [pointsLoss, setPointsLoss] = useState(initialData?.pointsLoss || 0);
  const [rounds, setRounds] = useState(initialData?.rounds || 1);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      onNext({
        pointsWin,
        pointsDraw,
        pointsLoss,
        rounds,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  const NumberSelector = ({
    label,
    value,
    onChange,
    min = 0,
    max = 5,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
  }) => (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => {
            if (value > min) {
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
          className="flex-1 items-center justify-center py-3 rounded-lg"
          style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
        >
          <Text className="text-2xl font-bold text-foreground">{value}</Text>
        </View>

        <Pressable
          onPress={() => {
            if (value < max) {
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
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
              <Text className="text-background font-bold">3</Text>
            </View>
            <Text className="text-lg font-semibold text-foreground">Configuración</Text>
          </View>
          <Text className="text-sm text-muted">
            Define los puntos y número de vueltas
          </Text>
        </View>

        {/* Points Configuration */}
        <View className="gap-4 bg-surface rounded-lg p-4 border border-border">
          <Text className="text-sm font-semibold text-foreground">Sistema de puntuación</Text>
          <NumberSelector
            label="Puntos por victoria"
            value={pointsWin}
            onChange={setPointsWin}
            min={1}
            max={5}
          />
          <NumberSelector
            label="Puntos por empate"
            value={pointsDraw}
            onChange={setPointsDraw}
            min={0}
            max={2}
          />
          <NumberSelector
            label="Puntos por derrota"
            value={pointsLoss}
            onChange={setPointsLoss}
            min={0}
            max={1}
          />
        </View>

        {/* Rounds Configuration */}
        {(format === "league" || format === "groups") && (
          <View className="gap-4 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">Número de vueltas</Text>
            <Text className="text-xs text-muted">
              Cada vuelta significa que los equipos juegan nuevamente entre sí
            </Text>
            <NumberSelector
              label="Vueltas"
              value={rounds}
              onChange={setRounds}
              min={1}
              max={5}
            />
          </View>
        )}

        {/* Summary */}
        <View className="bg-surface rounded-lg p-4 border border-border gap-3">
          <Text className="text-sm font-semibold text-foreground">Resumen</Text>
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

        {/* Spacer */}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row gap-3 px-4 pb-6 border-t border-border pt-4">
        {onBack && (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              {
                flex: 1,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 12,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-center font-semibold text-foreground">Atrás</Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
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
            <Text className="text-center font-semibold text-background">Siguiente</Text>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

export default CreateTournamentStep3;
