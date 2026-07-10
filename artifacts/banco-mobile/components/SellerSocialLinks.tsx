import { Ionicons } from "@/components/icons";
import * as Haptics from "expo-haptics";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/AppText";
import { useI18n } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { socialIconName, socialOpenUrl } from "@/lib/socialLinks";
import type { SocialLink } from "@workspace/api-client-react";

export function SellerSocialLinks({ links }: { links: SocialLink[] }) {
  const colors = useColors();
  const { t, isRTL } = useI18n();
  const visible = links.filter((l) => l.value?.trim());
  if (visible.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <AppText
        style={[
          styles.label,
          { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" },
        ]}
      >
        {t("listing.sellerSocial")}
      </AppText>
      <View
        style={[
          styles.row,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        {visible.map((link) => {
          const href = socialOpenUrl(link);
          return (
            <Pressable
              key={link.platform}
              disabled={!href}
              onPress={() => {
                if (!href) return;
                Haptics.selectionAsync();
                void Linking.openURL(href).catch(() => {});
              }}
              style={[
                styles.chip,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  borderRadius: colors.radius,
                },
              ]}
              testID={`listing-seller-social-${link.platform}`}
            >
              <Ionicons
                name={socialIconName(link.platform)}
                size={20}
                color={colors.foreground}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, marginTop: 10 },
  label: { fontSize: 12, fontFamily: "Inter_500Medium" },
  row: { flexWrap: "wrap", gap: 8 },
  chip: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
