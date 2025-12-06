import ScreenHeader from '@/components/ui/ScreenHeader';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const mockMedications = [
  { id: 'med1', name: 'Metformina', description: 'Todos los dias 8:00 AM - 12:00PM' },
  { id: 'med2', name: 'Losartán', description: 'Todos los dias 10:00 AM' },
];

export default function MedicationsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Medicamentos"  has_add={true} actual_link="medication" />
      <ScrollView contentContainerStyle={styles.container}>
        {mockMedications.map(med => (
          <View key={med.id} style={styles.card}>
            <View>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.medDescription}>{med.description}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push(`./edit-medication?id=${med.id}`)}>
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
  medName: { fontSize: 16, fontWeight: 'bold' },
  medDescription: { fontSize: 14, color: Colors.textLight, marginTop: 4 },
});