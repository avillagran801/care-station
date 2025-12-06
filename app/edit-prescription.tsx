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
  const [date, setDate] = useState('');
  const [URL, setURL] = useState('');

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name || '');
      setDescription(selectedItem.description || '');
      setDate(selectedItem.emmision_date || '');
      setURL(selectedItem.file_url || '');
    }
  }, [selectedItem]);

  const edit_prescription = () => {
  
    // Aquí tendría mi función para tomar los datos y crear la medicina SI SUPIERA COMO HACERLO EXIS DEDEDE
    router.back();  
  }

  const delete_prescription = () => {
  
    // Aquí tendría mi función para tomar los datos y crear la medicina SI SUPIERA COMO HACERLO EXIS DEDEDE
    router.back();  
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Editar Prescripción" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Editando prescripción con ID: {selectedItem?.id}</Text>
        <Text style={styles.placeholderText}>
          <StyledTextInput 
            label="Nombre de la Prescripción" 
            placeholder="Ejemplo: Ibuprofeno 300 mg" 
            value={name}
            onChangeText={setName} 
            autoCapitalize="none"
          />
          <StyledTextInput 
            label="Descripción" 
            placeholder="Puede ser donde se resetó, para qué era y cada cuanto o por cuanto tiempo se debe consumir." 
            value={description}
            onChangeText={setDescription} 
            autoCapitalize="none"
          />
          <StyledTextInput 
            label="Fecha de emisión" 
            placeholder="DD/MM/AAAA" 
            value={date}
            onChangeText={setDate} 
            autoCapitalize="none"
          />
          <StyledTextInput 
            label="URL del Documento/Resultados" 
            placeholder="https://www.URLdelDocumento.com" 
            value={URL}
            onChangeText={setURL} 
            autoCapitalize="none"
          />
        </Text>
                <StyledButton title="Guardar cambios" onPress={() => {edit_prescription()}} />
                <StyledButton title="Eliminar" variant="secondary" onPress={() => {delete_prescription()}} style={{ marginTop: 10, backgroundColor: '#fee2e2' }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, gap: 15 },
  placeholderText: { textAlign: 'center', color: Colors.textLight, paddingVertical: 40 },
});