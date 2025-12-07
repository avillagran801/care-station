// ...existing code...
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { groupsApi } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function FindGroupScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [familyCode, setFamilyCode] = useState('');

  const joinFamiliarGroup = async () => {
    if (!familyCode.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Falta el código',
        text2: 'Por favor ingresa un código de invitación.'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Llamamos al endpoint de unirse
      await groupsApi.joinGroup({ code: familyCode.trim() });

      Toast.show({
        type: 'success',
        text1: '¡Te has unido!',
        text2: 'Ahora eres parte del grupo familiar.'
      });

      // Redirigir a select-group para que se recargue la lista
      router.replace('/(group)/select-group');
    } catch (error: any) {
      console.error('Error joining group:', error);

      let message = 'No se pudo encontrar el grupo. Verifica el código.';
      if (error.response?.status === 409) { // Conflicto (ya es miembro)
        message = 'Ya eres miembro de este grupo.';
      } else if (error.response?.status === 400) { // Código expirado
        message = 'El código ha expirado o es inválido.';
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
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
        <View style={styles.formContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Unirse a un grupo</Text>
          <Text style={styles.subtitle}>Pide al administrador del grupo que te comparta el código de invitación.</Text>

          <View style={styles.container}>
            <StyledTextInput
              label="Código de invitación"
              placeholder="Ej: X7K9P2"
              value={familyCode}
              onChangeText={(text) => setFamilyCode(text.toUpperCase())} // Auto mayúsculas
              autoCapitalize="characters"
            />
          </View>

          <StyledButton
            title={isLoading ? 'Uniéndose...' : 'Unirse al grupo'}
            onPress={joinFamiliarGroup}
            disabled={isLoading}
          />

          <Link href="/select-group" asChild>
            <Text style={styles.linkText2}>Volver atrás</Text>
          </Link>

        </View>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
    alignSelf: 'center',
    width: '90%',
    height: 'auto',
    marginBottom: 30,
    borderRadius: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 1,
  },
  formContainer: {
    borderRadius: 20,
    padding: 20,
    height: 'auto',
    width: '90%',
    maxWidth: 480,

    fontFamily: 'Poppins-Regular',
    //flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  linkText: {
    color: Colors.grey,
    fontWeight: 'bold',
    marginTop: 30,
    fontFamily: 'Poppins-Medium',
  },

  linkText2: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginTop: 30,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});