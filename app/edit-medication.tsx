import ScreenHeader from '@/components/ui/ScreenHeader';
import StyledButton from '@/components/ui/StyledButton';
import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

export default function EditMedicationScreen() {
  const { id } = useLocalSearchParams(); 
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Editar Medicamento" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Editando medicamento con ID: {id}</Text>
        <Text style={styles.placeholderText}>[Formulario de edición para el medicamento...]</Text>
        <StyledButton title="Guardar cambios" onPress={() => {}} />
        <StyledButton title="Eliminar" variant="secondary" onPress={() => {}} style={{ marginTop: 10, backgroundColor: '#fee2e2' }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, gap: 15 },
  placeholderText: { textAlign: 'center', color: Colors.textLight, paddingVertical: 40 },
});