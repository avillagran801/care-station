// ...existing code...
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { groupsApi } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
    const router = useRouter();
    const { onLogin } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [familyCode, setFamilyCode] = useState('');

    const findFamiliarGroup = async () => {
      setIsLoading(true);
      try {
        const response = await groupsApi.findGroup({ code: familyCode });
        // Aquí puedes manejar la respuesta, por ejemplo, navegar al grupo encontrado
        Toast.show({
          type: 'success',
          text1: 'Grupo encontrado',
          text2: 'Has sido añadido al grupo familiar exitosamente.'
        });
        router.replace('/select-group');
      } catch (error) {
        console.error('Error finding family group:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo encontrar el grupo familiar. Verifica el código e intenta de nuevo.'
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
          <Text style={styles.title}>Invitación al grupo familiar</Text>

        <View style={styles.container}>
          <StyledTextInput 
            label="Ingrese el código de invitación para unirte a tu grupo familiar" 
            placeholder="------" 
            keyboardType="email-address"
            value={familyCode}
            onChangeText={setFamilyCode} 
            autoCapitalize="none"
          />
        </View>

        <StyledButton 
            title={isLoading ? 'Buscando...' : 'Buscar grupo familiar'} 
            onPress={findFamiliarGroup} 
            disabled={isLoading}
        />
        
        <Link href="/select-group" asChild>
        <Text style={styles.linkText2}>Volver atras</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
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