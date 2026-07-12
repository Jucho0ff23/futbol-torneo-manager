import { View, Text, FlatList, ScrollView, Pressable, Image } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface Team {
  id: number;
  name: string;
  shieldUrl?: string;
}

interface ParticipantsTabProps {
  teams: Team[];
  isAdmin: boolean;
  onEditTeam?: (team: Team) => void;
  onDeleteTeam?: (teamId: number) => void;
}

export function ParticipantsTab({
  teams,
  isAdmin,
  onEditTeam,
  onDeleteTeam,
}: ParticipantsTabProps) {
  const colors = useColors();

  const handleEditTeam = (team: Team) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onEditTeam) {
      onEditTeam(team);
    }
  };

  const handleDeleteTeam = (teamId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onDeleteTeam) {
      onDeleteTeam(teamId);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Teams List */}
      {teams.length > 0 ? (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item, index }) => (
            <View
              className="flex-row items-center justify-between rounded-lg p-4 border border-border"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row items-center flex-1 gap-3">
                {/* Shield or Default Icon */}
                {item.shieldUrl ? (
                  <Image
                    source={{ uri: item.shieldUrl }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.primary,
                    }}
                  />
                ) : (
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Ionicons name="shield" size={20} color={colors.background} />
                  </View>
                )}

                {/* Team Info */}
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{item.name}</Text>
                  <Text className="text-xs text-muted mt-1">Equipo #{index + 1}</Text>
                </View>
              </View>

              {/* Actions */}
              {isAdmin && (
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => handleEditTeam(item)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                  >
                    <Ionicons name="pencil" size={18} color={colors.primary} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteTeam(item.id)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                  >
                    <Ionicons name="trash" size={18} color={colors.error} />
                  </Pressable>
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <View className="items-center justify-center py-12 gap-2">
          <Ionicons name="people-outline" size={48} color={colors.muted} />
          <Text className="text-foreground font-semibold">Sin equipos</Text>
          <Text className="text-muted text-center text-sm">
            No hay equipos registrados en este torneo
          </Text>
        </View>
      )}

      {/* Spacer */}
      <View className="h-8" />
    </ScrollView>
  );
}

export default ParticipantsTab;
