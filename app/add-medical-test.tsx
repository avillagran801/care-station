import ScreenHeader from '@/components/ui/ScreenHeader';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';


export default function EditMedicationScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [URL, setURL] = useState('');
  const create_medical_test = () => {
  
    // Aquí tendría mi función para tomar los datos y crear la medicina SI SUPIERA COMO HACERLO EXIS DEDEDE
    router.back();  
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Crear Examen Médico"/>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.placeholderText}>
          <StyledTextInput 
            label="Nombre del examen médico" 
            placeholder="Ejemplo: Chequeo general de sangre" 
            value={name}
            onChangeText={setName} 
            autoCapitalize="none"
          />
          <StyledTextInput 
            label="Descripción" 
            placeholder="Puede ser donde se realizó, en que consistía o para qué era." 
            secureTextEntry 
            value={description}
            onChangeText={setDescription} 
            autoCapitalize="none"
          />
          <StyledTextInput 
            label="Fecha de emisión" 
            placeholder="DD/MM/AAAA" 
            secureTextEntry 
            value={date}
            onChangeText={setDate} 
            autoCapitalize="none"
          />
          <StyledTextInput 
            label="URL del Documento/Resultados" 
            placeholder="https://www.URLdelDocumento.com" 
            secureTextEntry 
            value={URL}
            onChangeText={setURL} 
            autoCapitalize="none"
          />
        </Text>
        <StyledButton title="Guardar Medicamento" onPress={() => {create_medical_test()}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, gap: 15 },
  placeholderText: { textAlign: 'center', color: Colors.textLight, paddingVertical: 40 },
});