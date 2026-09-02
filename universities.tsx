import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { universityLogos } from "../assets/university-logos/logoMap";
import { getUniversities } from "./db/ReferenceDatabase";
import SpeakButton from "./components/SpeakButton";

const TEAL      = "#14B8A6";
const TEAL_DARK = "#0A7A7C";
const WHITE     = "#FFFFFF";
const DARK      = "#1F2937";
const GREY      = "#6B7280";

interface University {
  id: number;
  name: string;
  province: string;
  city: string;
  website: string;
  contact: string;
  minimum_aps: number;
  image_url?: string;
}

type ProvinceSection = { province: string; data: University[] };

// ── Logo inside card — uses local asset first, then URL, then initials ──
function UniLogo({ id, imageUrl, name }: { id: number; imageUrl?: string; name: string }) {
  const [urlFailed, setUrlFailed] = useState(false);

  // Generate short abbreviation for fallback
  const words = name.split(" ").filter((w) => !["of", "the", "and", "&"].includes(w.toLowerCase()));
  const abbr = words.map((w) => w[0]).slice(0, 3).join("").toUpperCase();

  // 1. Try local asset from logoMap first (most reliable)
  const localAsset = universityLogos[id] ?? null;
  if (localAsset) {
    return (
      <Image
        source={localAsset}
        style={styles.logoImg}
        resizeMode="contain"
      />
    );
  }

  // 2. Try remote image_url
  if (imageUrl && imageUrl.length > 0 && !urlFailed) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.logoImg}
        resizeMode="contain"
        onError={() => setUrlFailed(true)}
      />
    );
  }

  // 3. Fallback — initials badge
  return (
    <View style={styles.logoFallback}>
      <Text style={styles.logoInitial}>{abbr}</Text>
    </View>
  );
}

export default function Universities() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [filtered, setFiltered]         = useState<University[]>([]);
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [activeTab, setActiveTab]       = useState<"all" | "province">("all");

  useEffect(() => { loadUniversities(); }, []);

  const loadUniversities = async () => {
    try {
      setError(null);
      const data = (await getUniversities()) as University[];
      setUniversities(data);
      setFiltered(data);
    } catch {
      setError("Failed to load universities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    setFiltered(
      text.trim() === ""
        ? universities
        : universities.filter(
            (u) =>
              u.name.toLowerCase().includes(text.toLowerCase()) ||
              u.city?.toLowerCase().includes(text.toLowerCase()) ||
              u.province?.toLowerCase().includes(text.toLowerCase())
          )
    );
  };

  const groupByProvince = (data: University[]): ProvinceSection[] => {
    const map = new Map<string, University[]>();
    for (const uni of data) {
      const key = uni.province || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(uni);
    }
    return Array.from(map.entries())
      .map(([province, list]) => ({ province, data: list }))
      .sort((a, b) => a.province.localeCompare(b.province));
  };

  const navigateToDetails = (item: University) =>
    router.push({
      pathname: "/university-details",
      params: { id: item.id.toString(), name: item.name },
    } as any);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadUniversities}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sections = groupByProvince(filtered);

  // ── Render a single university card ──────────────────────────
  const renderCard = (item: University) => (
    <TouchableOpacity
      key={item.id.toString()}
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigateToDetails(item)}
    >
      {/* Logo — uses local asset, falls back to URL, then initials */}
      <View style={styles.logoArea}>
        <UniLogo id={item.id} imageUrl={item.image_url} name={item.name} />
      </View>

      {/* Thin divider between logo and text */}
      <View style={styles.cardDivider} />

      {/* Name + location */}
      <Text style={styles.uniName} numberOfLines={2}>{item.name}</Text>
      <View style={styles.locRow}>
        <Ionicons name="location-outline" size={11} color={GREY} />
        <Text style={styles.locText} numberOfLines={1}>
          {item.city ? `${item.city}` : item.province}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Header ─────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="arrow-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* ── Search ─────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={17} color="#aaa" />
        <TextInput
          placeholder="Search institutions..."
          placeholderTextColor="#bbb"
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={17} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Tab pills ──────────────────────────────────────── */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === "all" && styles.tabPillActive]}
          onPress={() => setActiveTab("all")}
        >
          <Text style={[styles.tabText, activeTab === "all" && styles.tabTextActive]}>
            Universities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === "province" && styles.tabPillActive]}
          onPress={() => setActiveTab("province")}
        >
          <Text style={[styles.tabText, activeTab === "province" && styles.tabTextActive]}>
            By Province
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {activeTab === "all" ? (
          /* ── All universities flat grid ─────────────────── */
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Public Universities</Text>
              <View style={styles.countBubble}>
                <Text style={styles.countBubbleText}>{filtered.length}</Text>
              </View>
            </View>

            {filtered.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="business-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No universities match your search</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {filtered.map((item) => renderCard(item))}
              </View>
            )}
          </View>
        ) : (
          /* ── By Province grouped ────────────────────────── */
          sections.map((section) => (
            <View key={section.province}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.province}</Text>
                <View style={styles.countBubble}>
                  <Text style={styles.countBubbleText}>{section.data.length}</Text>
                </View>
              </View>
              <View style={styles.grid}>
                {section.data.map((item) => renderCard(item))}
              </View>
            </View>
          ))
        )}

        {/* Home button */}
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={17} color={TEAL} />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>

      </ScrollView>

      <SpeakButton text={
        `Universities. Browse ${universities.length} South African public universities. ` +
        `Use the search bar to find a university by name, city or province. ` +
        `Tap any university card to view programmes, application dates and contact details.`
      } />
    </View>
  );
}

