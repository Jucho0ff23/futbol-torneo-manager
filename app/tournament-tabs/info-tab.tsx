import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Clipboard } from "react-native";
import * as Haptics from "expo-haptics";

interface InfoTabProps {
  tournament: any;
  isAdmin: boolean;
  onDeletePress?: () => void;
}

export function InfoTab({ tournament, isAdmin, onDeletePress }: InfoTabProps) {
  const colors = useColors();
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Clipboard.setString(tournament.adminPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyShareLink = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const link = `https://torneomanager.app/tournament/${tournament.spectatorCode}`;
    Clipboard.setString(link);
    alert("Link copiado al portapapeles");
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar torneo",
      "¿Estás seguro de que deseas eliminar este torneo? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            if (onDeletePress) {
              onDeletePress();
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const formatLabel = {
    league: "Liga",
    groups: "Grupos",
    playoffs: "Eliminatorias",
    combined: "Combinado",
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Tournament Info */}
      <View className="bg-surface rounded-lg p-4 border border-border gap-3">
        <Text className="text-sm font-semibold text-foreground mb-2">Información del torneo</Text>
        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">Nombre</Text>
          <Text className="text-sm font-semibold text-foreground">{tournament.name}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">Formato</Text>
          <Text className="text-sm font-semibold text-primary">
            {formatLabel[tournament.format as keyof typeof formatLabel]}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">Estado</Text>
          <Text
            className={`text-sm font-semibold ${
              tournament.status === "active"
                ? "text-success"
                : tournament.status === "finished"
                  ? "text-muted"
                  : "text-warning"
            }`}
          >
            {tournament.status === "active"
              ? "En progreso"
              : tournament.status === "finished"
                ? "Finalizado"
                : "Borrador"}
          </Text>
        </View>
        {tournament.description && (
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Descripción</Text>
            <Text className="text-sm text-foreground flex-1 text-right ml-2">
              {tournament.description}
            </Text>
          </View>
        )}
      </View>

      {/* Admin Password */}
      {isAdmin && (
        <View className="bg-surface rounded-lg p-4 border border-border gap-3">
          <Text className="text-sm font-semibold text-foreground mb-2">
            Contraseña de administrador
          </Text>
          <Text className="text-xs text-muted">
            Usa esta contraseña para realizar cambios en el torneo
          </Text>
          <View className="flex-row items-center gap-2 bg-background rounded-lg p-3 border border-border">
            <Text className="text-lg font-bold text-primary flex-1 font-mono">
              {tournament.adminPassword}
            </Text>
            <Pressable
              onPress={handleCopyPassword}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            >
              <Ionicons
                name={copied ? "checkmark" : "copy"}
                size={20}
                color={copied ? colors.success : colors.primary}
              />
            </Pressable>
          </View>
        </View>
      )}

      {/* Share Link */}
      <View className="bg-surface rounded-lg p-4 border border-border gap-3">
        <Text className="text-sm font-semibold text-foreground mb-2">Compartir torneo</Text>
        <Text className="text-xs text-muted">
          Comparte este link para que otros vean el torneo en modo solo lectura
        </Text>
        <Pressable
          onPress={handleCopyShareLink}
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="share-social" size={18} color={colors.background} />
          <Text className="font-semibold text-background">Copiar link</Text>
        </Pressable>
      </View>

      {/* Delete Tournament */}
      {isAdmin && (
        <View className="bg-surface rounded-lg p-4 border border-error border-opacity-30 gap-3">
          <Text className="text-sm font-semibold text-error mb-2">Zona de peligro</Text>
          <Text className="text-xs text-muted">
            Eliminar este torneo eliminará todos los datos asociados
          </Text>
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [
              {
                backgroundColor: colors.error,
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 12,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-center font-semibold text-background">Eliminar torneo</Text>
          </Pressable>
        </View>
      )}

      {/* Spacer */}
      <View className="h-8" />
    </ScrollView>
  );
}

export default InfoTab;
