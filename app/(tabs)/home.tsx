import { ScrollView, View, Text, Pressable, FlatList, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useTournament } from "@/lib/tournament-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const router = useRouter();
  const { setCurrentTournament } = useTournament();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tournaments for user
  useEffect(() => {
    if (user?.id) {
      fetchTournaments();
    }
  }, [user?.id]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      // TODO: Call API to fetch tournaments
      // const result = await trpc.tournaments.getByUser.query(user.id);
      // setTournaments(result);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to create tournament screen
  };

  const handleTournamentPress = (tournament: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentTournament(tournament);
    // TODO: Navigate to tournament detail screen
  };

  if (!user) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-foreground text-lg">Por favor inicia sesión</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="pb-6 border-b border-border">
        <Text className="text-3xl font-bold text-foreground">Mis Torneos</Text>
        <Text className="text-muted mt-1">Bienvenido, {user.name}</Text>
      </View>

      {/* Loading State */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* Empty State */}
      {!loading && tournaments.length === 0 && (
        <View className="flex-1 items-center justify-center gap-4">
          <Ionicons name="trophy-outline" size={64} color={colors.muted} />
          <Text className="text-foreground text-lg font-semibold">Sin torneos</Text>
          <Text className="text-muted text-center px-4">
            Crea tu primer torneo para comenzar a gestionar partidos y resultados
          </Text>
        </View>
      )}

      {/* Tournaments List */}
      {!loading && tournaments.length > 0 && (
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleTournamentPress(item)}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  marginHorizontal: 16,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">{item.name}</Text>
                  <Text className="text-sm text-muted mt-1">
                    {item.format === "league"
                      ? "Liga"
                      : item.format === "groups"
                        ? "Grupos"
                        : item.format === "playoffs"
                          ? "Eliminatorias"
                          : "Combinado"}
                  </Text>
                  <View className="flex-row gap-4 mt-2">
                    <Text className="text-xs text-muted">
                      {item.teamCount || 0} equipos
                    </Text>
                    <Text
                      className={`text-xs font-semibold ${
                        item.status === "active"
                          ? "text-success"
                          : item.status === "finished"
                            ? "text-muted"
                            : "text-warning"
                      }`}
                    >
                      {item.status === "active"
                        ? "En progreso"
                        : item.status === "finished"
                          ? "Finalizado"
                          : "Borrador"}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.muted} />
              </View>
            </Pressable>
          )}
        />
      )}

      {/* Create Tournament Button */}
      <Pressable
        onPress={handleCreateTournament}
        style={({ pressed }) => [
          {
            position: "absolute",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Ionicons name="add" size={28} color={colors.background} />
      </Pressable>
    </ScreenContainer>
  );
}
