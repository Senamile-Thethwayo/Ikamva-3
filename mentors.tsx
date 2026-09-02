import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getMentors } from "./db/ReferenceDatabase";
import SpeakButton from "./components/SpeakButton";

// ── Mentor photo map ──────────────────────────────────────────
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

// ─── Types ────────────────────────────────────────────────────
type Mentor = {
  id: number;
  name: string;
  field: string;
  bio?: string;
  phone?: string;
  email?: string;
  profile_pic?: string;
  availability?: string;
};

// ─── Constants ────────────────────────────────────────────────
const TEAL = "#0F8B8D";
const TEAL_DARK = "#0A6C6D";
const TEAL_LIGHT = "#E6F7F7";

const FIELDS = [
  "All",
  "Engineering",
  "Medicine",
  "Law",
  "Education",
  "Business",
  "Information Technology",
  "Science",
];

// ─── Availability colour helper ───────────────────────────────
function availColor(avail: string): string {
  const a = avail.toLowerCase();
  if (a.includes("weekend")) return "#7C3AED";
  if (a.includes("weekday")) return "#0EA5E9";
  if (a.includes("evening")) return "#D97706";
  return TEAL;
}

// ─── Main Screen ─────────────────────────────────────────────
export default function Mentors() {
  const router = useRouter();

  const [allMentors, setAllMentors] = useState<Mentor[]>([]);
  const [filtered, setFiltered] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedField, setSelectedField] = useState("All");

  // Keep a ref to the latest allMentors so filterData never closes
  // over a stale empty array (the original bug).
  const allRef = useRef<Mentor[]>([]);

  useEffect(() => {
    (async () => {
      const data = (await getMentors()) as Mentor[];
      allRef.current = data;
      setAllMentors(data);
      setFiltered(data);
      setLoading(false);
    })();
  }, []);

  // ── Filter (always reads from ref so closure is never stale) ─
  const filterData = (text: string, field: string) => {
    let results = allRef.current;

    if (text.trim() !== "") {
      const q = text.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.field.toLowerCase().includes(q) ||
          (m.bio ?? "").toLowerCase().includes(q),
      );
    }

    if (field !== "All") {
      results = results.filter((m) => m.field === field);
    }

    setFiltered(results);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    filterData(text, selectedField);
  };

  const handleFieldSelect = (field: string) => {
    setSelectedField(field);
    filterData(search, field);
  };

  const handleClear = () => {
    setSearch("");
    filterData("", selectedField);
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL_DARK} />

      {/* ── Hero header ──────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="people-outline" size={13} color="#fff" />
          <Text style={styles.heroBadgeText}>Connect &amp; Grow</Text>
        </View>
        <Text style={styles.heroTitle}>Meet Our Mentors</Text>
        <Text style={styles.heroSub}>
          Connect with professionals who can guide your journey.
        </Text>

        {/* Search bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, field or keyword..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Field filter pills ────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
        style={styles.pillsWrap}
      >
        {FIELDS.map((field) => (
          <TouchableOpacity
            key={field}
            style={[styles.pill, selectedField === field && styles.pillActive]}
            onPress={() => handleFieldSelect(field)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.pillText,
                selectedField === field && styles.pillTextActive,
              ]}
            >
              {field}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Result count ─────────────────────────────────── */}
      <Text style={styles.resultCount}>
        {filtered.length} {filtered.length === 1 ? "mentor" : "mentors"}
        {selectedField !== "All" ? ` in ${selectedField}` : ""}
      </Text>

      {/* ── Mentor list ──────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <MentorCard mentor={item} router={router} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>No mentors found</Text>
            <Text style={styles.emptySub}>
              Try a different search term or field filter
            </Text>
            <TouchableOpacity
              style={styles.emptyReset}
              onPress={() => {
                setSearch("");
                setSelectedField("All");
                setFiltered(allRef.current);
              }}
            >
              <Text style={styles.emptyResetText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <SpeakButton text={
        "Mentors. Connect with professionals who can guide your future. " +
        "Browse mentors by field — Engineering, Medicine, Law, IT, Education, Business, Science, and more. " +
        "Tap any mentor card to view their profile and send them a message."
      } />
    </View>
  );
}

// ─── Mentor Card ──────────────────────────────────────────────
function MentorCard({
  mentor,
  router,
}: {
  mentor: Mentor;
  router: ReturnType<typeof useRouter>;
}) {
  const initials = mentor.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const aColor = mentor.availability
    ? availColor(mentor.availability)
    : TEAL;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/mentordetails?id=${mentor.id}` as any)}
      activeOpacity={0.85}
    >
      {/* Left — avatar */}
      <View style={styles.avatarWrap}>
        {(() => {
          const photo = MENTOR_PHOTOS[mentor.name] ?? null;
          if (photo) {
            return <Image source={photo} style={styles.avatar} resizeMode="cover" />;
          }
          return (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          );
        })()}
        {/* Online / availability dot */}
        <View style={[styles.dot, { backgroundColor: aColor }]} />
      </View>

      {/* Right — details */}
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{mentor.name}</Text>

        <View style={styles.fieldBadge}>
          <Text style={styles.fieldBadgeText}>{mentor.field}</Text>
        </View>

        {mentor.bio ? (
          <Text style={styles.cardBio} numberOfLines={2}>
            {mentor.bio}
          </Text>
        ) : null}

        {mentor.availability ? (
          <View style={styles.availRow}>
            <Ionicons name="time-outline" size={13} color={aColor} />
            <Text style={[styles.availText, { color: aColor }]}>
              {mentor.availability}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFA",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFA",
  },

  // ── Hero ──────────────────────────────────────────────────
  hero: {
    backgroundColor: TEAL,
    paddingTop: 44,
    paddingBottom: 26,
    paddingHorizontal: 20,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    marginBottom: 16,
    lineHeight: 19,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingVertical: 0,
  },

  // ── Filter pills ──────────────────────────────────────────
  pillsWrap: {
    maxHeight: 56,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  pillsRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pillActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  pillText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
  },
  pillTextActive: {
    color: "#fff",
  },

  // ── Result count ──────────────────────────────────────────
  resultCount: {
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 4,
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },

  // ── List ──────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 32,
  },

  // ── Card ──────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  avatarWrap: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: TEAL_LIGHT,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: TEAL,
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: "900",
    color: TEAL_DARK,
  },
  dot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 5,
  },
  fieldBadge: {
    alignSelf: "flex-start",
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  fieldBadgeText: {
    fontSize: 11,
    color: TEAL_DARK,
    fontWeight: "700",
  },
  cardBio: {
    fontSize: 12,
    color: "#666",
    lineHeight: 17,
    marginBottom: 6,
  },
  availRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  availText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // ── Empty state ───────────────────────────────────────────
  empty: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: "#888",
    marginTop: 6,
    textAlign: "center",
  },
  emptyReset: {
    marginTop: 20,
    backgroundColor: TEAL,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyResetText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
