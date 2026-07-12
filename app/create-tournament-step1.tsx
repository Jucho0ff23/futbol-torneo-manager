import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface Step1Data {
  name: string;
  description: string;
  format: "league" | "groups" | "playoffs" | "combined";
}

interface CreateTournamentStep1Props {
  onNext: (data: Step1Data) => void;
  onBack?: () => void;
  initialData?: Step1Data;
}

export function CreateTournamentStep1({
  onNext,
  onBack,
  initialData,
}: CreateTournamentStep1Props) {
  const colors = useColors();
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [format, setFormat] = useState<Step1Data["format"]>(initialData?.format || "league");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!name.trim()) {
      alert("Por favor ingresa el nombre del torneo");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      onNext({
        name: name.trim(),
        description: description.trim(),
        format,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  const formatOptions: Array<{
    value: Step1Data["format"];
    label: string;
    description: string;
  }> = [
    {
      value: "league",
      label: "Liga",
      description: "Todos contra todos (1-5 vueltas)",
    },
    {
      value: "groups",
      label: "Grupos",
      description: "Grupos cerrados + Playoffs",
    },
    {
      value: "playoffs",
      label: "Eliminatorias",
      description: "Mata-mata o Ida y Vuelta",
    },
    {
      value: "combined",
      label: "Combinado",
      description: "Múltiples fases",
    },
  ];

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
              <Text className="text-background font-bold">1</Text>
            </View>
            <Text className="text-lg font-semibold text-foreground">Información</Text>
          </View>
          <Text className="text-sm text-muted">
            Completa los datos básicos de tu torneo
          </Text>
        </View>

        {/* Nombre */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-foreground">Nombre del torneo *</Text>
          <TextInput
            placeholder="Ej: Copa América 2024"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: colors.foreground,
              fontSize: 16,
            }}
            maxLength={255}
          />
        </View>

        {/* Descripción */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-foreground">Descripción (opcional)</Text>
          <TextInput
            placeholder="Ej: Torneo amistoso entre amigos"
            placeholderTextColor={colors.muted}
            value={description}
            onChangeText={setDescription}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: colors.foreground,
              fontSize: 16,
              minHeight: 80,
              textAlignVertical: "top",
            }}
            multiline
            maxLength={500}
          />
          <Text className="text-xs text-muted text-right">{description.length}/500</Text>
        </View>

        {/* Formato */}
        <View className="gap-3">
          <Text className="text-sm font-semibold text-foreground">Formato del torneo *</Text>
          {formatOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFormat(option.value);
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: format === option.value ? colors.primary : colors.surface,
                  borderColor: format === option.value ? colors.primary : colors.border,
                  borderWidth: 2,
                  borderRadius: 8,
                  padding: 12,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text
                    className={`font-semibold ${
                      format === option.value ? "text-background" : "text-foreground"
                    }`}
                  >
                    {option.label}
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${
                      format === option.value ? "text-background opacity-80" : "text-muted"
                    }`}
                  >
                    {option.description}
                  </Text>
                </View>
                {format === option.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.background}
                  />
                )}
              </View>
            </Pressable>
          ))}
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

export default CreateTournamentStep1;
