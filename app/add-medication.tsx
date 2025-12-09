import CustomSafeArea from '@/components/ui/CustomSafeArea';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { medicationsApi } from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';


export default function AddMedicationScreen() {
  const router = useRouter();
  const { patientId } = useLocalSearchParams(); 

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
        Toast.show({ type: 'error', text1: 'Falta información', text2: 'El nombre es obligatorio.' });
        return;
    }

    if (!patientId) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se encontró el ID del paciente.' });
        return;
    }

    setIsLoading(true);
    try {
        await medicationsApi.create({
            patient_id: Number(patientId),
            name: name,
            description: description
        });

        Toast.show({ type: 'success', text1: 'Guardado', text2: 'Medicamento agregado correctamente.' });
        router.back(); 
    } catch (error) {
        console.error(error);
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo guardar el medicamento.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <CustomSafeArea>
      <ImageBackground 
              source={require('../assets/images/background2.jpg')} 
              resizeMode="cover"
              style={styles.backgroundImage}
      >
        <ScreenHeader title="Nuevo Medicamento" />
        <ScrollView contentContainerStyle={styles.container}>
            
            <StyledTextInput 
                label="Nombre del medicamento" 
                placeholder="Ej: Metformina 850mg" 
                value={name}
                onChangeText={setName}
            />

            <StyledTextInput 
                label="Indicaciones / Descripción" 
                placeholder="Ej: Tomar con el desayuno..." 
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={{ height: 100, textAlignVertical: 'top' }}
            />

            <View style={{ marginTop: 20 }}>
                <StyledButton 
                    title={isLoading ? "Guardando..." : "Guardar Medicamento"} 
                    onPress={handleSave} 
                    disabled={isLoading}
                />
            </View>

        </ScrollView>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
container: {
    marginTop: 0, 
    padding: 30, 
    paddingBottom: 10 
},
row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
},

label: { 
    color: Colors.text, 
    marginBottom: 8, 
    fontSize: 14, 
    fontWeight: '500' 
},
subLabel: { 
    color: Colors.grey, 
    marginBottom: 4, 
    fontSize: 12 
},
sectionTitle: { 
    color: Colors.text, 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 5 
},
inputContainer: { 
    marginBottom: 15, 
    width: '100%' 
},

selectorButton: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
},
selectorText: { fontSize: 14, color: Colors.text },

dateInput: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
},
webDateInputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: 50,
    overflow: 'hidden',
},
modalOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
},
modalContent: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25, 
    padding: 25, 
    paddingBottom: 40 
},
modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center', 
    color: Colors.text 
},
modalOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 15, borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
},
modalOptionText: { 
    fontSize: 16, 
    color: Colors.text 
},
backgroundImage: {
    flex: 1,
    width: '100%',
},
});
