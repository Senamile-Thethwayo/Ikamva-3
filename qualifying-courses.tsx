// app/qualifying-courses.tsx
//
// Shows the courses the learner qualifies for, grouped by faculty.
// Each faculty is a collapsible section — tap to expand and see its courses.

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAllCourses } from './db/ReferenceDatabase';
import { ApsResult, getApsResult } from './utils/apsStorage';
import { Course, getQualifyingCourses } from './utils/eligibility';

type FacultyGroup = {
  faculty: string;
  courses: Course[];
};

export default function QualifyingCoursesScreen() {
  const [apsResult, setApsResult] = useState<ApsResult | null>(null);
  const [facultyGroups, setFacultyGroups] = useState<FacultyGroup[]>([]);
  const [expandedFaculties, setExpandedFaculties] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const saved = await getApsResult();
      setApsResult(saved);

      if (saved) {
        const allCourses = (await getAllCourses()) as Course[];
        const matches = getQualifyingCourses(allCourses, saved.total, saved.breakdown);
        setFacultyGroups(groupByFaculty(matches));
      }

      setLoading(false);
    };
    load();
  }, []);

  const groupByFaculty = (courses: Course[]): FacultyGroup[] => {
    const map = new Map<string, Course[]>();
    for (const course of courses) {
      const key = course.faculty || 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(course);
    }
    return Array.from(map.entries())
      .map(([faculty, courses]) => ({ faculty, courses }))
      .sort((a, b) => a.faculty.localeCompare(b.faculty));
  };

  const toggleFaculty = (faculty: string) => {
    setExpandedFaculties((prev) => {
      const next = new Set(prev);
      if (next.has(faculty)) {
        next.delete(faculty);
      } else {
        next.add(faculty);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!apsResult) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>You haven't calculated your APS yet.</Text>
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={() => router.push('/aps-calculator')}
        >
          <Text style={styles.calculateButtonText}>Calculate my APS</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const calculatedDate = new Date(apsResult.calculatedAt).toLocaleDateString();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Courses You Qualify For</Text>
      <Text style={styles.subheading}>
        Based on your APS of {apsResult.total}, calculated on {calculatedDate}
      </Text>

      <TouchableOpacity
        style={styles.recalculateLink}
        onPress={() => router.push('/aps-calculator')}
      >
        <Text style={styles.recalculateLinkText}>Recalculate my APS</Text>
      </TouchableOpacity>

      {facultyGroups.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No courses match your current APS yet.</Text>
        </View>
      ) : (
        facultyGroups.map((group) => {
          const isExpanded = expandedFaculties.has(group.faculty);
          return (
            <View key={group.faculty} style={styles.facultySection}>
              <TouchableOpacity
                style={styles.facultyHeader}
                onPress={() => toggleFaculty(group.faculty)}
              >
                <Text style={styles.facultyName}>{group.faculty}</Text>
                <Text style={styles.facultyMeta}>
                  {group.courses.length} course{group.courses.length !== 1 ? 's' : ''}
                  {'  '}
                  {isExpanded ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {isExpanded &&
                group.courses.map((course) => (
                  <View key={course.id} style={styles.courseCard}>
                    <Text style={styles.courseName}>{course.qualification}</Text>
                    <Text style={styles.courseMeta}>
                      {course.qualification_type} · {course.duration}
                      {course.minimum_aps != null ? ` · APS ${course.minimum_aps}+` : ''}
                    </Text>
                  </View>
                ))}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subheading: { fontSize: 14, color: '#666', marginBottom: 12 },
  recalculateLink: { marginBottom: 16 },
  recalculateLinkText: { color: '#1E88E5', fontWeight: '600' },
  emptyText: { fontSize: 15, textAlign: 'center', color: '#666', marginBottom: 16 },
  calculateButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  calculateButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  facultySection: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  facultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  facultyName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', flex: 1 },
  facultyMeta: { fontSize: 13, color: '#E3F2FD' },
  courseCard: {
    backgroundColor: '#F5F5F5',
    marginTop: 8,
    padding: 15,
    borderRadius: 10,
  },
  courseName: { fontSize: 16, fontWeight: '600', color: '#000' },
  courseMeta: { fontSize: 13, color: '#666', marginTop: 4 },
});