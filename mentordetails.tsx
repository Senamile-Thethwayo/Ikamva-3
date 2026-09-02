import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMentorById } from "./db/ReferenceDatabase";
import SpeakButton from "./components/SpeakButton";

// ── Single brand colour used everywhere ──────────────────────
const TEAL       = "#14B8A6";
const TEAL_DARK  = "#0A7A7C";
const TEAL_LIGHT = "#E6F7F7";
const WHITE      = "#FFFFFF";
const DARK       = "#1F2937";
const GREY       = "#6B7280";

// ── Mentor photos keyed by exact mentor name ─────────────────
const MENTOR_PHOTOS: Record<string, any> = {
  "Ms Nomzi Phosa":           require("../assets/images/nomzi.jpg"),
  "Silothabo Chimboza":       require("../assets/images/silothabo.jpg"),
  "Ms Kealeboga Moothai":     require("../assets/images/kealeboga.jpg"),
  "Ms Rethabile Mosatupa":    require("../assets/images/rethabile.jpg"),
  "Ms Nadia Mavika":          require("../assets/images/nadia.jpg"),
  "Mr Lesiba Pitseng":        require("../assets/images/lesiba.jpg"),
  "Mr Celukwanda Mtshali":    require("../assets/images/celukwanda.jpg"),
  "Ms Morabusioluwa Abolarin":require("../assets/images/morabusioluwa.jpg"),
  "Ms Georgia Ruthven":       require("../assets/images/georgia.jpg"),
  "Mandla Chauke Curtis":     require("../assets/images/mandla.jpg"),
  "Bonolo Khuzwayo":          null,
  "Kgaugelo Makgakga":        require("../assets/images/kgaugelo.jpg"),
  "Simphiwe Nkosi":           require("../assets/images/simphiwe.jpg"),
  "Sbusiso Skhosana":         require("../assets/images/sbusiso.jpg"),
};

function MentorAvatar({ name, size = 88 }: { name: string; size?: number }) {
  const photo = MENTOR_PHOTOS[name] ?? null;
  const [imgFailed, setImgFailed] = useState(false);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photo && !imgFailed) {
    return (
      <Image
        source={photo}
        style={[styles.avatarImg, { width: size, height: size, borderRadius: size / 2 }]}
        resizeMode="cover"
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarInitials, { fontSize: size * 0.32 }]}>{initials}</Text>
    </View>
  );
}

