import ScreenHeader from '@/components/ui/ScreenHeader';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useEditItem } from '@/context/EditContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

export default function EditMedicationScreen() {
  const router = useRouter();
  const { selectedItem } = useEditItem();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name || '');
      setDescription(selectedItem.description || '');
    }
  }, [selectedItem]);

  const edit_medication = () => {
  
    // Aquí tendría mi función para tomar los datos y crear la medicina SI SUPIERA COMO HACERLO EXIS DEDEDE
    router.back();  
  }

  const delete_medication = () => {
  
    // Aquí tendría mi función para tomar los datos y crear la medicina SI SUPIERA COMO HACERLO EXIS DEDEDE
    router.back();  
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Editar Medicamento" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Editando medicamento con ID: {selectedItem?.id}</Text>
        <Text style={styles.placeholderText}>
            <StyledTextInput 
              label="Nombre de la medicina" 
              placeholder="Ejemplo: Parasetamol" 
              value={name}
              onChangeText={setName} 
              autoCapitalize="none"
            />
            <StyledTextInput 
              label="Descripción" 
              placeholder="Cada cuanto y que tanto debe tomar" 
              value={description}
              onChangeText={setDescription} 
              autoCapitalize="none"
            />
        </Text>
        <StyledButton title="Guardar cambios" onPress={() => {edit_medication()}} />
        <StyledButton title="Eliminar" variant="secondary" onPress={() => {delete_medication()}} style={{ marginTop: 10, backgroundColor: '#fee2e2' }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, gap: 15 },
  placeholderText: { textAlign: 'center', color: Colors.textLight, paddingVertical: 40 },
});