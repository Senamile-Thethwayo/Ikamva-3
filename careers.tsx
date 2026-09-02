import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getCareers } from "./db/Database";
import { getData, saveData } from "./utils/Storage";

export default function Careers() {
  const router = useRouter();
  const [careers, setCareers] = useState<any[]>([]);
  const [filteredCareers, setFilteredCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStream, setSelectedStream] = useState("All");

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try{
    setLoading(true);

    const data = await getCareers();
    console.log("📊 CAREERS LOADED:", data.length);

    //Save fresh careers locally 
    await saveData("careers", data);

    setCareers(data);
    setFilteredCareers(data);
    }catch(error){
      console.error("Could not load careers from database:", error);

      //Load cached careers when offline 
      const cachedCareers = await getData("Careers");
      
      if (cachedCareers) {
      console.log("Using cached careers:", cachedCareers.length);
      setCareers(cachedCareers);
      setFilteredCareers(cachedCareers);
    }
  } finally {
    setLoading(false);
  }
  };

  const filterCareers = (text: string, stream: string) => {
    let filtered = careers;

    if (text.trim() !== "") {
      const searchText = text.toLowerCase();

      filtered = filtered.filter((c) =>
        (
          c.name +
          " " +
          c.field +
          " " +
          c.description +
          " " +
          c.subjects_needed +
          " " +
          c.study_path
        )
          .toLowerCase()
          .includes(searchText),
      );
    }

    if (stream !== "All") {
      filtered = filtered.filter((c) => c.field === stream);
    }

    setFilteredCareers(filtered);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    filterCareers(text, selectedStream);
  };

  const handleStreamSelect = (stream: string) => {
    setSelectedStream(stream);
    filterCareers(search, stream);
  };

  const streams = [
    "All",
    "Science & Health Sciences",
    "Engineering & Technology",
    "ICT & Digital Media",
    "Commerce & Business",
    "Arts & Creative Fields",
    "Education",
    "Law & Legal Studies",
    "Agriculture & Environmental Studies",
    "Hospitality & Tourism",
    "TVET & Skilled Trades",
    "Built Environment & Construction",
    "Transport & Logistics",
  ];
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Career Finder</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search careers..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* Stream Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.streamContainer}
        contentContainerStyle={styles.streamContent}
      >
        {streams.map((stream) => (
          <TouchableOpacity
            key={stream}
            style={[
              styles.streamButton,
              selectedStream === stream && styles.streamButtonActive,
            ]}
            onPress={() => handleStreamSelect(stream)}
          >
            <Text
              style={[
                styles.streamButtonText,
                selectedStream === stream && styles.streamButtonTextActive,
              ]}
            >
              {stream}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Career List */}
      <FlatList
        data={filteredCareers}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/career-details?id=${item.id}` as any)}
          >
            <Text style={styles.careerName}>▼ {item.name}</Text>
            <Text style={styles.careerField}>
              Field: {item.field || "General"}
            </Text>
            <Text style={styles.careerAps}>APS {item.aps_range || "N/A"}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No careers found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFA",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFA",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F766E",
    marginTop: 15,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D6ECE9",
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  streamContainer: {
    maxHeight: 50,
    marginBottom: 10,
  },
  streamContent: {
    paddingHorizontal: 4,
    alignItems: "center",
  },
  streamButton: {
    backgroundColor: "#E8F5F3",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },
  streamButtonActive: {
    backgroundColor: "#14B8A6",
  },
  streamButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F766E",
  },
  streamButtonTextActive: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12, // Reduced from 18
    marginBottom: 10, // Reduced from 15
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  careerName: {
    fontSize: 15, // Reduced from 19
    fontWeight: "700",
    color: "#0F766E",
  },
  careerField: {
    fontSize: 12, // Reduced from 14
    color: "#666",
    marginTop: 4,
  },
  careerAps: {
    fontSize: 13, // Reduced from 15
    color: "#14B8A6",
    fontWeight: "600",
    marginTop: 3,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 30,
    fontSize: 16,
  },
});