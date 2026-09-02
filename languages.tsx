import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Language, useLanguage } from "./language/LanguageContext";

const TEAL      = "#14B8A6";
const TEAL_DARK = "#0A7A7C";
const TEAL_LIGHT = "#E6F7F7";
const WHITE     = "#FFFFFF";
const DARK      = "#1F2937";
const GREY      = "#6B7280";

type LanguageOption = {
  code:    Language;
  name:    string;
  native:  string;
  flag:    string;
  desc:    string;
};

const OPTIONS: LanguageOption[] = [
  {
    code:   "en",
    name:   "English",
    native: "English",
    flag:   "🇿🇦",
    desc:   "All content displayed in English.",
  },
  {
    code:   "xh",
    name:   "isiXhosa",
    native: "isiXhosa",
    flag:   "🇿🇦",
    desc:   "Umxholo uboniswa ngesiXhosa.",
  },
];

export default function LanguagesScreen() {
  const { language, setLanguage, t } = useLanguage();

  const handleSelect = (code: Language) => {
    setLanguage(code);
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL_DARK} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={WHITE} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t.languages}</Text>
        <TouchableOpacity style={s.headerBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={20} color={WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Info card */}
        <View style={s.infoCard}>
          <Ionicons name="language-outline" size={22} color={TEAL} />
          <Text style={s.infoText}>{t.languageNote}</Text>
        </View>

        {/* Language options */}
        <Text style={s.sectionLabel}>{t.chooseLanguage}</Text>

        {OPTIONS.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <TouchableOpacity
              key={opt.code}
              style={[s.card, isSelected && s.cardSelected]}
              onPress={() => handleSelect(opt.code)}
              activeOpacity={0.85}
            >
              {/* Flag + names */}
              <View style={s.cardLeft}>
                <Text style={s.flag}>{opt.flag}</Text>
                <View style={s.cardNames}>
                  <Text style={[s.cardName, isSelected && s.cardNameSelected]}>
                    {opt.name}
                  </Text>
                  {opt.native !== opt.name && (
                    <Text style={s.cardNative}>{opt.native}</Text>
                  )}
                  <Text style={s.cardDesc}>{opt.desc}</Text>
                </View>
              </View>

              {/* Tick or empty circle */}
              <View style={[s.tick, isSelected && s.tickSelected]}>
                {isSelected ? (
                  <Ionicons name="checkmark" size={16} color={WHITE} />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Current language indicator */}
        <View style={s.currentRow}>
          <Ionicons name="checkmark-circle" size={17} color={TEAL} />
          <Text style={s.currentText}>
            {language === "en"
              ? "Currently using: English"
              : "Ulwimi olusetyenziswa ngoku: isiXhosa"}
          </Text>
        </View>

        {/* Back to home */}
        <TouchableOpacity style={s.homeBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={17} color={TEAL} />
          <Text style={s.homeBtnText}>{t.backToHome}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F8FA" },

  header: {
    backgroundColor: TEAL_DARK,
    paddingTop: 52, paddingBottom: 16, paddingHorizontal: 18,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: WHITE },

  scroll: { padding: 18 },

  infoCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: TEAL_LIGHT, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#B2E8E4", marginBottom: 22,
  },
  infoText: { flex: 1, fontSize: 13, color: TEAL_DARK, lineHeight: 19 },

  sectionLabel: {
    fontSize: 13, fontWeight: "800", color: TEAL_DARK,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12,
  },

  card: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: WHITE, borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 2, borderColor: "#EBEBEB",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  cardSelected: {
    borderColor: TEAL,
    backgroundColor: TEAL_LIGHT,
  },

  cardLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  flag: { fontSize: 36 },
  cardNames: { flex: 1 },
  cardName: { fontSize: 17, fontWeight: "800", color: DARK, marginBottom: 2 },
  cardNameSelected: { color: TEAL_DARK },
  cardNative: { fontSize: 13, color: GREY, marginBottom: 4, fontStyle: "italic" },
  cardDesc: { fontSize: 12, color: GREY, lineHeight: 17 },

  tick: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: "#D1D5DB",
    alignItems: "center", justifyContent: "center",
    backgroundColor: WHITE,
  },
  tickSelected: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },

  currentRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginTop: 8, marginBottom: 20, paddingHorizontal: 4,
  },
  currentText: { fontSize: 13, color: TEAL_DARK, fontWeight: "600" },

  homeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: TEAL, borderRadius: 14,
    paddingVertical: 14, gap: 8,
  },
  homeBtnText: { color: TEAL, fontSize: 15, fontWeight: "700" },
});
