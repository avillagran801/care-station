import CustomSafeArea from '@/components/ui/CustomSafeArea';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StyledButton from '@/components/ui/StyledButton';
import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text } from 'react-native';

export default function EditMedicationScreen() {
  const { id } = useLocalSearchParams(); 
  return (
    <CustomSafeArea>
      <ImageBackground
              source={require('@/assets/images/background2.jpg')}
              resizeMode="cover"
              style={styles.backgroundImage}
      >
        <ScreenHeader title="Editar Medicamento" />
        <ScrollView contentContainerStyle={styles.container}>
          <Text>Editando medicamento con ID: {id}</Text>
          <Text style={styles.placeholderText}>[Formulario de edición para el medicamento...]</Text>
          <StyledButton title="Guardar cambios" onPress={() => {}} />
          <StyledButton title="Eliminar" variant="secondary" onPress={() => {}} style={{ marginTop: 10, backgroundColor: '#fee2e2' }} />
        </ScrollView>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%'},
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, gap: 15 },
  placeholderText: { textAlign: 'center', color: Colors.textLight, paddingVertical: 40 },
});