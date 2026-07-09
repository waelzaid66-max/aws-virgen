import { Feather } from "@/components/icons";
import { AppTextInput as TextInput } from "@/components/AppTextInput";
import {
  getGetListingQueryKey,
  getListing,
  useUpdateListing,
} from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { LocationPicker } from "@/components/LocationPicker";
import { useI18n } from "@/context/LanguageContext";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

function digitsToNumber(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function EditListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { t, isRTL } = useI18n();
  const { bumpListings } = useSession();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const rowDir = isRTL ? "row-reverse" : "row";

  const listingQ = useQuery({
    queryKey: getGetListingQueryKey(id ?? ""),
    queryFn: () => getListing(id ?? ""),
    enabled: !!id,
  });

  const listing = listingQ.data?.data;
  const specs = (listing?.specs ?? {}) as Record<string, unknown>;
  const isFurnishedDaily = specs.rental_term === "furnished_daily";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationValue, setLocationValue] = useState<string | null>(null);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!listing || hydrated) return;
    setTitle(listing.title ?? "");
    setDescription(listing.description ?? "");
    setLocation(listing.location ?? "");
    setLocationValue(listing.location ?? null);
    if (typeof listing.price_cash === "number") {
      setPrice(String(Math.round(listing.price_cash)));
    }
    setHydrated(true);
  }, [listing, hydrated]);

  const { mutate, isPending } = useUpdateListing({
    mutation: {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        bumpListings();
        Alert.alert(t("editListing.savedTitle"), t("editListing.savedBody"), [
          { text: t("common.done"), onPress: () => router.back() },
        ]);
      },
      onError: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(t("common.error"), t("editListing.error"));
      },
    },
  });

  const onSave = () => {
    if (!id || !title.trim()) return;
    const base_price_cash = digitsToNumber(price);
    if (base_price_cash <= 0) {
      Alert.alert(t("common.error"), t("editListing.priceRequired"));
      return;
    }
    mutate({
      id,
      data: {
        title: title.trim(),
        description: description.trim() || undefined,
        location: locationValue ?? location.trim(),
        base_price_cash,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
            flexDirection: rowDir,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <Feather name="x" size={22} color={colors.foreground} />
        </Pressable>
        <AppText style={[styles.headerTitle, { color: colors.foreground }]}>
          {t("editListing.title")}
        </AppText>
        <Pressable
          onPress={onSave}
          disabled={isPending || listingQ.isLoading}
          style={styles.iconBtn}
          hitSlop={12}
          testID="edit-listing-save"
        >
          {isPending ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <AppText style={{ color: colors.primary, fontWeight: "700" }}>
              {t("editListing.save")}
            </AppText>
          )}
        </Pressable>
      </View>

      {listingQ.isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : listingQ.isError || !listing ? (
        <View style={styles.centered}>
          <AppText style={{ color: colors.mutedForeground }}>
            {t("listing.notAvailable")}
          </AppText>
        </View>
      ) : (
        <KeyboardAwareScrollViewCompat
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 16 }}
        >
          {isFurnishedDaily ? (
            <View style={[styles.badge, { backgroundColor: colors.primary + "14" }]}>
              <Feather name="calendar" size={14} color={colors.primary} />
              <AppText style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
                {t("rentals.hub.unitBadge")}
              </AppText>
            </View>
          ) : null}

          <AppText style={[styles.locked, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]}>
            {t("editListing.lockedType")}
          </AppText>

          <Field label={t("create.titleField")} colors={colors} isRTL={isRTL}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, textAlign: isRTL ? "right" : "left" }]}
              placeholder={t("create.titlePlaceholder")}
              placeholderTextColor={colors.mutedForeground}
            />
          </Field>

          <Field label={t("create.descriptionField")} colors={colors} isRTL={isRTL}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              style={[
                styles.input,
                styles.textArea,
                { color: colors.foreground, borderColor: colors.border, textAlign: isRTL ? "right" : "left" },
              ]}
              placeholder={t("create.descriptionPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
            />
          </Field>

          <Field label={t("create.locationField")} colors={colors} isRTL={isRTL}>
            <Pressable
              onPress={() => setLocationPickerOpen(true)}
              style={[styles.input, styles.pressField, { borderColor: colors.border, flexDirection: rowDir }]}
            >
              <AppText style={{ color: location ? colors.foreground : colors.mutedForeground, flex: 1, textAlign: isRTL ? "right" : "left" }}>
                {location || t("create.locationPlaceholder")}
              </AppText>
              <Feather name="map-pin" size={16} color={colors.mutedForeground} />
            </Pressable>
          </Field>

          <Field
            label={isFurnishedDaily ? t("editListing.priceNightHint") : t("editListing.priceHint")}
            colors={colors}
            isRTL={isRTL}
          >
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, textAlign: isRTL ? "right" : "left" }]}
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
            />
          </Field>
        </KeyboardAwareScrollViewCompat>
      )}

      <LocationPicker
        visible={locationPickerOpen}
        selectedValue={locationValue ?? undefined}
        onClose={() => setLocationPickerOpen(false)}
        onSelect={(_value, label) => {
          setLocation(label);
          setLocationValue(label);
          setLocationPickerOpen(false);
        }}
        onClear={() => {
          setLocation("");
          setLocationValue(null);
        }}
      />
    </View>
  );
}

function Field({
  label,
  children,
  colors,
  isRTL,
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
  isRTL: boolean;
}) {
  return (
    <View style={{ gap: 6 }}>
      <AppText style={{ color: colors.foreground, fontWeight: "600", textAlign: isRTL ? "right" : "left" }}>
        {label}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  iconBtn: { minWidth: 32, height: 32, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  locked: { fontSize: 12, lineHeight: 18 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 15,
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  pressField: { alignItems: "center" },
});
