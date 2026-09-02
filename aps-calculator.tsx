// app/aps-calculator.tsx
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MASTER_SUBJECT_LIST, NUM_SUBJECT_SLOTS } from './constants/subjects';
import { getApsPoints } from './db/Database'; // capital D — matches your actual filename
import { saveApsResult } from './utils/apsStorage';

type SubjectEntry = { subject: string; mark: string };

export default function ApsCalculatorScreen() {
  const [slots, setSlots] = useState<SubjectEntry[]>(
    Array.from({ length: NUM_SUBJECT_SLOTS }, () => ({ subject: '', mark: '' }))
  );

  const updateSlot = (index: number, field: 'subject' | 'mark', value: string) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleCalculate = () => {
    const breakdown: { subject: string; mark: number; points: number }[] = [];
    let total = 0;

    for (const slot of slots) {
      if (!slot.subject) {
        Alert.alert('Missing subject', 'Please select a subject for every slot.');
        return;
      }
      const mark = parseInt(slot.mark, 10);
      if (isNaN(mark) || mark < 0 || mark > 100) {
        Alert.alert('Invalid mark', `Please enter a valid mark for ${slot.subject}.`);
        return;
      }
      const points = getApsPoints(mark); // synchronous, no await needed
      breakdown.push({ subject: slot.subject, mark, points });
      total += points;
    }

    // NEW — persist so any screen (not just aps-results) can check eligibility later
    saveApsResult(total, breakdown);

    router.push({
      pathname: '/aps-results',
      params: { total: total.toString(), breakdown: JSON.stringify(breakdown) },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>APS Calculator</Text>
      {slots.map((slot, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.label}>Subject {index + 1}</Text>
          <Picker
            selectedValue={slot.subject}
            onValueChange={(value) => updateSlot(index, 'subject', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a subject..." value="" />
            {MASTER_SUBJECT_LIST.map((subject) => (
              <Picker.Item key={subject} label={subject} value={subject} />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={3}
            placeholder="%"
            value={slot.mark}
            onChangeText={(value) => updateSlot(index, 'mark', value)}
          />
        </View>
      ))}
      <Button title="Calculate APS" onPress={handleCalculate} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  row: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 4, fontWeight: '600' },
  picker: { backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});