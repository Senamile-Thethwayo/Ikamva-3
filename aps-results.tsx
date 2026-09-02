// app/aps-results.tsx
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const getQualificationMessage = (total: number): string => {
  if (total >= 35) return "Qualifies for most Bachelor's degree programmes.";
  if (total >= 26) return 'Qualifies for Diploma-level study.';
  if (total >= 21) return 'Qualifies for Higher Certificate-level study.';
  return 'May not meet minimum APS requirements — check specific institution requirements.';
};

export default function ApsResultsScreen() {
  const { total, breakdown } = useLocalSearchParams<{
    total: string;
    breakdown: string;
  }>();

  const parsedBreakdown: { subject: string; mark: number; points: number }[] =
    JSON.parse(breakdown);
  const totalScore = parseInt(total, 10);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.score}>{totalScore}</Text>
      <Text style={styles.scoreLabel}>Total APS Score</Text>

      <View style={styles.breakdown}>
        {parsedBreakdown.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.points}>{item.mark}% → {item.points} pts</Text>
          </View>
        ))}
      </View>

      <View style={styles.message}>
        <Text style={styles.messageText}>{getQualificationMessage(totalScore)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  score: { fontSize: 48, fontWeight: 'bold', textAlign: 'center' },
  scoreLabel: { fontSize: 16, textAlign: 'center', marginBottom: 24, color: '#666' },
  breakdown: { marginBottom: 24 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subject: { fontSize: 14 },
  points: { fontSize: 14, fontWeight: '600' },
  message: { backgroundColor: '#f0f8ff', padding: 16, borderRadius: 8 },
  messageText: { fontSize: 15, textAlign: 'center' },
});
