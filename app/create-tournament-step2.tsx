import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
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

interface CreateTournamentStep2Props {
  onNext: (teams: Team[]) => void;
  onBack?: () => void;
  initialTeams?: Team[];
}

export function CreateTournamentStep2({
  onNext,
  onBack,
  initialTeams = [],
}: CreateTournamentStep2Props) {
  const colors = useColors();
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTeam = () => {
    if (!teamName.trim()) {
      alert("Por favor ingresa el nombre del equipo");
      return;
    }

    if (teams.some((t) => t.name.toLowerCase() === teamName.toLowerCase())) {
      alert("Este equipo ya existe");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTeams([...teams, { id: Date.now().toString(), name: teamName.trim() }]);
    setTeamName("");
  };

  const handleRemoveTeam = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTeams(teams.filter((t) => t.id !== id));
  };

  const handleNext = async () => {
    if (teams.length < 2) {
      alert("Necesitas al menos 2 equipos");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      onNext(teams);
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="px-4 pt-4 pb-4 border-b border-border">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
            <Text className="text-background font-bold">2</Text>
          </View>
          <Text className="text-lg font-semibold text-foreground">Participantes</Text>
        </View>
        <Text className="text-sm text-muted">
          Agrega los equipos que participarán en el torneo (mínimo 2)
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Team Input */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-foreground">Nombre del equipo</Text>
          <View className="flex-row gap-2">
            <TextInput
              placeholder="Ej: Manchester United"
              placeholderTextColor={colors.muted}
              value={teamName}
              onChangeText={setTeamName}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                fontSize: 14,
              }}
              maxLength={255}
            />
            <Pressable
              onPress={handleAddTeam}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
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

        {/* Teams List */}
        {teams.length > 0 && (
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Equipos ({teams.length})
            </Text>
            <FlatList
              data={teams}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item, index }) => (
                <View
                  className="flex-row items-center justify-between bg-surface rounded-lg p-3 border border-border"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row items-center flex-1 gap-3">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-background font-bold text-sm">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="text-foreground font-medium flex-1">{item.name}</Text>
                  </View>
                  <Pressable
                    onPress={() => handleRemoveTeam(item.id)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                  >
                    <Ionicons name="close-circle" size={20} color={colors.error} />
                  </Pressable>
                </View>
              )}
            />
          </View>
        )}

        {/* Empty State */}
        {teams.length === 0 && (
          <View className="items-center justify-center py-12 gap-2">
            <Ionicons name="people-outline" size={48} color={colors.muted} />
            <Text className="text-foreground font-semibold">Sin equipos aún</Text>
            <Text className="text-muted text-center text-sm">
              Agrega equipos para continuar
            </Text>
          </View>
        )}

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
          disabled={loading || teams.length < 2}
          style={({ pressed }) => [
            {
              flex: 1,
              backgroundColor: teams.length < 2 ? colors.muted : colors.primary,
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

export default CreateTournamentStep2;
