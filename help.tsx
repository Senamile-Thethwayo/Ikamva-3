import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SpeakButton from "./components/SpeakButton";

const TEAL       = "#14B8A6";
const TEAL_DARK  = "#0A7A7C";
const TEAL_LIGHT = "#E6F7F7";
const WHITE      = "#FFFFFF";
const DARK       = "#1F2937";
const GREY       = "#6B7280";

const FAQ = [
  { q: "How do I calculate my APS?",         a: "Go to APS Calculator in the menu. Enter your subject percentages and the app will calculate your score automatically." },
  { q: "How do I apply for a bursary?",       a: "Open the Bursaries section from the menu. Tap any bursary to view details and the application link." },
  { q: "Can I use the app without internet?", a: "Yes. All school, mentor and career information is stored on your device and works offline." },
  { q: "How do I contact a mentor?",          a: "Go to Mentors, tap a mentor card, then tap Reach Out to Mentor to send an email." },
  { q: "How do I update my profile?",         a: "Open the menu, tap Profile, then tap the edit icon or Personal Information." },
];

export default function Help() {
  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL_DARK} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={WHITE} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Help & Support</Text>
        <TouchableOpacity style={s.headerBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={20} color={WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Contact */}
        <Text style={s.groupLabel}>Contact Us</Text>
        <View style={s.card}>
          <TouchableOpacity
            style={s.contactRow}
            onPress={() => Linking.openURL("mailto:ikamvaofficial@gmail.com?subject=IKAMVA HUB Support")}
          >
            <View style={s.contactIcon}>
              <Ionicons name="mail-outline" size={20} color={TEAL} />
            </View>
            <View style={s.contactBody}>
              <Text style={s.contactLabel}>Email Support</Text>
              <Text style={s.contactValue}>ikamvaofficial@gmail.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.contactRow, { borderBottomWidth: 0 }]}
            onPress={() => Linking.openURL("tel:0639527797")}
          >
            <View style={s.contactIcon}>
              <Ionicons name="call-outline" size={20} color={TEAL} />
            </View>
            <View style={s.contactBody}>
              <Text style={s.contactLabel}>Phone Support</Text>
              <Text style={s.contactValue}>063 952 7797</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <Text style={s.groupLabel}>Frequently Asked Questions</Text>
        <View style={s.card}>
          {FAQ.map((item, i) => (
            <View key={i} style={[s.faqItem, i === FAQ.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={s.faqQ}>{item.q}</Text>
              <Text style={s.faqA}>{item.a}</Text>
            </View>
          ))}
        </View>

        {/* Send message */}
        <TouchableOpacity
          style={s.emailBtn}
          onPress={() => Linking.openURL(
            "mailto:ikamvaofficial@gmail.com?subject=IKAMVA HUB Support Request&body=Hi IKAMVA HUB team,%0A%0AI need help with:%0A%0A"
          )}
        >
          <Ionicons name="send-outline" size={18} color={WHITE} />
          <Text style={s.emailBtnText}>Send Us a Message</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      <SpeakButton text={
        "Help and Support. Contact IKAMVA HUB at ikamvaofficial@gmail.com or call 063 952 7797. " +
        "Frequently asked questions: " +
        FAQ.map((f) => `${f.q} ${f.a}`).join(". ")
      } />
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

  contactRow:   { flexDirection: "row", alignItems: "center", padding: 14, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", gap: 12 },
  contactIcon:  { width: 38, height: 38, borderRadius: 10, backgroundColor: TEAL_LIGHT, alignItems: "center", justifyContent: "center" },
  contactBody:  { flex: 1 },
  contactLabel: { fontSize: 11, color: GREY, fontWeight: "500" },
  contactValue: { fontSize: 14, fontWeight: "700", color: TEAL },

  faqItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  faqQ: { fontSize: 14, fontWeight: "700", color: DARK, marginBottom: 5 },
  faqA: { fontSize: 13, color: GREY, lineHeight: 19 },

  emailBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: TEAL_DARK, borderRadius: 14, paddingVertical: 16, gap: 8, marginTop: 20 },
  emailBtnText: { color: WHITE, fontSize: 15, fontWeight: "700" },
});
