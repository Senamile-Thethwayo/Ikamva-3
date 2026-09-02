import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getMentors } from "./db/ReferenceDatabase";

interface Mentor {
  id: number;
  name: string;
  field: string;
  bio?: string;
  phone?: string;
  email?: string;
  profile_pic?: string;
  availability?: string;
}

const FIELDS = [
  "All",
  "Engineering",
  "Medicine",
  "Law",
  "Education",
  "Information Technology",
  "Business",
];

export default function Mentorship() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedField, setSelectedField] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);

      const data = (await getMentors()) as Mentor[];

      console.log("👩‍🏫 MENTORS LOADED:", data);

      setMentors(data);
    } catch (error) {
      console.error("❌ Error loading mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = useMemo(() => {
    if (selectedField === "All") {
      return mentors;
    }

    return mentors.filter(
      (mentor) =>
        mentor.field?.toLowerCase() === selectedField.toLowerCase()
    );
  }, [mentors, selectedField]);

  const renderMentor = (info: ListRenderItemInfo<Mentor>) => {
    const item = info.item;
    return React.createElement(
      View,
      { style: styles.card },
      React.createElement(Text, { style: styles.mentorName }, item.name),
      React.createElement(Text, { style: styles.field }, item.field),
      item.bio
        ? React.createElement(Text, { style: styles.bio }, item.bio)
        : null,
      item.availability
        ? React.createElement(
            Text,
            { style: styles.availability },
            `Availability: ${item.availability}`
          )
        : null,
      item.email
        ? React.createElement(
            Text,
            { style: styles.contact },
            `Email: ${item.email}`
          )
        : null
    );
  };

  if (loading) {
    return React.createElement(
      View,
      { style: styles.loadingContainer },
      React.createElement(ActivityIndicator, {
        size: "large",
        color: "#0057A3",
      }),
      React.createElement(Text, { style: styles.loadingText }, "Loading mentors...")
    );
  }

  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, { style: styles.title }, "Find a Mentor"),
    React.createElement(
      Text,
      { style: styles.subtitle },
      "Connect with mentors in your field of interest."
    ),
    React.createElement(Text, { style: styles.filterTitle }, "Filter by field"),
    React.createElement(
      ScrollView,
      {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        contentContainerStyle: styles.filterContainer,
      },
      ...FIELDS.map((field) =>
        React.createElement(
          TouchableOpacity,
          {
            key: field,
            style: [
              styles.filterButton,
              selectedField === field && styles.activeFilterButton,
            ],
            onPress: () => setSelectedField(field),
          },
          React.createElement(
            Text,
            {
              style: [
                styles.filterText,
                selectedField === field && styles.activeFilterText,
              ],
            },
            field
          )
        )
      )
    ),
    filteredMentors.length === 0
      ? React.createElement(
          View,
          { style: styles.emptyContainer },
          React.createElement(Text, { style: styles.emptyTitle }, "No mentors found"),
          React.createElement(
            Text,
            { style: styles.emptyText },
            "There are currently no mentors available in this field."
          )
        )
      : React.createElement(
          FlatList as React.ComponentType<any>,
          {
            data: filteredMentors,
            keyExtractor: (item: Mentor) => item.id.toString(),
            renderItem: renderMentor,
            showsVerticalScrollIndicator: false,
            contentContainerStyle: styles.list,
          } as any
        )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    paddingHorizontal: 20,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  filterButton: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },

  activeFilterButton: {
    backgroundColor: "#0057A3",
  },

  filterText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },

  activeFilterText: {
    color: "#fff",
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  mentorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },

  field: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0057A3",
    marginBottom: 10,
  },

  bio: {
    fontSize: 14,
    lineHeight: 21,
    color: "#555",
    marginBottom: 10,
  },

  availability: {
    fontSize: 13,
    color: "#555",
    marginBottom: 5,
  },

  contact: {
    fontSize: 13,
    color: "#555",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: "#666",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});