import ScreenHeader from '@/components/ui/ScreenHeader';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';

import Colors from '@/constants/Colors';
import { medicationApi } from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, Platform, ScrollView, StyleSheet, View } from 'react-native'; // <--- Importar Platform
import Toast from 'react-native-toast-message';

export default function EditMedicationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadMedication();
  }, [id]);

  const loadMedication = async () => {
    try {
        const response = await medicationApi.getOne(Number(id));
        setName(response.data.name);
        setDescription(response.data.description || '');
    } catch (error) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo cargar la información.' });
        router.back();
    } finally {
        setLoadingData(false);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return;

    setIsSaving(true);
    try {
        await medicationApi.update(Number(id), { name, description });
        Toast.show({ type: 'success', text1: 'Actualizado', text2: 'Medicamento modificado correctamente.' });
        router.back();
    } catch (error) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo actualizar.' });
    } finally {
        setIsSaving(false);
    }
  };

  // --- LÓGICA DE ELIMINACIÓN CORREGIDA ---
  
  // 1. La función que realmente llama a la API
  const performDelete = async () => {
    try {
        await medicationApi.delete(Number(id));
        Toast.show({ type: 'success', text1: 'Eliminado', text2: 'Medicamento eliminado.' });
        router.back();
    } catch (error) {
        console.error(error);
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo eliminar.' });
    }
  };

  // 2. La función que maneja la confirmación (Web vs Movil)
  const handleDelete = () => {
    if (Platform.OS === 'web') {
        // En WEB usamos window.confirm
        const confirm = window.confirm("¿Estás seguro de que deseas eliminar este medicamento? Esta acción no se puede deshacer.");
        if (confirm) {
            performDelete();
        }
    } else {
        // En MOVIL usamos Alert.alert
        Alert.alert(
            "Eliminar Medicamento",
            "¿Estás seguro? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: performDelete // Llamamos a la función auxiliar
                }
            ]
        );
    }
  };

  if (loadingData) {
      return (
          <CustomSafeArea>
              <ActivityIndicator size="large" style={{ marginTop: 50 }} />
          </CustomSafeArea>
      );
  }

  return (
    <CustomSafeArea>
      <ImageBackground 
        source={require('../assets/images/background2.jpg')} 
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <ScreenHeader title="Editar Medicamento" />
        <ScrollView contentContainerStyle={styles.container}>
            
            <StyledTextInput 
                label="Nombre del medicamento" 
                value={name}
                onChangeText={setName}
            />

            <StyledTextInput 
                label="Indicaciones / Descripción" 
                value={description}
                onChangeText={setDescription}
                multiline
                style={{ height: 100, textAlignVertical: 'top' }}
            />

            <View style={{ marginTop: 20, gap: 15 }}>
                <StyledButton 
                    title={isSaving ? "Guardando..." : "Guardar Cambios"} 
                    onPress={handleUpdate} 
                    disabled={isSaving}
                />
                
                <StyledButton 
                    title="Eliminar Medicamento" 
                    variant="secondary" 
                    onPress={handleDelete} 
                    style={{ backgroundColor: '#fee2e2' }}
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
