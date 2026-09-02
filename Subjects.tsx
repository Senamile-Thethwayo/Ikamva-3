import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSubjectsByStream } from "./db/Database";
import {saveData,getData} from "../app/utils/Storage";

type Stream = "Science" | "Arts" | "Commerce";

interface Subject {
  id: number;
  name: string;
  stream: Stream;
}

const STREAMS: Stream[] = ["Science", "Arts", "Commerce"];

export default function SubjectsScreen() {
  const [selectedStream, setSelectedStream] = useState<Stream>("Science");
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const loadSubjectsByStream = async (stream: Stream) => {
    setSelectedStream(stream);

    try{
    const data = await getSubjectsByStream(stream);

    //Save subjects for this stream locally
    await saveData(`subjects_${stream}`, data);

    setSubjects(data as Subject[]);
  }catch(error){
    console.error("Could not load subjects from database:", error);

    //Load cached subjects for this stream
    const cachedSubjects = await getData(`subjects_${stream}`);

    if (cachedSubjects) {
      setSubjects(cachedSubjects as Subject[]);
    }
  }
};
  

  useEffect(() => {
    loadSubjectsByStream("Science");
  }, []);

  const renderSubject = ({ item }: { item: Subject }) => (
    <View style={styles.subjectCard}>
      <Text style={styles.subjectName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {STREAMS.map((stream) => (
          <TouchableOpacity
            key={stream}
            style={[styles.tab, selectedStream === stream && styles.activeTab]}
            onPress={() => loadSubjectsByStream(stream)}
          >
            <Text
              style={[
                styles.tabText,
                selectedStream === stream && styles.activeTabText,
              ]}
            >
              {stream}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSubject}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 20,
  },

  tab: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#E5E5E5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#1E88E5",
  },

  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  subjectCard: {
    backgroundColor: "#F5F5F5",
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },

  subjectName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
});