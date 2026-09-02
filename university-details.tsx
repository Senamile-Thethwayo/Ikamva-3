import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { universityLogos } from "../assets/university-logos/logoMap";
import { getCoursesByUniversity, getUniversityById } from "./db/ReferenceDatabase";
import SpeakButton from "./components/SpeakButton";

const TEAL = "#14B8A6";
const TEAL_DARK = "#0A7A7C";

// Campus cover image URLs keyed by university name
const CAMPUS_COVERS: Record<string, string> = {
  "University of Cape Town":           "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/UCT_upper_campus_DJI_0025_%28cropped%29.jpg/640px-UCT_upper_campus_DJI_0025_%28cropped%29.jpg",
  "University of Pretoria":            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/University_of_Pretoria_Main_Building.jpg/640px-University_of_Pretoria_Main_Building.jpg",
  "Stellenbosch University":           "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Stellenbosch_University_Victoria_Street_campus.jpg/640px-Stellenbosch_University_Victoria_Street_campus.jpg",
  "University of the Witwatersrand":   "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/University_of_the_Witwatersrand%2C_Great_Hall.jpg/640px-University_of_the_Witwatersrand%2C_Great_Hall.jpg",
  "University of KwaZulu-Natal":       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/UKZN_Howard_College.jpg/640px-UKZN_Howard_College.jpg",
  "University of Johannesburg":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/University_of_Johannesburg_Auckland_Park_Kingsway_Campus.jpg/640px-University_of_Johannesburg_Auckland_Park_Kingsway_Campus.jpg",
  "University of the Free State":      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/UFS_Main_Building.jpg/640px-UFS_Main_Building.jpg",
  "North-West University":             "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/NWU_Potchefstroom_campus.jpg/640px-NWU_Potchefstroom_campus.jpg",
  "Nelson Mandela University":         "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Nelson_Mandela_University_Main_Campus.jpg/640px-Nelson_Mandela_University_Main_Campus.jpg",
  "University of the Western Cape":    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/University_of_the_Western_Cape.jpg/640px-University_of_the_Western_Cape.jpg",
  "Rhodes University":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Rhodes_University_Great_Hall.jpg/640px-Rhodes_University_Great_Hall.jpg",
  "University of Fort Hare":           "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/University_of_Fort_Hare%2C_Alice%2C_Eastern_Cape.jpg/640px-University_of_Fort_Hare%2C_Alice%2C_Eastern_Cape.jpg",
  "Walter Sisulu University":          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Walter_Sisulu_University_Mthatha.jpg/640px-Walter_Sisulu_University_Mthatha.jpg",
};

const formatDate = (d: string) => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

const groupByFaculty = (courses: any[]) =>
  courses.reduce((acc: any, c: any) => {
    const f = c.faculty || "Other";
    if (!acc[f]) acc[f] = [];
    acc[f].push(c);
    return acc;
  }, {});

