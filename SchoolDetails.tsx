import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSchoolById, getSchoolContacts } from "./db/ReferenceDatabase";
import SpeakButton from "./components/SpeakButton";

const TEAL = "#0F8B8D";
const TEAL_DARK = "#0A6C6D";
const TEAL_LIGHT = "#E6F7F7";
const WHITE = "#FFFFFF";
const DARK = "#1F2937";
const GREY = "#6B7280";

// ── Info Row ─────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// ── Section ──────────────────────────────────────────────────
function Section({ iconName, title, children }: { iconName: any; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons name={iconName} size={16} color={TEAL_DARK} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

// ── Tag Chip ─────────────────────────────────────────────────
function TagChip({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label.trim()}</Text>
    </View>
  );
}

// ── Tag List from comma-separated string ─────────────────────
function TagList({ text }: { text: string }) {
  const items = text.split(",").map((s) => s.trim()).filter(Boolean);
  if (items.length === 0) return <Text style={styles.noData}>No information available</Text>;
  return (
    <View style={styles.tagRow}>
      {items.map((item, i) => <TagChip key={i} label={item} />)}
    </View>
  );
}

export default function SchoolDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [school, setSchool] = useState<any>(null);
  const [contacts, setContacts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getSchoolById(Number(id));
      setSchool(data);
      try {
        const c = await getSchoolContacts(Number(id));
        setContacts(c);
      } catch {
        setContacts(null);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  if (!school) {
    return (
      <View style={styles.centered}>
        <Ionicons name="school-outline" size={60} color="#ccc" />
        <Text style={styles.notFoundTitle}>School Not Found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Parse subjects_offered into sections
  const subjectLines = (school.subjects_offered || "")
    .split("\n")
    .filter((l: string) => l.trim());

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL_DARK} />

      {/* Accessibility bar removed — replaced by floating SpeakButton below */}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Hero Header ──────────────────────────────────── */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.heroBack} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={WHITE} />
          </TouchableOpacity>

          <View style={styles.heroIcon}>
            <MaterialIcons name="school" size={44} color={TEAL} />
          </View>

          <Text style={styles.heroName}>{school.name}</Text>

          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{school.type}</Text>
            </View>
            <View style={styles.heroBadge}>
              <Ionicons name="location-outline" size={12} color={WHITE} />
              <Text style={styles.heroBadgeText}> {school.location || "Eastern Cape"}</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{school.province}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>

          {/* ── About ────────────────────────────────────── */}
          {school.about ? (
            <Section iconName="information-circle-outline" title="About This School">
              <Text style={styles.bodyText}>{school.about}</Text>
            </Section>
          ) : null}

          {/* ── Subjects Offered ─────────────────────────── */}
          <Section iconName="book-outline" title="Subjects Offered">
            {subjectLines.length > 0 ? (
              subjectLines.map((line: string, i: number) => {
                const colonIdx = line.indexOf(": ");
                if (colonIdx > -1) {
                  const label = line.substring(0, colonIdx);
                  const content = line.substring(colonIdx + 2);
                  return (
                    <View key={i} style={styles.subjectItem}>
                      <Text style={styles.subjectLabel}>{label}</Text>
                      <Text style={styles.bodyText}>{content}</Text>
                    </View>
                  );
                }
                return <Text key={i} style={styles.bodyText}>{line}</Text>;
              })
            ) : (
              <Text style={styles.noData}>No subject information available</Text>
            )}
          </Section>

          {/* ── Facilities ───────────────────────────────── */}
          <Section iconName="business-outline" title="Facilities">
            {school.facilities ? (
              <TagList text={school.facilities} />
            ) : (
              <Text style={styles.noData}>No facilities information available</Text>
            )}
          </Section>

          {/* ── Sports ───────────────────────────────────── */}
          <Section iconName="fitness-outline" title="Sports">
            {school.sports ? (
              <TagList text={school.sports} />
            ) : (
              <Text style={styles.noData}>No sports information available</Text>
            )}
          </Section>

          {/* ── Extracurricular Activities ───────────────── */}
          <Section iconName="star-outline" title="Extracurricular Activities">
            {school.extracurricular ? (
              <TagList text={school.extracurricular} />
            ) : (
              <Text style={styles.noData}>No extracurricular information available</Text>
            )}
          </Section>

          {/* ── Services & Amenities ─────────────────────── */}
          <Section iconName="grid-outline" title="Services & Amenities">
            {school.services_amenities ? (
              <TagList text={school.services_amenities} />
            ) : (
              <Text style={styles.noData}>No services information available</Text>
            )}
          </Section>

          {/* ── Contact Details ───────────────────────────── */}
          <Section iconName="call-outline" title="Contact Details">
            {(contacts?.phone || school.contact) ? (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() =>
                  Linking.openURL(`tel:${contacts?.phone ?? school.contact}`)
                }
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="call-outline" size={18} color={TEAL} />
                </View>
                <View style={styles.contactBody}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>
                    {contacts?.phone ?? school.contact}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ) : null}

            {(contacts?.email || school.email) ? (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() =>
                  Linking.openURL(`mailto:${contacts?.email ?? school.email}`)
                }
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="mail-outline" size={18} color={TEAL} />
                </View>
                <View style={styles.contactBody}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>
                    {contacts?.email ?? school.email}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ) : null}

            {contacts?.address ? (
              <View style={styles.contactRow}>
                <View style={styles.contactIcon}>
                  <Ionicons name="location-outline" size={18} color={TEAL} />
                </View>
                <View style={styles.contactBody}>
                  <Text style={styles.contactLabel}>Address</Text>
                  <Text style={styles.contactValue}>{contacts.address}</Text>
                </View>
              </View>
            ) : null}

            {!contacts?.phone && !school.contact && !contacts?.email && !school.email && !contacts?.address && (
              <Text style={styles.noData}>Contact details not available</Text>
            )}
          </Section>

        </View>
      </ScrollView>

      <SpeakButton text={
        `${school?.name || "School"}. ` +
        `${school?.type || ""} school in ${school?.location || "Eastern Cape"}. ` +
        `${school?.about || ""} ` +
        `Subjects: ${(school?.subjects_offered || "").replace(/\n/g, ". ")}. ` +
        `Sports: ${school?.sports || "Not available"}. ` +
        `Extracurricular: ${school?.extracurricular || "Not available"}. ` +
        `Services and amenities: ${school?.services_amenities || "Not available"}.`
      } />
    </View>
  );
}

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
    padding: 30,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
    marginTop: 12,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: TEAL,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 14,
  },

  // ── Hero ──────────────────────────────────────────────────
  hero: {
    backgroundColor: TEAL,
    paddingTop: 50,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  heroBack: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    elevation: 4,
  },
  heroName: {
    fontSize: 22,
    fontWeight: "900",
    color: WHITE,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 30,
  },
  heroBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "600",
  },

  // ── Body ──────────────────────────────────────────────────
  body: {
    padding: 16,
    gap: 12,
  },

  // ── Section ───────────────────────────────────────────────
  section: {
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: TEAL_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#D1F0EE",
    gap: 10,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: TEAL_DARK,
  },
  sectionBody: {
    padding: 14,
  },

  // ── Info rows ─────────────────────────────────────────────
  infoRow: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    width: 110,
    fontSize: 13,
    fontWeight: "700",
    color: GREY,
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: DARK,
  },

  // ── Subject items ─────────────────────────────────────────
  subjectItem: {
    marginBottom: 10,
  },
  subjectLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: TEAL_DARK,
    marginBottom: 2,
  },
  bodyText: {
    fontSize: 13,
    color: DARK,
    lineHeight: 20,
  },

  // ── Tags ──────────────────────────────────────────────────
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: TEAL_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#B2E8E5",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEAL_DARK,
  },

  // ── Contact rows ──────────────────────────────────────────
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  contactIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  contactBody: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: GREY,
    fontWeight: "500",
  },
  contactValue: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK,
  },

  noData: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
