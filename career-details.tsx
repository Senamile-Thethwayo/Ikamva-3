import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCareerById } from "./db/Database";
import SpeakButton from "./components/SpeakButton";

const TEAL       = "#14B8A6";
const TEAL_DARK  = "#0A7A7C";
const TEAL_LIGHT = "#E6F7F7";
const WHITE      = "#FFFFFF";
const DARK       = "#1F2937";
const GREY       = "#6B7280";

// ── Reusable info section card ────────────────────────────────
function InfoSection({ icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={s.sectionIconWrap}>
          <Ionicons name={icon} size={18} color={TEAL} />
        </View>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <View style={s.sectionBody}>{children}</View>
    </View>
  );
}

// ── Tag chips for subjects ────────────────────────────────────
function TagList({ text }: { text: string }) {
  if (!text) return <Text style={s.noData}>Not specified</Text>;
  const items = text.split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <View style={s.tagRow}>
      {items.map((item, i) => (
        <View key={i} style={s.tag}>
          <Text style={s.tagText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function CareerDetails() {
  const { id } = useLocalSearchParams();
  const router  = useRouter();
  const [career, setCareer]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCareerById(Number(id)).then((data) => {
      setCareer(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  if (!career) {
    return (
      <View style={s.centered}>
        <Ionicons name="briefcase-outline" size={60} color="#ccc" />
        <Text style={s.notFoundText}>Career not found</Text>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const accent = TEAL;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL_DARK} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <View style={[s.hero, { backgroundColor: TEAL_DARK }]}>
          <TouchableOpacity style={s.heroBack} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={s.heroHome} onPress={() => router.replace("/(tabs)/home" as any)}>
            <Ionicons name="home-outline" size={20} color={WHITE} />
          </TouchableOpacity>

          {/* Career icon */}
          <View style={s.heroIcon}>
            <Ionicons name="briefcase" size={36} color={TEAL} />
          </View>

          <Text style={s.heroName}>{career.name}</Text>

          {career.field ? (
            <View style={s.heroBadge}>
              <Text style={s.heroBadgeText}>{career.field}</Text>
            </View>
          ) : null}

          {career.aps_range ? (
            <View style={[s.heroBadge, { backgroundColor: "rgba(255,255,255,0.3)", marginTop: 6 }]}>
              <Ionicons name="stats-chart-outline" size={12} color={WHITE} />
              <Text style={s.heroBadgeText}>  APS: {career.aps_range}</Text>
            </View>
          ) : null}
        </View>

        {/* ── BODY ──────────────────────────────────────────── */}
        <View style={s.body}>

          {/* Description */}
          {career.description ? (
            <InfoSection icon="document-text-outline" title="About This Career">
              <Text style={s.bodyText}>{career.description}</Text>
            </InfoSection>
          ) : null}

          {/* Subjects */}
          {career.subjects_needed ? (
            <InfoSection icon="book-outline" title="Subjects Needed">
              <TagList text={career.subjects_needed} />
            </InfoSection>
          ) : null}

          {/* Study Path */}
          {career.study_path ? (
            <InfoSection icon="school-outline" title="Study Path">
              {career.study_path.split("→").map((step: string, i: number, arr: string[]) => (
                <View key={i} style={s.stepRow}>
                  <View style={[s.stepDot, { backgroundColor: TEAL }]} />
                  <Text style={s.stepText}>{step.trim()}</Text>
                  {i < arr.length - 1 ? <View style={s.stepLine} /> : null}
                </View>
              ))}
            </InfoSection>
          ) : null}

          {/* Institutions */}
          {career.institutions ? (
            <InfoSection icon="business-outline" title="Where to Study">
              {career.institutions.split(",").map((inst: string, i: number) => (
                <View key={i} style={s.instRow}>
                  <Ionicons name="location-outline" size={14} color={TEAL} />
                  <Text style={s.instText}>{inst.trim()}</Text>
                </View>
              ))}
            </InfoSection>
          ) : null}

          {/* APS Range */}
          {career.aps_range ? (
            <InfoSection icon="stats-chart-outline" title="APS Score Required">
              <View style={s.apsBox}>
                <Text style={[s.apsValue, { color: TEAL }]}>{career.aps_range}</Text>
                <Text style={s.apsLabel}>Typical APS range across institutions</Text>
              </View>
            </InfoSection>
          ) : null}

        </View>
      </ScrollView>

      <SpeakButton text={
        `${career.name}. ` +
        `Field: ${career.field || ""}. ` +
        `${career.description || ""}. ` +
        `Subjects needed: ${career.subjects_needed || "Not specified"}. ` +
        `Study path: ${(career.study_path || "").replace(/→/g, "then")}. ` +
        `Where to study: ${career.institutions || "Not specified"}. ` +
        `APS range: ${career.aps_range || "Varies by institution"}.`
      } />
    </View>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: "#F8FAFA" },
  centered:{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFA", padding: 30 },
  notFoundText: { fontSize: 16, color: DARK, marginTop: 12, marginBottom: 20 },
  backBtn: { backgroundColor: TEAL, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  backBtnText: { color: WHITE, fontWeight: "700", fontSize: 14 },

  // Hero
  hero: { paddingTop: 54, paddingBottom: 32, paddingHorizontal: 20, alignItems: "center" },
  heroBack: { position: "absolute", top: 50, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  heroHome: { position: "absolute", top: 50, right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  heroIcon: { width: 80, height: 80, borderRadius: 20, backgroundColor: WHITE, alignItems: "center", justifyContent: "center", marginBottom: 16, elevation: 4 },
  heroName: { fontSize: 24, fontWeight: "900", color: WHITE, textAlign: "center", marginBottom: 10, lineHeight: 32 },
  heroBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.22)", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  heroBadgeText: { color: WHITE, fontSize: 13, fontWeight: "700" },

  // Body
  body: { padding: 16, gap: 12 },

  // Section card
  section: { backgroundColor: WHITE, borderRadius: 14, borderWidth: 1, borderColor: "#EBEBEB", overflow: "hidden", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, marginBottom: 4 },
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: TEAL_LIGHT, borderBottomWidth: 1, borderBottomColor: "#CCF0EC", gap: 10 },
  sectionIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: WHITE, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: TEAL_DARK },
  sectionBody: { padding: 14 },
  bodyText: { fontSize: 14, color: DARK, lineHeight: 22 },
  noData: { fontSize: 13, color: "#9CA3AF", fontStyle: "italic" },

  // Tags
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: TEAL_LIGHT, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "#B2E8E5" },
  tagText: { fontSize: 12, fontWeight: "600", color: TEAL_DARK },

  // Study path steps
  stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10, gap: 10 },
  stepDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5, flexShrink: 0 },
  stepLine: { position: "absolute", left: 4, top: 14, width: 2, height: 20, backgroundColor: "#E5E7EB" },
  stepText: { flex: 1, fontSize: 13, color: DARK, lineHeight: 20 },

  // Institutions
  instRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  instText: { fontSize: 13, color: DARK, flex: 1 },

  // APS box
  apsBox: { alignItems: "center", paddingVertical: 8 },
  apsValue: { fontSize: 32, fontWeight: "900", marginBottom: 6 },
  apsLabel: { fontSize: 13, color: GREY, textAlign: "center" },
});
