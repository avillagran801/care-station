import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { careGroupApi, patientsApi } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';


export default function CreateGroupScreen() {
  const router = useRouter();

  // Grupo
  const [groupName, setGroupName] = useState('');

  // Paciente
  const [patientNames, setPatientNames] = useState('');
  const [patientSurnames, setPatientSurnames] = useState('');
  const [patientCellphone, setPatientCellphone] = useState('');
  const [patientTelephone, setPatientTelephone] = useState('');
  const [patientAddress, setPatientAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName || !patientNames) {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Debes ingresar el nombre del grupo y del paciente.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // CREAR GRUPO
      const groupResponse = await careGroupApi.create({
        group_name: groupName,
        photo_url: null,
        patient_names: patientNames,
      });

      const care_group_id = groupResponse.data?.group?.care_group_id ?? groupResponse.data?.care_group_id;
      
      // CREAR PACIENTE ASOCIADO
      await patientsApi.create({
        care_group_id,
        names: patientNames,
        surnames: patientSurnames || null,
        cellphone: patientCellphone || null,
        telephone: patientTelephone || null,
        address: patientAddress || null,
      });

      Toast.show({
        type: 'success',
        text1: 'Grupo creado',
        text2: 'Grupo y paciente creados correctamente.',
      });

      router.replace('/(tabs)');

    } catch (error: any) {
        console.log(error);
      let message = 'Error al crear el grupo.';

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        message = errors[firstKey][0];
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });

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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Crear Grupo</Text>

            <View style={styles.formContainer}>
              <StyledTextInput 
                label="Nombre del grupo" 
                placeholder="Ej: Familia Medina" 
                value={groupName}
                onChangeText={setGroupName}
              />

              <StyledTextInput 
                label="Nombres del paciente" 
                placeholder="Ej: Juan" 
                value={patientNames}
                onChangeText={setPatientNames}
              />

              <StyledTextInput 
                label="Apellidos del paciente" 
                placeholder="Ej: Pérez" 
                value={patientSurnames}
                onChangeText={setPatientSurnames}
              />

              <StyledTextInput 
                label="Celular" 
                keyboardType="phone-pad"
                value={patientCellphone}
                onChangeText={setPatientCellphone}
              />

              <StyledTextInput 
                label="Teléfono" 
                keyboardType="phone-pad"
                value={patientTelephone}
                onChangeText={setPatientTelephone}
              />

              <StyledTextInput 
                label="Dirección" 
                value={patientAddress}
                onChangeText={setPatientAddress}
              />
            </View>

            <View style={{ marginTop: 15, width: '100%' }}>
              <StyledButton 
                title={isLoading ? 'Creando...' : 'Crear grupo'} 
                onPress={handleCreateGroup} 
                disabled={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { 
    flex: 1, 
    width: '100%' 
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center' 
  },
  container: {
    alignItems: 'center', 
    padding: 24, 
    alignSelf: 'center', 
    width: '100%',
    maxWidth: 420, 
    backgroundColor: 'rgba(255, 255, 255, 0.43)', 
    borderRadius: 20,
    marginVertical: 20
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: 0,
  },
  formContainer: { 
    borderRadius: 20,
    padding: 20,
    height: 'auto',
    width: '100%',
    maxWidth: 480,
    fontFamily: 'Poppins-Regular',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
    alignSelf: 'center',
    marginTop: 20 
  },
});