export default function UniversityDetails() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const numericId = Number(id);

  const [university, setUniversity] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [uni, courseData] = await Promise.all([
          getUniversityById(numericId),
          getCoursesByUniversity(numericId),
        ]);
        setUniversity(uni);
        setCourses(courseData);
      } catch (e) {
        console.error("University details load error:", e);
      } finally {
        setLoading(false);
      }
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

  const logoAsset = universityLogos[numericId];
  const coverUrl = university?.name ? (CAMPUS_COVERS[university.name] ?? null) : null;
  const grouped = groupByFaculty(courses);
  const displayName = university?.name ?? String(name ?? "");

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── Cover / Hero ─────────────────────────────────── */}
      <View style={styles.cover}>
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : null}
        {/* dark overlay so back button is always visible */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: coverUrl ? "rgba(0,0,0,0.35)" : TEAL }]} />

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Logo badge */}
        <View style={styles.logoBadge}>
          {logoAsset ? (
            <Image source={logoAsset} style={styles.logoImg} resizeMode="contain" />
          ) : university?.image_url ? (
            <Image
              source={{ uri: university.image_url }}
              style={styles.logoImg}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.logoInitial}>{displayName.charAt(0)}</Text>
          )}
        </View>
      </View>

      {/* ── Info ─────────────────────────────────────────── */}
      <View style={styles.info}>
        <Text style={styles.uniName}>{displayName}</Text>

        {university?.city ? (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{university.city}, {university.province}</Text>
          </View>
        ) : null}

        {university?.application_open_date ? (
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>
              Applications: {formatDate(university.application_open_date)} – {formatDate(university.application_close_date)}
            </Text>
          </View>
        ) : null}

        {university?.contact ? (
          <View style={styles.row}>
            <Ionicons name="call-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{university.contact}</Text>
          </View>
        ) : null}

        {/* Action buttons */}
        <View style={styles.btnRow}>
          {university?.application_link ? (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Linking.openURL(university.application_link)}
            >
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={styles.actionBtnText}>Apply</Text>
            </TouchableOpacity>
          ) : null}

          {university?.website ? (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnOutline]}
              onPress={() => Linking.openURL(university.website)}
            >
              <Ionicons name="globe-outline" size={16} color={TEAL} />
              <Text style={[styles.actionBtnText, { color: TEAL }]}>Website</Text>
            </TouchableOpacity>
          ) : null}

          {university?.contact ? (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnOutline]}
              onPress={() => Linking.openURL(`tel:${university.contact}`)}
            >
              <Ionicons name="call-outline" size={16} color={TEAL} />
              <Text style={[styles.actionBtnText, { color: TEAL }]}>Call</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* About */}
        {university?.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bodyText}>{university.description}</Text>
          </View>
        ) : null}
      </View>

      {/* ── Courses ──────────────────────────────────────── */}
      {Object.keys(grouped).length > 0 ? (
        <View style={styles.coursesSection}>
          <Text style={styles.coursesHeading}>Courses Offered</Text>
          {Object.keys(grouped).map((faculty) => (
            <View key={faculty} style={styles.facultyBlock}>
              <Text style={styles.facultyTitle}>{faculty}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.tableHeader}>
                    {["Qualification", "Type", "Duration", "APS", "English", "Maths"].map((h) => (
                      <Text key={h} style={styles.headerCell}>{h}</Text>
                    ))}
                  </View>
                  {grouped[faculty].map((course: any, i: number) => (
                    <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                      <Text style={styles.cell}>{course.qualification}</Text>
                      <Text style={styles.cell}>{course.qualification_type}</Text>
                      <Text style={styles.cell}>{course.duration}</Text>
                      <Text style={styles.cell}>{course.minimum_aps}</Text>
                      <Text style={styles.cell}>{course.english_hl || course.english_fal || "—"}</Text>
                      <Text style={styles.cell}>{course.mathematics || "—"}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ))}
        </View>
      ) : null}

      {/* ── Home button ──────────────────────────────────── */}
      <View style={styles.homeRow}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={18} color={TEAL} />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>

    <SpeakButton text={
      `${displayName}. ` +
      `${university?.city ? `Located in ${university.city}, ${university.province}.` : ""} ` +
      `${university?.description || ""} ` +
      `${university?.application_open_date ? `Applications open from ${university.application_open_date} to ${university.application_close_date}.` : ""} ` +
      `Contact: ${university?.contact || "Not available"}.`
    } />
  </View>
  );
}

const COVER_H = 220;
const LOGO_SIZE = 88;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  cover: {
    height: COVER_H,
    backgroundColor: TEAL,
    justifyContent: "flex-end",
    paddingBottom: LOGO_SIZE / 2 + 10,
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoBadge: {
    position: "absolute",
    bottom: -LOGO_SIZE / 2,
    left: 20,
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  logoImg: { width: "75%", height: "75%" },
  logoInitial: { fontSize: 30, fontWeight: "900", color: TEAL },

  info: {
    paddingTop: LOGO_SIZE / 2 + 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  uniName: { fontSize: 24, fontWeight: "900", color: "#1F2937", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  metaText: { fontSize: 13, color: "#6B7280", flex: 1 },

  btnRow: { flexDirection: "row", gap: 10, marginTop: 16, marginBottom: 10, flexWrap: "wrap" },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: TEAL_DARK,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: TEAL,
  },
  actionBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1F2937", marginBottom: 8 },
  bodyText: { fontSize: 14, color: "#4B5563", lineHeight: 22 },

  coursesSection: { paddingHorizontal: 16, marginTop: 8 },
  coursesHeading: { fontSize: 20, fontWeight: "900", color: "#1F2937", marginBottom: 16 },
  facultyBlock: { marginBottom: 28 },
  facultyTitle: { fontSize: 16, fontWeight: "800", color: TEAL_DARK, marginBottom: 10 },

  tableHeader: { flexDirection: "row", backgroundColor: TEAL_DARK },
  headerCell: { width: 160, color: "#fff", fontWeight: "700", padding: 10, fontSize: 12 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  tableRowAlt: { backgroundColor: "#F8FAFA" },
  cell: { width: 160, padding: 10, fontSize: 12, color: "#374151" },

  noCourses: { alignItems: "center", paddingVertical: 30, gap: 10 },
  noCoursesText: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },

  homeRow: { paddingHorizontal: 16, paddingTop: 8 },
  homeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: TEAL, borderRadius: 14,
    paddingVertical: 14, gap: 8,
  },
  homeBtnText: { color: TEAL, fontSize: 15, fontWeight: "700" },
});
