import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getSchools, searchSchools } from "./db/ReferenceDatabase";
import SpeakButton from "./components/SpeakButton";

const TEAL       = "#0F8B8D";
const TEAL_DARK  = "#0A6C6D";
const TEAL_LIGHT = "#E6F7F7";
const WHITE      = "#FFFFFF";
const DARK       = "#1F2937";

type School = {
  id: number;
  name: string;
  province: string;
  type: string;
  location: string;
  contact: string;
  email: string;
  subjects_offered: string;
};

const TYPE_OPTIONS = ["All Types", "Public", "Private", "Combined"];
const AREA_OPTIONS = ["All Areas", "Mount Frere", "Tabankulu", "Bizana"];

// ─── Dropdown Component ──────────────────────────────────────
function Dropdown({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={dd.wrapper}>
      <TouchableOpacity style={dd.trigger} onPress={() => setOpen(!open)} activeOpacity={0.8}>
        <Text style={dd.triggerText} numberOfLines={1}>{selected}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={14} color="#555" />
      </TouchableOpacity>
      {open && (
        <View style={dd.list}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[dd.option, selected === opt && dd.optionActive]}
              onPress={() => { onSelect(opt); setOpen(false); }}
            >
              <Text style={[dd.optionText, selected === opt && dd.optionTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function HighSchools() {
  const router  = useRouter();
  const params  = useLocalSearchParams<{ q?: string }>();
  const listRef = useRef<FlatList>(null);

  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [displayed, setDisplayed]   = useState<School[]>([]);
  const [loading, setLoading]       = useState(true);
  const [searching, setSearching]   = useState(false);

  const [searchText, setSearchText] = useState(params.q ?? "");
  const [schoolType, setSchoolType] = useState("All Types");
  const [area, setArea]             = useState("All Areas");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Core filter ─────────────────────────────────────────────
  const applyFilters = useCallback(
    async (text: string, type: string, loc: string) => {
      setSearching(true);
      try {
        let results: School[] = text.trim()
          ? (await searchSchools(text.trim())) as School[]
          : (await getSchools()) as School[];

        if (type !== "All Types") {
          results = results.filter((s) => s.type === type);
        }
        if (loc !== "All Areas") {
          results = results.filter((s) =>
            s.location?.toLowerCase().includes(loc.toLowerCase())
          );
        }

        setDisplayed(results);

        // Scroll to top so results appear at the top
        setTimeout(() => {
          listRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 50);
      } finally {
        setSearching(false);
      }
    },
    []
  );

  // ── On mount ───────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const data = (await getSchools()) as School[];
      setAllSchools(data);
      if (params.q?.trim()) {
        await applyFilters(params.q, "All Types", "All Areas");
      } else {
        setDisplayed(data);
      }
      setLoading(false);
    })();
  }, []);

  // ── Re-run when dropdowns change ──────────────────────────
  useEffect(() => {
    if (!loading) applyFilters(searchText, schoolType, area);
  }, [schoolType, area]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      applyFilters(text, schoolType, area);
    }, 350);
  };

  const handleSearchPress = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    applyFilters(searchText, schoolType, area);
  };

  const handleClear = () => {
    setSearchText("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    applyFilters("", schoolType, area);
  };

  const handleReset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchText("");
    setSchoolType("All Types");
    setArea("All Areas");
    setDisplayed(allSchools);
    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 50);
  };

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL_DARK} />

      {/* ══ Everything scrolls together in one FlatList ═══ */}
      <FlatList
        ref={listRef}
        data={displayed}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* ── HERO ───────────────────────────────────── */}
            <View style={s.hero}>
              <TouchableOpacity style={s.heroBack} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color={WHITE} />
              </TouchableOpacity>
              <View style={s.heroBadge}>
                <MaterialIcons name="home-work" size={13} color="rgba(255,255,255,0.85)" />
                <Text style={s.heroBadgeText}>Mount Frere Education Area</Text>
              </View>
              <Text style={s.heroTitle}>Find the Right School{"\n"}
                <Text style={s.heroAccent}>in Mount Frere</Text>
              </Text>
              <Text style={s.heroSub}>
                Compare subjects, facilities, activities and contact details. All information available offline.
              </Text>
            </View>

            {/* ── SEARCH CARD ─────────────────────────────── */}
            <View style={s.searchCard}>
              <Text style={s.searchCardTitle}>Search for a School</Text>
              <View style={s.searchRow}>
                <Ionicons name="search-outline" size={18} color="#999" />
                <TextInput
                  style={s.searchInput}
                  placeholder="Search by school name..."
                  placeholderTextColor="#aaa"
                  value={searchText}
                  onChangeText={handleSearchChange}
                  returnKeyType="search"
                  onSubmitEditing={handleSearchPress}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={handleClear}>
                    <Ionicons name="close-circle" size={18} color="#aaa" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={s.filterRow}>
                <Dropdown options={TYPE_OPTIONS} selected={schoolType} onSelect={setSchoolType} />
                <Dropdown options={AREA_OPTIONS} selected={area} onSelect={setArea} />
              </View>
              <TouchableOpacity style={s.searchBtn} onPress={handleSearchPress} activeOpacity={0.85}>
                {searching ? (
                  <ActivityIndicator size="small" color={WHITE} />
                ) : (
                  <>
                    <Ionicons name="search" size={16} color={WHITE} />
                    <Text style={s.searchBtnText}>Search Schools</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* ── RESULTS COUNT ───────────────────────────── */}
            <View style={s.resultsRow}>
              <Text style={s.resultsText}>
                {displayed.length === allSchools.length
                  ? `All ${allSchools.length} schools`
                  : `${displayed.length} result${displayed.length !== 1 ? "s" : ""} found`}
              </Text>
              {(searchText || schoolType !== "All Types" || area !== "All Areas") && (
                <TouchableOpacity onPress={handleReset}>
                  <Text style={s.resetText}>Clear filters</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ── SCROLL HINT ─────────────────────────────── */}
            <View style={s.scrollHint}>
              <Ionicons name="arrow-down-circle-outline" size={15} color={TEAL_DARK} />
              <Text style={s.scrollHintText}>
                Scroll down to find the DBE admission form link at the bottom.
              </Text>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={s.dbeCard}>
            <View style={s.dbeTextRow}>
              <Ionicons name="information-circle-outline" size={18} color={TEAL_DARK} />
              <Text style={s.dbeMessage}>
                Apply for school admission in the Eastern Cape using the DBE online form.
              </Text>
            </View>
            <TouchableOpacity
              style={s.dbeBtn}
              onPress={() => Linking.openURL("http://ecdoeadmissions.forms.nkqubela.co.za/")}
              activeOpacity={0.85}
            >
              <Ionicons name="document-text-outline" size={16} color={WHITE} />
              <Text style={s.dbeBtnText}>Open DBE Admission Form</Text>
              <Ionicons name="open-outline" size={14} color={WHITE} />
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.card, { marginHorizontal: 14 }]}
            onPress={() => router.push(`/SchoolDetails?id=${item.id}` as any)}
            activeOpacity={0.85}
          >
            <View style={s.cardIcon}>
              <MaterialIcons name="school" size={24} color={TEAL} />
            </View>
            <View style={s.cardBody}>
              <Text style={s.cardName}>{item.name}</Text>
              <View style={s.cardMeta}>
                <Ionicons name="location-outline" size={13} color="#888" />
                <Text style={s.cardLocation}>{item.location || "Mount Frere"}</Text>
              </View>
              <View style={s.cardTags}>
                <View style={s.tag}><Text style={s.tagText}>{item.type}</Text></View>
                <View style={[s.tag, { backgroundColor: "#F3F4F6" }]}>
                  <Text style={[s.tagText, { color: "#555" }]}>Eastern Cape</Text>
                </View>
              </View>
            </View>
            <View style={s.viewBtn}>
              <Text style={s.viewBtnText}>View</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={s.emptyTitle}>No schools found</Text>
            <Text style={s.emptyDesc}>Try adjusting your search or filters</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={handleReset}>
              <Text style={s.emptyBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <SpeakButton text={
        "Schools. Find secondary schools in the Mount Frere Education Area. " +
        "Use the search bar to search by school name. " +
        "Filter by school type or area. " +
        "Tap any school to view subjects, sports, facilities and contact details."
      } />
    </View>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: "#F8FAFA" },
  centered:{ flex: 1, justifyContent: "center", alignItems: "center" },

  // Hero
  hero: { backgroundColor: TEAL_DARK, paddingTop: 52, paddingBottom: 28, paddingHorizontal: 20 },
  heroBack: { position: "absolute", top: 52, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  heroBadge: { flexDirection: "row", alignItems: "center", marginBottom: 10, marginLeft: 48, gap: 5 },
  heroBadgeText: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "500" },
  heroTitle: { fontSize: 26, fontWeight: "900", color: WHITE, lineHeight: 34, marginBottom: 10 },
  heroAccent: { color: "#B2EBF2" },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 19 },

  // Search card
  searchCard: { backgroundColor: WHITE, marginHorizontal: 14, marginTop: -16, borderRadius: 14, padding: 16, elevation: 6, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, zIndex: 5, marginBottom: 4 },
  searchCardTitle: { fontSize: 15, fontWeight: "700", color: DARK, marginBottom: 10 },
  searchRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12, backgroundColor: "#FAFAFA", gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: DARK, paddingVertical: 8 },

  // Filter row
  filterRow: { flexDirection: "row", marginBottom: 12, zIndex: 20, gap: 8 },

  // Unused pill styles kept to avoid any reference errors
  pillGroup: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB" },
  pillActive: { backgroundColor: TEAL_DARK, borderColor: TEAL_DARK },
  pillText: { fontSize: 12, fontWeight: "600", color: "#555" },
  pillTextActive: { color: WHITE },

  // Search button
  searchBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: TEAL_DARK, paddingVertical: 13, borderRadius: 10, gap: 8 },
  searchBtnText: { color: WHITE, fontWeight: "700", fontSize: 14 },

  // Results row
  resultsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10 },
  resultsText: { fontSize: 13, fontWeight: "600", color: "#555" },
  resetText: { fontSize: 13, fontWeight: "700", color: TEAL },

  // School card
  card: { flexDirection: "row", alignItems: "center", backgroundColor: WHITE, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#EBEBEB", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4 },
  cardIcon: { width: 46, height: 46, borderRadius: 10, backgroundColor: TEAL_LIGHT, alignItems: "center", justifyContent: "center", marginRight: 12 },
  cardBody: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: "700", color: DARK, marginBottom: 4 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 6 },
  cardLocation: { fontSize: 12, color: "#888" },
  cardTags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tag: { backgroundColor: TEAL_LIGHT, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 11, color: TEAL_DARK, fontWeight: "600" },
  viewBtn: { backgroundColor: TEAL, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  viewBtnText: { color: WHITE, fontSize: 13, fontWeight: "700" },

  // Empty
  empty: { alignItems: "center", paddingVertical: 48, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: DARK, marginTop: 12, marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: "#888", textAlign: "center", marginBottom: 20 },
  emptyBtn: { backgroundColor: TEAL, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  emptyBtnText: { color: WHITE, fontWeight: "700", fontSize: 14 },

  // Scroll hint — first item in the FlatList header, always above schools
  scrollHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#E6F7F7",
    borderBottomWidth: 1,
    borderColor: "#B2E8E5",
    marginBottom: 6,
  },
  scrollHintText: {
    flex: 1,
    fontSize: 12,
    color: TEAL_DARK,
    fontWeight: "500",
  },

  // DBE form card
  dbeCard: {
    backgroundColor: "#E6F7F7",
    marginHorizontal: 14,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#B2E8E5",
  },
  dbeTextRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 12,
  },
  dbeMessage: {
    flex: 1,
    fontSize: 13,
    color: TEAL_DARK,
    lineHeight: 19,
    fontWeight: "500",
  },
  dbeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TEAL_DARK,
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  dbeBtnText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
});

// ─── Dropdown Styles ─────────────────────────────────────────
const dd = StyleSheet.create({
  wrapper: { flex: 1, position: "relative", zIndex: 10 },
  trigger: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F5F5F5", borderRadius: 8, borderWidth: 1, borderColor: "#E0E0E0", paddingHorizontal: 10, paddingVertical: 9 },
  triggerText: { fontSize: 12, color: "#333", flex: 1, marginRight: 4 },
  list: { position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: WHITE, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, zIndex: 999, elevation: 8, shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, maxHeight: 200 },
  option: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  optionActive: { backgroundColor: TEAL_LIGHT },
  optionText: { fontSize: 13, color: "#333" },
  optionTextActive: { color: TEAL, fontWeight: "600" },
});
