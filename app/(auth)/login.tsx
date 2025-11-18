import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { authApi } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    
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
            
            // Suponiendo que el backend devuelve un token al iniciar sesión
            console.log('Login exitoso:', response.data);
            
            // Aquí deberías guardar el token de autenticación de forma segura
            // Por ejemplo: await AsyncStorage.setItem('userToken', response.data.token);

            router.replace('/(tabs)');

        } catch (error: any) {
            console.error('Error en el login:', error.response?.data || error.message);
            Alert.alert('Error de inicio de sesión', error.response?.data?.message || 'No se pudo conectar con el servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('../../assets/images/background2.jpg')} 
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
          />
        <Text style={styles.title}>¡Bienvenid@!</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <View style={styles.formContainer}>
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
        
        <View style={{ marginTop: 'auto', width: '100%', maxWidth: 300, alignItems: 'center' }}>
            <StyledButton 
                title="Crea una nueva cuenta" 
                variant="secondary"
                onPress={() => router.push('/(auth)/register')}
            />
        </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
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
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,   
  },
  logo: {
    width: 200, 
    height: 200, 
    resizeMode: 'contain', 
    marginBottom: 0, 
  },
  title: {
    fontSize: 32,
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
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 480,
    marginBottom: 30,
    fontFamily: 'Poppins-Regular',
  },
  linkText: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginTop: 15,
  },
});