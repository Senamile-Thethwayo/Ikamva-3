import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "./theme/ThemeContext";

const TEAL       = "#14B8A6";
const TEAL_DARK  = "#0A7A7C";
const TEAL_LIGHT = "#E6F7F7";
const WHITE      = "#FFFFFF";
const DARK       = "#1F2937";
const GREY       = "#6B7280";

function SettingRow({
  icon,
  label,
  description,
  right,
  labelColor,
}: {
  icon: any;
  label: string;
  description?: string;
  right: React.ReactNode;
  labelColor?: string;
}) {
  return (
    <View style={s.row}>
      <View style={s.rowIcon}>
        <Ionicons name={icon} size={20} color={TEAL} />
      </View>
      <View style={s.rowBody}>
        <Text style={[s.rowLabel, labelColor ? { color: labelColor } : null]}>{label}</Text>
        {description ? <Text style={s.rowDesc}>{description}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export default function Settings() {
  const { isDark, toggleDarkMode, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={WHITE} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Settings</Text>
        <TouchableOpacity style={s.headerBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={20} color={WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Preferences */}
        <Text style={[s.groupLabel, { color: isDark ? TEAL : TEAL_DARK }]}>Preferences</Text>
        <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="notifications-outline"
            label="Notifications"
            description="Receive reminders and updates"
            labelColor={colors.text}
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#D1D5DB", true: TEAL }}
                thumbColor={WHITE}
              />
            }
          />
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            description="Switch to a darker colour scheme"
            labelColor={colors.text}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ false: "#D1D5DB", true: TEAL }}
                thumbColor={WHITE}
              />
            }
          />
        </View>

        {/* Navigation */}
        <Text style={[s.groupLabel, { color: isDark ? TEAL : TEAL_DARK }]}>Quick Links</Text>
        <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity style={s.linkRow} onPress={() => router.push("/(tabs)/notifications" as any)}>
            <View style={s.rowIcon}>
              <Ionicons name="notifications-outline" size={20} color={TEAL} />
            </View>
            <Text style={s.linkLabel}>View Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={s.linkRow} onPress={() => router.push("/help" as any)}>
            <View style={s.rowIcon}>
              <Ionicons name="help-circle-outline" size={20} color={TEAL} />
            </View>
            <Text style={s.linkLabel}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={s.linkRow} onPress={() => router.push("/profile-details" as any)}>
            <View style={s.rowIcon}>
              <Ionicons name="person-outline" size={20} color={TEAL} />
            </View>
            <Text style={s.linkLabel}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* App info */}
        <Text style={[s.groupLabel, { color: isDark ? TEAL : TEAL_DARK }]}>About</Text>
        <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>App Version</Text>
            <Text style={s.infoValue}>1.0.0</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Region</Text>
            <Text style={s.infoValue}>Mount Frere, Eastern Cape</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: "#F7F8FA" },
  header: { backgroundColor: TEAL_DARK, paddingTop: 52, paddingBottom: 16, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: WHITE },
  scroll: { padding: 18 },

  groupLabel: { fontSize: 12, fontWeight: "800", color: TEAL_DARK, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 20, marginBottom: 8 },

  card: { backgroundColor: WHITE, borderRadius: 16, borderWidth: 1, borderColor: "#EBEBEB", overflow: "hidden", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", gap: 12 },
  rowIcon: { width: 36, height: 36, borderRadius: 9, backgroundColor: TEAL_LIGHT, alignItems: "center", justifyContent: "center" },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: "600", color: DARK },  rowDesc: { fontSize: 12, color: GREY, marginTop: 2 },

  linkRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", gap: 12 },
  linkLabel: { flex: 1, fontSize: 15, fontWeight: "500", color: DARK },

  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  infoLabel: { fontSize: 14, color: GREY },
  infoValue: { fontSize: 14, fontWeight: "600", color: DARK },
});
