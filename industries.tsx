import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getIndustries } from "./db/ReferenceDatabase";

export default function Industries() {
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    const data = await getIndustries();
    console.log("📊 Industries loaded:", data.length);
    setIndustries(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Industries in the Eastern Cape</Text>
      <FlatList
        data={industries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.industryName}>{item.name}</Text>
            <Text style={styles.industrySector}>Sector: {item.sector}</Text>
            <Text style={styles.industryLocation}>📍 {item.location}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  industryName: { fontSize: 18, fontWeight: "bold", color: "#007AFF" },
  industrySector: { fontSize: 14, color: "#555", marginTop: 4 },
  industryLocation: { fontSize: 14, color: "#555", marginTop: 4 },
});
