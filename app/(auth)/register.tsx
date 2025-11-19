import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { onLogin } = useAuth();

  const [fullName, setFullName] = useState(''); 
  const [cellphone, setCellphone] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
        Alert.alert('Error', 'Por favor completa los campos obligatorios.');
        return;
    }

    if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
    }

    setIsLoading(true);

    try {
        const nameParts = fullName.trim().split(' ');
        let namesToSend = '';
        let surnamesToSend = '';

        if (nameParts.length > 1) {
            namesToSend = nameParts[0];
            surnamesToSend = nameParts.slice(1).join(' ');
        } else {
            namesToSend = nameParts[0];
            surnamesToSend = "."; 
        }

        const payload = {
            names: namesToSend,
            surnames: surnamesToSend,
            cellphone: cellphone, 
            email: email,
            password: password,
            password_confirmation: confirmPassword,
        };

        console.log("Enviando payload:", payload);

        const response = await authApi.register(payload);
        console.log("Registro exitoso:", response.data);

        const token = response.data.token || response.data.access_token;
        
        if (token) {
            await onLogin(token);
            Alert.alert('¡Bienvenido!', 'Cuenta creada exitosamente.', [
                { text: 'Continuar', onPress: () => router.replace('/(tabs)') }
            ]);
        } else {
            router.replace('/(auth)/login');
        }

    } catch (error: any) {
        console.log('--- ERROR ---');
        console.log(error.response?.data);

        let message = 'Ocurrió un error al registrarse.';
        
        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            const firstField = Object.keys(errors)[0];
            const firstErrorMessage = errors[firstField][0];
            message = `${firstField}: ${firstErrorMessage}`;
        } else if (error.response?.data?.message) {
            message = error.response.data.message;
        }
        
        Alert.alert('Error de registro', message);
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
            <Text style={styles.title}>Registro</Text>
            
            <View style={styles.formContainer}>
                <StyledTextInput 
                    label="Nombre completo" 
                    placeholder="Ej: Ricardo Medina" 
                    value={fullName}
                    onChangeText={setFullName}
                />

                <StyledTextInput 
                    label="Celular (Opcional)" 
                    placeholder="+56 9 1234 5678" 
                    keyboardType="phone-pad" 
                    value={cellphone}
                    onChangeText={setCellphone}
                />

                <StyledTextInput 
                    label="Correo electrónico" 
                    placeholder="tu@email.com" 
                    keyboardType="email-address" 
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                <StyledTextInput 
                    label="Contraseña" 
                    placeholder="********" 
                    secureTextEntry 
                    value={password}
                    onChangeText={setPassword}
                />
                <StyledTextInput 
                    label="Confirmar contraseña" 
                    placeholder="********" 
                    secureTextEntry 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
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
                <Text style={styles.linkText}>¿Ya tienes una cuenta? </Text>
                <Link href="/(auth)/login" asChild>
                <Text style={styles.loginLink}>Iniciar sesión</Text>
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
});