// ...existing code...
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';

import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { onLogin } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.login({ email, password });
            
            console.log('Login exitoso:', response.data);

            const token = response.data.token || response.data.access_token;

            if (token) {
                await onLogin(token); 
                router.replace('/(tabs)');
            } else {
                Alert.alert('Error', 'No se recibió un token válido del servidor.');
            }

        }  catch (error: any) {
            console.error('Error en el login:', error);
            const message = error.response?.data?.message || 'No se pudo conectar con el servidor.';
            Alert.alert('Error de inicio de sesión', message);
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
          <Text style={styles.title}>¡Bienvenid@!</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <View style={styles.container}>
          <StyledTextInput 
            label="Correo electrónico" 
            placeholder="tu@email.com" 
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail} 
            autoCapitalize="none"
          />
          <StyledTextInput 
            label="Contraseña" 
            placeholder="********" 
            secureTextEntry 
            value={password}
            onChangeText={setPassword} 
          />
        </View>

        <StyledButton 
            title={isLoading ? 'Iniciando...' : 'Iniciar sesión'} 
            onPress={handleLogin} 
            disabled={isLoading}
        />
        <Link href="/(auth)/forgot-password" asChild>
           <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </Link>
        
        <Link href="/(auth)/register" asChild>
          <Text style={styles.linkText2}>Crea una nueva cuenta</Text>
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
  },
  container: {
    
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
    alignSelf: 'center',
    width: '100%',
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
    width: '100%',
    maxWidth: 480,

    fontFamily: 'Poppins-Regular',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
    alignSelf: 'center',
    marginTop: 20
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