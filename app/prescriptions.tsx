import ScreenHeader from '@/components/ui/ScreenHeader';
import Colors from '@/constants/Colors';
import { useEditItem } from '@/context/EditContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockExam = [
  { id: 'pre1', name: 'Amoxicilina 500 mg', description: 'Antibióticos para bacterias', emmision_date: '1 de diciembre de 2025', file_url: 'https://www.amoxicilina.com' },
  { id: 'pre2', name: 'Ibuprofeno 400 mg', description: 'Analgésico y antiinflamatorio utilizado para aliviar dolor moderado (no usar en exceso).', emmision_date: '20 de noviembre de 2025', file_url: 'https://www.atencion-sopa.cl' },
];

export default function MedicationsScreen() {
  const router = useRouter();
  const { setSelectedItem } = useEditItem();

  const handleEditPrescription = (pre: any) => {
    setSelectedItem(pre);
    router.push(`./edit-prescription?id=${pre.id}`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Prescripciones"  has_add={true} actual_link="prescription" />
      <ScrollView contentContainerStyle={styles.container}>
        {mockExam.map(pre => (
          <View key={pre.id} style={styles.card}>
            <View>
              <Text style={styles.examName}>{pre.name}</Text>
              <Text style={styles.examSchedule}>{pre.description}</Text>
              <Text style={styles.examEmitionDate}>{pre.emmision_date}</Text>
              <Text style={styles.examFileURL}>{pre.file_url}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEditPrescription(pre)}>
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