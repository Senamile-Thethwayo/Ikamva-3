import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  school: any;
}

export default function SchoolCard({ school }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.title}>
          {expanded ? "▼ " : "▶ "}
          {school.name}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>

          <Text style={styles.heading}>
            Province
          </Text>

          <Text style={styles.text}>
            {school.province}
          </Text>

          <Text style={styles.heading}>
            School Type
          </Text>

          <Text style={styles.text}>
            {school.type}
          </Text>

          <Text style={styles.heading}>
            Subjects Offered
          </Text>

          <Text style={styles.text}>
            {school.subjects_offered || "Not available"}
          </Text>

          <Text style={styles.heading}>
            Sports
          </Text>

          <Text style={styles.text}>
            {school.sports || "Not available"}
          </Text>

          <Text style={styles.heading}>
            Extracurricular Activities
          </Text>

          <Text style={styles.text}>
            {school.extracurricular || "Not available"}
          </Text>

          <Text style={styles.heading}>
            Services & Amenities
          </Text>

          <Text style={styles.text}>
            {school.facilities || "Not available"}
          </Text>

          <Text style={styles.heading}>
            Contact
          </Text>

          <Text style={styles.text}>
            {school.contact || "Not available"}
          </Text>

          <Text style={styles.heading}>
            Email
          </Text>

          <Text style={styles.text}>
            {school.email || "Not available"}
          </Text>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00838F",
  },

  content: {
    marginTop: 12,
  },

  heading: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 12,
    color: "#333",
  },

  text: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
    lineHeight: 22,
  },
});