import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Share } from "react-native";
import * as Haptics from "expo-haptics";
import { generateWhatsAppMessage, generateEmailMessage } from "@/lib/auth-utils";

interface ShareTournamentProps {
  tournament: {
    id: number;
    name: string;
    spectatorCode?: string;
  };
  onClose: () => void;
}

export function ShareTournament({ tournament, onClose }: ShareTournamentProps) {
  const colors = useColors();
  const [loading, setLoading] = useState(false);

  const shareLink = `https://torneomanager.app/tournament/${tournament.spectatorCode}`;
  const whatsappMessage = generateWhatsAppMessage(tournament.name, shareLink);
  const emailMessage = generateEmailMessage(tournament.name, shareLink);

  const handleShareWhatsApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      await Share.share({
        message: whatsappMessage,
        title: "Compartir en WhatsApp",
      });
    } catch (error) {
      console.error("Error sharing on WhatsApp:", error);
      alert("No se pudo compartir en WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  const handleShareEmail = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      await Share.share({
        message: emailMessage.body,
        title: "Compartir por correo",
      });
    } catch (error) {
      console.error("Error sharing by email:", error);
      alert("No se pudo compartir por correo");
    } finally {
      setLoading(false);
    }
  };

  const handleShareGeneral = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      await Share.share({
        message: shareLink,
        title: "Compartir torneo",
      });
    } catch (error) {
      console.error("Error sharing:", error);
      alert("No se pudo compartir");
    } finally {
      setLoading(false);
    }
  };

  const ShareOption = ({
    icon,
    title,
    description,
    onPress,
    color,
  }: {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    color: string;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        {
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginHorizontal: 16,
          marginBottom: 12,
          borderColor: colors.border,
          borderWidth: 1,
          opacity: pressed || loading ? 0.7 : 1,
        },
      ]}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-12 h-12 rounded-lg items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Ionicons name={icon as any} size={24} color={colors.background} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{title}</Text>
          <Text className="text-xs text-muted mt-1">{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 0, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4">
          <Text className="text-2xl font-bold text-foreground mb-2">Compartir torneo</Text>
          <Text className="text-sm text-muted">
            Invita a otros a seguir "{tournament.name}"
          </Text>
        </View>

        {/* Share Link */}
        <View className="px-4 bg-surface rounded-lg p-4 border border-border mx-4 gap-2">
          <Text className="text-xs text-muted font-semibold">LINK DE COMPARTIR</Text>
          <Text className="text-sm font-mono text-foreground break-words">{shareLink}</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Copy to clipboard
            }}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginTop: 8,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-center text-sm font-semibold text-background">
              Copiar link
            </Text>
          </Pressable>
        </View>

        {/* Share Options */}
        <View className="gap-2 mt-4">
          <View className="px-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Compartir en</Text>
          </View>

          <ShareOption
            icon="logo-whatsapp"
            title="WhatsApp"
            description="Envía el link por WhatsApp"
            onPress={handleShareWhatsApp}
            color="#25D366"
          />

          <ShareOption
            icon="mail"
            title="Correo electrónico"
            description="Comparte por correo"
            onPress={handleShareEmail}
            color={colors.primary}
          />

          <ShareOption
            icon="share-social"
            title="Más opciones"
            description="Comparte de otras formas"
            onPress={handleShareGeneral}
            color={colors.primary}
          />
        </View>

        {/* Info Box */}
        <View className="px-4 bg-primary bg-opacity-10 rounded-lg p-4 border border-primary border-opacity-30 mx-4 gap-2">
          <View className="flex-row items-start gap-2">
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text className="text-xs text-foreground flex-1">
              Los espectadores podrán ver el torneo en modo solo lectura. Recibirán actualizaciones en tiempo real de resultados y clasificación.
            </Text>
          </View>
        </View>

        {/* Spacer */}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-4 pb-6 border-t border-border pt-4">
        <Pressable
          onPress={onClose}
          disabled={loading}
          style={({ pressed }) => [
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 12,
              opacity: pressed || loading ? 0.7 : 1,
            },
          ]}
        >
          <Text className="text-center font-semibold text-foreground">Cerrar</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

export default ShareTournament;
