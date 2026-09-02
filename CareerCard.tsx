import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Career {
  id: number;
  name: string;
  stream: string;
  aps: number;
}

interface Props {
  career: Career;
}

export function CareerCard({ career }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.title}>
          {expanded ? "▼ " : "▶ "}
          {career.name}
        </Text>
      </TouchableOpacity>

      <View style={styles.summary}>
        <Text style={styles.stream}>{career.stream || "General"}</Text>
        <Text style={styles.aps}>APS: {career.aps ?? "N/A"}</Text>
      </View>

      {expanded && (
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Career Stream</Text>
          <Text style={styles.detailText}>{career.stream || "Not available"}</Text>

          <Text style={styles.detailLabel}>APS Requirement</Text>
          <Text style={styles.detailText}>{career.aps != null ? career.aps : "Not available"}</Text>
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
  summary: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stream: {
    fontSize: 14,
    color: "#555",
  },
  aps: {
    fontSize: 14,
    color: "#555",
  },
  details: {
    marginTop: 12,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  detailText: {
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
});
