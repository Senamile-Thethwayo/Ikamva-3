// Standalone profile screen — accessible via /profile from anywhere in the app.
// This avoids the /(tabs)/Profile casing issue that causes "unmatched route".

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getData, logout } from "./utils/Storage";

const db = SQLite.openDatabaseSync("ikamvahub.db");
const TEAL = "#14B8A6";
const TEAL_LIGHT = "#E8FAF7";

type UserRow  = { id: number; name: string; email: string };
type ProfRow  = { id: number; user_id: number; profile_pic?: string | null };

export default function ProfileScreen() {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => { loadProfile(); }, []);
  useFocusEffect(useCallback(() => { loadProfile(); }, []));

  const loadProfile = async () => {
    try {
      const session = await getData("userLoggedIn");
      const userId  = session?.id ?? (global as any).currentUserId ?? null;

      let rows: UserRow[] = [];
      if (userId) {
        rows = await db.getAllAsync<UserRow>("SELECT * FROM users WHERE id = ?", [userId]);
      }
      if (rows.length === 0) {
        rows = await db.getAllAsync<UserRow>("SELECT * FROM users LIMIT 1");
      }

      if (rows.length > 0) {
        const u = rows[0];
        setName(u.name);
        setEmail(u.email);
        const prof = await db.getAllAsync<ProfRow>("SELECT * FROM profiles WHERE user_id = ?", [u.id]);
        if (prof.length > 0 && prof[0].profile_pic) setImage(prof[0].profile_pic);
      }
    } catch (e) {
      console.error("Profile load error:", e);
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out", style: "destructive",
        onPress: async () => { await logout(); router.replace("/login"); },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.headerBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
            <Ionicons name="arrow-back" size={22} color={TEAL} />
          </TouchableOpacity>
          <Text style={s.title}>Profile</Text>
          <TouchableOpacity style={s.headerBtn} onPress={() => router.push("/profile-details" as any)}>
            <Ionicons name="create-outline" size={22} color={TEAL} />
          </TouchableOpacity>
        </View>

        {/* Avatar + name */}
        <View style={s.avatarBox}>
          {image ? (
            <Image source={{ uri: image }} style={s.avatar} />
          ) : (
            <View style={s.avatarDefault}>
              <Ionicons name="person" size={48} color="#9CA3AF" />
            </View>
          )}
          <Text style={s.name}>{name  || "No Name"}</Text>
          <Text style={s.sub}>{email || "No Email"}</Text>
        </View>

        {/* Menu options */}
        <View style={s.card}>
          <Row icon="person-outline"        label="Personal Information"  onPress={() => router.push("/profile-details" as any)} />
          <Row icon="bookmark-outline"       label="Saved Items"           onPress={() => alert("Coming soon")} />
          <Row icon="settings-outline"       label="Settings"              onPress={() => router.push("/settings" as any)} />
          <Row icon="help-circle-outline"    label="Help & Support"        onPress={() => router.push("/help" as any)} />
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={s.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#374151" />
      <Text style={s.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: "#F7F8FA" },
  scroll: { padding: 20, paddingBottom: 48 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  headerBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: TEAL_LIGHT, alignItems: "center", justifyContent: "center" },
  title:  { fontSize: 22, fontWeight: "800", color: "#1F2937" },

  avatarBox:    { alignItems: "center", marginVertical: 24 },
  avatar:       { width: 96, height: 96, borderRadius: 48, marginBottom: 12, borderWidth: 3, borderColor: TEAL },
  avatarDefault:{ width: 96, height: 96, borderRadius: 48, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  name:  { fontSize: 20, fontWeight: "800", color: "#1F2937", marginBottom: 4 },
  sub:   { fontSize: 14, color: "#6B7280" },

  card:  { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 8, borderWidth: 1, borderColor: "#EBEBEB", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  row:   { flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 8, borderBottomWidth: 1, borderColor: "#F3F4F6" },
  rowLabel: { flex: 1, marginLeft: 14, fontSize: 15, fontWeight: "500", color: "#1F2937" },

  logoutBtn: { flexDirection: "row", alignItems: "center", marginTop: 24, padding: 16, backgroundColor: "#FEF2F2", borderRadius: 14, gap: 10, borderWidth: 1, borderColor: "#FECACA" },
  logoutText: { color: "#EF4444", fontWeight: "700", fontSize: 15 },
});
