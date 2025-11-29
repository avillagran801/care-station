import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { groupsApi, patientApi } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import { default as React, useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { onLogin } = useAuth();

  const [nameGroup, setGroupName] = useState(''); 

  const [fullNamePatient, setNamePatient] = useState('');
  const [cellphonePatient, setCellphonePatient] = useState(''); 
  const [telephonePatient, setTelephonePatient] = useState(''); 
  const [addressPatient, setAddressPatient] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!nameGroup ) {
        Toast.show({
            type: 'error',
            text1: 'Campos incompletos',
            text2: 'Por favor, ingrese un nombre para el grupo de cuidados.'
        });
        return;
    }

    if(!fullNamePatient || !addressPatient || !cellphonePatient || !telephonePatient) {
        Toast.show({
            type: 'error',
            text1: 'Campos incompletos',
            text2: 'Por favor, complete todos los datos del paciente.'
        });
        return;
    } 

    setIsLoading(true);

    try {
        const payload_group = {
            names: nameGroup,
        };

        const groupResponse = await groupsApi.createGroup(payload_group);
        const groupId = groupResponse.data.id; // Capturar el ID del grupo creado
        
        const nameParts = fullNamePatient.trim().split(' ');
        let namesToSend = nameParts.length > 1 ? nameParts[0] : nameParts[0];
        let surnamesToSend = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ".";

        const payload_patient = {
            care_group_id: groupId,
            names: namesToSend,
            surnames: surnamesToSend,
            cellphone: cellphonePatient,
            telephone: telephonePatient,
            address: addressPatient
        };

        await patientApi.registerPatient(payload_patient);

        Toast.show({
            type: 'success',
            text1: 'Grupo creado!',
            text2: 'Ya puedes acceder a tu nuevo grupo.',
            visibilityTime: 4000,
        });

        setTimeout(() => {
            router.replace('/select-group');
        }, 1500);

    } catch (error: any) {
        let message = 'Ocurrió un error al registrar el grupo y/o el paciente.';
        
        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            const firstField = Object.keys(errors)[0]; 
            const firstErrorMessage = errors[firstField][0]; 
            
            if(firstField === 'patient_id') message = 'Este paciente ya está asociado a un Grupo Familiar.';
            else message = `${firstField}: ${firstErrorMessage}`;

        } else if (error.response?.data?.message) {
            message = error.response.data.message;
        }
        
        Toast.show({
            type: 'error',
            text1: 'Error de creación de grupo',
            text2: message
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <CustomSafeArea>
      <ImageBackground 
        source={require('../../assets/images/background2.jpg')} 
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
              <Image 
                  source={require('../../assets/images/logo.png')} 
                  style={styles.logo}
                />
            <Text style={styles.title}>Creación de Grupo Familiar</Text>
            
            <View style={styles.formContainer}>
                
                <StyledTextInput 
                    label="Nombre del grupo de cuidados" 
                    placeholder="Ej: Familia García" 
                    value={nameGroup}
                    onChangeText={setGroupName}
                />

                <StyledTextInput 
                    label="Nombre completo del paciente" 
                    placeholder="Ej: Ricardo Medina" 
                    value={fullNamePatient}
                    onChangeText={setNamePatient}
                />

                <StyledTextInput 
                    label="Celular del paciente" 
                    placeholder="+56 9 1234 5678" 
                    keyboardType="phone-pad" 
                    value={cellphonePatient}
                    onChangeText={setCellphonePatient}
                />

                <StyledTextInput 
                    label="Teléfono del paciente" 
                    placeholder="+56 2 1234 5678" 
                    keyboardType="phone-pad" 
                    value={telephonePatient}
                    onChangeText={setTelephonePatient}
                />

                <StyledTextInput 
                    label="Dirección del paciente" 
                    placeholder="Calle Principal 123, Apto 4" 
                    value={addressPatient}
                    onChangeText={setAddressPatient}
                />
            </View>

            <View style={{ marginTop: 15, width: '100%' }}>
              <StyledButton 
                  title={isLoading ? "Registrando..." : "Registrarse"} 
                  onPress={handleRegister} 
                  disabled={isLoading}
              />
            </View>
            
            <View style={styles.loginLinkContainer}>
                <Link href="/select-group" asChild>
                <Text style={styles.loginLink}>Volver atras</Text>
                </Link>
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
  
  label: {
    color: Colors.white,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  dateInput: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 50, 
  },
  
  loginLinkContainer: { 
    flexDirection: 'row', 
    marginTop: 10, 
    fontFamily: 'Poppins-Regular',
  },
  linkText: { 
    color: Colors.text,
    fontFamily: 'Poppins-Regular'
    
  },
  loginLink: { 
    color: Colors.primary, 
    fontWeight: 'bold', 
    fontFamily: 'Poppins-Medium'
  },
  webDateInputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 50,
    overflow: 'hidden',
  },
  logo: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain', 
    marginBottom: 0, 
  },
});