export default function MentorDetails() {
  const { id } = useLocalSearchParams();
  const router  = useRouter();
  const [mentor, setMentor]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMentorById(Number(id)).then((d) => { setMentor(d); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  if (!mentor) {
    return (
      <View style={styles.centered}>
        <Ionicons name="person-outline" size={60} color="#ccc" />
        <Text style={styles.notFoundText}>Mentor not found</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL_DARK} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Hero ─────────────────────────────────────────── */}
        <View style={styles.hero}>
          {/* Back button */}
          <TouchableOpacity style={styles.heroBack} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={WHITE} />
          </TouchableOpacity>

          {/* Home button */}
          <TouchableOpacity style={styles.heroHome} onPress={() => router.replace("/(tabs)/home" as any)}>
            <Ionicons name="home-outline" size={20} color={WHITE} />
          </TouchableOpacity>

          <MentorAvatar name={mentor.name} size={92} />

          <Text style={styles.heroName}>{mentor.name}</Text>

          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <MaterialIcons name="work-outline" size={13} color={WHITE} />
              <Text style={styles.heroBadgeText}>{mentor.field}</Text>
            </View>
            {mentor.faculty ? (
              <View style={styles.heroBadge}>
                <Ionicons name="school-outline" size={13} color={WHITE} />
                <Text style={styles.heroBadgeText}>{mentor.faculty}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.body}>

          {/* ── Availability ─────────────────────────────────── */}
          {mentor.availability ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <View style={styles.availBadge}>
                <Ionicons name="calendar-outline" size={16} color={TEAL} />
                <Text style={styles.availText}>{mentor.availability}</Text>
              </View>
            </View>
          ) : null}

          {/* ── Contact ──────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>

            {mentor.phone ? (
              <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${mentor.phone}`)}>
                <View style={styles.contactIcon}>
                  <Ionicons name="call-outline" size={20} color={TEAL} />
                </View>
                <View style={styles.contactBody}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>{mentor.phone}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ) : null}

            {mentor.email ? (
              <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`mailto:${mentor.email}`)}>
                <View style={styles.contactIcon}>
                  <Ionicons name="mail-outline" size={20} color={TEAL} />
                </View>
                <View style={styles.contactBody}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{mentor.email}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* ── Reach Out CTA ────────────────────────────────── */}
          {mentor.email ? (
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() =>
                Linking.openURL(
                  `mailto:${mentor.email}?subject=Mentorship%20Request%20via%20IKAMVA%20HUB&body=Hi%20${encodeURIComponent(mentor.name)}%2C%0A%0AI%20found%20your%20profile%20on%20IKAMVA%20HUB%20and%20would%20love%20to%20connect%20regarding%20mentorship.%0A%0AKind%20regards`
                )
              }
            >
              <Ionicons name="paper-plane-outline" size={20} color={WHITE} />
              <Text style={styles.ctaBtnText}>Reach Out to Mentor</Text>
            </TouchableOpacity>
          ) : null}

          {/* ── Go Home ──────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => router.replace("/(tabs)/home" as any)}
          >
            <Ionicons name="home-outline" size={18} color={TEAL} />
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <SpeakButton text={
        `${mentor?.name || "Mentor"}. ` +
        `Field: ${mentor?.field || ""}. ` +
        `${mentor?.faculty ? `Faculty: ${mentor.faculty}.` : ""} ` +
        `${mentor?.bio || ""} ` +
        `Availability: ${mentor?.availability || "Not specified"}. ` +
        `Email: ${mentor?.email || "Not provided"}.`
      } />
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: "#F8FAFA" },
  centered:   { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFA", padding: 30 },
  notFoundText: { fontSize: 16, color: DARK, marginTop: 12, marginBottom: 20 },
  btn:        { backgroundColor: TEAL, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  btnText:    { color: WHITE, fontWeight: "700", fontSize: 14 },

  // Hero
  hero: {
    backgroundColor: TEAL,
    paddingTop: 54, paddingBottom: 32, paddingHorizontal: 20,
    alignItems: "center",
  },
  heroBack: {
    position: "absolute", top: 50, left: 16,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  heroHome: {
    position: "absolute", top: 50, right: 16,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },

  // Avatar
  avatarImg: { borderWidth: 3, borderColor: WHITE, marginBottom: 14 },
  avatarFallback: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 3, borderColor: WHITE,
    alignItems: "center", justifyContent: "center", marginBottom: 14,
  },
  avatarInitials: { fontWeight: "900", color: WHITE },

  heroName:     { fontSize: 22, fontWeight: "900", color: WHITE, textAlign: "center", marginBottom: 12 },
  heroBadgeRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  heroBadge:    { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.22)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, gap: 5 },
  heroBadgeText: { color: WHITE, fontSize: 12, fontWeight: "600" },

  body: { padding: 16, gap: 12 },

  // Section card
  section: {
    backgroundColor: WHITE, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#EBEBEB",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: DARK, marginBottom: 10 },

  // Availability
  availBadge: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: TEAL_LIGHT, borderWidth: 1.5, borderColor: TEAL,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10, alignSelf: "flex-start",
  },
  availText: { fontSize: 14, fontWeight: "700", color: TEAL },

  // Contact
  contactRow:   { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  contactIcon:  { width: 40, height: 40, borderRadius: 10, backgroundColor: TEAL_LIGHT, alignItems: "center", justifyContent: "center" },
  contactBody:  { flex: 1 },
  contactLabel: { fontSize: 11, color: GREY, fontWeight: "500" },
  contactValue: { fontSize: 14, fontWeight: "700", color: TEAL },

  // CTA
  ctaBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: TEAL, paddingVertical: 16, borderRadius: 14, gap: 10,
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
  },
  ctaBtnText: { color: WHITE, fontSize: 16, fontWeight: "800" },

  // Home button
  homeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: TEAL, borderRadius: 14, paddingVertical: 14, gap: 8,
  },
  homeBtnText: { color: TEAL, fontSize: 15, fontWeight: "700" },
});
