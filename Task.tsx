import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

// TYPE
type Item = {
  id: string;
  name: string;
  type: string;
  province?: string;
  details: string[];
};

// ====================
// DATA
// ====================

// SCHOOLS
const schools: Item[] = [
  {
    id: "1",
    name: "Baleni Secondary School",
    type: "Public",
    province: "Eastern Cape",
    details: [
      "Applications: In person",
      "Documents:",
      "• Birth Certificate",
      "• Parent ID",
      "• School Report",
      "• Proof of Address",
    ],
  },
  {
    id: "2",
    name: "Tyelimhlophe Secondary School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person", "Documents: ID, Report"],
  },
  {
    id: "3",
    name: "Toleni Secondary School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "4",
    name: "Bonxa High School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "5",
    name: "Dumsi Senior Secondary School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "6",
    name: "Zibokwana High School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "7",
    name: "Dangwana High School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "8",
    name: "Zwelitsha High Secondary School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "9",
    name: "Mbodleni High School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "10",
    name: "Mfazwe Tech High School",
    type: "Technical",
    province: "Eastern Cape",
    details: ["Applications: In person", "Focus: Technical subjects"],
  },
  {
    id: "11",
    name: "Mpondombini Secondary School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "12",
    name: "Mvenyane High School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "13",
    name: "Nzululwazi High School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
  {
    id: "14",
    name: "Nomaqwathekana Secondary School",
    type: "Public",
    province: "Eastern Cape",
    details: ["Applications: In person"],
  },
];

// CAREERS
const careers: Item[] = [
  {
    id: "1",
    name: "Software Developer",
    type: "Career",
    details: [
      "Where to study:",
      "• University of Pretoria",
      "• University of Cape Town",
      "",
      "Required subjects:",
      "• Mathematics",
      "• Physical Sciences",
      "",
      "Careers:",
      "• App Developer",
      "• Web Developer",
    ],
  },
  {
    id: "2",
    name: "Teacher",
    type: "Career",
    details: [
      "Where to study:",
      "• Walter Sisulu University",
      "",
      "Required subjects:",
      "• English",
      "",
      "Careers:",
      "• Primary Teacher",
      "• High School Teacher",
    ],
  },
  {
    id: "3",
    name: "Engineer",
    type: "Career",
    details: [
      "Where to study:",
      "• University of Pretoria",
      "",
      "Required subjects:",
      "• Mathematics",
      "• Physical Sciences",
    ],
  },
  {
    id: "4",
    name: "Nurse",
    type: "Career",
    details: [
      "Where to study:",
      "• Nursing Colleges",
      "",
      "Required subjects:",
      "• Life Sciences",
    ],
  },
];

// BURSARIES
const bursaries: Item[] = [
  {
    id: "1",
    name: "NSFAS",
    type: "Government",
    details: [
      "Covers tuition, accommodation, allowance",
      "Requirement: Low income",
    ],
  },
  {
    id: "2",
    name: "Funza Lushaka",
    type: "Government",
    details: [
      "For teaching degrees",
      "Covers full study costs",
    ],
  },
  {
    id: "3",
    name: "Vodacom Bursary",
    type: "Private",
    details: [
      "Fields: IT, Engineering",
      "Requires strong Maths",
    ],
  },
  {
    id: "4",
    name: "Standard Bank Bursary",
    type: "Private",
    details: [
      "Fields: Finance, IT",
      "Requires high marks",
    ],
  },
];

// MENTORSHIP
const mentorship: Item[] = [
  {
    id: "1",
    name: "IkamvaYouth",
    type: "Mentorship",
    details: ["Free tutoring", "Career guidance"],
  },
  {
    id: "2",
    name: "SA Youth",
    type: "Mentorship",
    details: ["Career support", "Opportunities"],
  },
];

// ====================
// MAIN COMPONENT
// ====================
export default function ExploreScreen() {
  const [tab, setTab] = useState("Schools");
  const [selected, setSelected] = useState<Item | null>(null);

  const getData = () => {
    if (tab === "Schools") return schools;
    if (tab === "Careers") return careers;
    if (tab === "Bursaries") return bursaries;
    return mentorship;
  };

  // DETAIL VIEW
  if (selected) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelected(null)}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>{selected.name}</Text>

        <Text style={styles.info}>Type: {selected.type}</Text>
        {selected.province && (
          <Text style={styles.info}>
            Province: {selected.province}
          </Text>
        )}

        {selected.details.map((d, i) => (
          <Text key={i} style={styles.info}>
            {d}
          </Text>
        ))}
      </View>
    );
  }

  // LIST VIEW
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore</Text>

      <View style={styles.tabs}>
        {["Schools", "Careers", "Bursaries", "Mentorship"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={{ color: tab === t ? "white" : "black" }}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getData()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelected(item)}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.sub}>{item.type}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f4f6f8" },

  header: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },

  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  tabBtn: {
    padding: 10,
    backgroundColor: "#ddd",
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 6,
  },

  activeTab: {
    backgroundColor: "#007bff",
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: { fontWeight: "bold", fontSize: 16 },

  sub: { color: "gray" },

  info: { marginTop: 8, fontSize: 15 },

  back: { color: "#007bff", marginBottom: 10 },
});