const CARD_W = "31%"; // kept for reference

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: WHITE },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: WHITE, padding: 30 },
  errorText: { color: "#DC2626", fontSize: 15, marginBottom: 16, textAlign: "center" },
  retryBtn:  { backgroundColor: TEAL, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: WHITE, fontWeight: "700", fontSize: 14 },

  // Header
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "900", color: DARK },

  // Search
  searchWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F3F4F6", borderRadius: 12,
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    paddingHorizontal: 12, paddingVertical: 10, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: DARK, paddingVertical: 0 },

  // Tabs
  tabRow: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  tabPill: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB",
  },
  tabPillActive: { backgroundColor: TEAL, borderColor: TEAL },
  tabText:       { fontSize: 13, fontWeight: "700", color: GREY },
  tabTextActive: { color: WHITE },

  // Section heading
  sectionHeader: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, marginTop: 8, marginBottom: 14,
  },
  sectionTitle:  { fontSize: 20, fontWeight: "900", color: DARK },
  countBubble:   { backgroundColor: "#F3F4F6", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  countBubbleText: { fontSize: 13, fontWeight: "700", color: GREY },

  // Grid
  grid: {
    flexDirection: "row", flexWrap: "wrap",
    paddingHorizontal: 10, gap: 10,
  },

  // ── Card — logo fills top of card, text below ────────────
  card: {
    width: "31%",
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  // Logo area — takes up ~60% of card height, white bg, logo centred
  logoArea: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },
  logoImg: { width: "100%", height: "100%" },
  logoFallback: {
    width: "100%", height: "100%",
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F3F4F6", borderRadius: 8,
  },
  logoInitial: { fontSize: 26, fontWeight: "900", color: TEAL },

  // Separator line between logo and text
  cardDivider: { height: 1, backgroundColor: "#F0F0F0" },

  // Card text section
  uniName: {
    fontSize: 12, fontWeight: "700", color: DARK,
    paddingHorizontal: 8, paddingTop: 8, lineHeight: 16,
  },
  locRow:  {
    flexDirection: "row", alignItems: "center", gap: 3,
    paddingHorizontal: 8, paddingBottom: 10, paddingTop: 4,
  },
  locText: { fontSize: 10, color: GREY, flex: 1 },

  // Empty
  emptyBox:  { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },

  // Home button
  homeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: TEAL, borderRadius: 14,
    paddingVertical: 14, gap: 8, marginHorizontal: 16, marginTop: 24,
  },
  homeBtnText: { color: TEAL, fontSize: 15, fontWeight: "700" },
});
