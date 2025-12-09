import ScreenHeader from '@/components/ui/ScreenHeader';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';


export default function EditMedicationScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const create_medicine = () => {
  
    // Aquí tendría mi función para tomar los datos y crear la medicina SI SUPIERA COMO HACERLO EXIS DEDEDE
    router.back();  
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Crear Medicamento"/>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.placeholderText}>
          <View style={styles.big_container}>
            <StyledTextInput 
              label="Nombre de la medicina" 
              placeholder="Ejemplo: Parasetamol." 
              value={name}
              onChangeText={setName} 
              autoCapitalize="none"
            />
            <StyledTextInput 
              label="Descripción" 
              placeholder="Puede ser para que sirve o alguna advertencia." 
              secureTextEntry 
              value={description}
              onChangeText={setDescription} 
              autoCapitalize="none"
            />
          </View>
        </Text>
        <StyledButton title="Guardar Medicamento" onPress={() => {create_medicine()}} />
      </ScrollView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, gap: 15 },
  big_container: { padding: 20, gap: 15, width: '80%' },
  placeholderText: { textAlign: 'center', color: Colors.textLight, paddingVertical: 40 },
});