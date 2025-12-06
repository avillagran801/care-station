import ScreenHeader from '@/components/ui/ScreenHeader';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const mockExam = [
  { id: 'exam1', name: 'Hemograma completo', description: 'Evaluación de Glóbulos Rojos', emmision_date: '15 de noviembre de 2025', file_url: 'https://www.hemograma.com' },
  { id: 'exam2', name: 'Radiografía de tórax', description: 'Revisión de rayos X de la zona del torax', emmision_date: '25 de noviembre de 2025', file_url: 'https://www.torax.cl' },
];

export default function MedicationsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Exámenes Médicos"  has_add={true} actual_link="medical-test" />
      <ScrollView contentContainerStyle={styles.container}>
        {mockExam.map(med => (
          <View key={med.id} style={styles.card}>
            <View>
              <Text style={styles.examName}>{med.name}</Text>
              <Text style={styles.examSchedule}>{med.description}</Text>
              <Text style={styles.examEmitionDate}>{med.emmision_date}</Text>
              <Text style={styles.examFileURL}>{med.file_url}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push(`./edit-medical-test?id=${med.id}`)}>
              <Ionicons name="create-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, gap: 15 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, padding: 20, borderRadius: 15 },
  examName: { fontSize: 16, fontWeight: 'bold' },
  examSchedule: { fontSize: 14, color: Colors.textLight, marginTop: 4 },
  examEmitionDate: { fontSize: 14, color: Colors.textLight, marginTop: 4 },
  examFileURL: { fontSize: 14, color: Colors.textLight, marginTop: 4 },
});