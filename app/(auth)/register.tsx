import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

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
        Toast.show({
            type: 'error',
            text1: 'Campos incompletos',
            text2: 'Por favor, llena todos los campos obligatorios.'
        });
        return;
    }

    if (password !== confirmPassword) {
        Toast.show({
            type: 'error',
            text1: 'Error de contraseña',
            text2: 'Las contraseñas no coinciden.'
        });
        return;
    }

    if (password.length < 8) {
        Toast.show({
            type: 'info',
            text1: 'Contraseña débil',
            text2: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return;
    }

    setIsLoading(true);

    try {
        const nameParts = fullName.trim().split(' ');
        let namesToSend = nameParts.length > 1 ? nameParts[0] : nameParts[0];
        let surnamesToSend = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ".";

        const payload = {
            names: namesToSend,
            surnames: surnamesToSend,
            cellphone: cellphone, 
            email: email,
            password: password,
            password_confirmation: confirmPassword,
        };

        await authApi.register(payload);
        
        Toast.show({
            type: 'success',
            text1: '¡Cuenta creada!',
            text2: 'Por favor inicia sesión con tus nuevas credenciales.',
            visibilityTime: 4000,
        });

        setTimeout(() => {
            router.replace('/(auth)/login');
        }, 1500);

    } catch (error: any) {
        let message = 'Ocurrió un error al registrarse.';
        
        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            const firstField = Object.keys(errors)[0]; // ej: 'email'
            const firstErrorMessage = errors[firstField][0]; // ej: 'The email has already been taken.'
            
            if(firstField === 'email') message = 'Este correo electrónico ya está registrado.';
            else message = `${firstField}: ${firstErrorMessage}`;

        } else if (error.response?.data?.message) {
            message = error.response.data.message;
        }
        
        Toast.show({
            type: 'error',
            text1: 'Error de registro',
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
            <Text style={styles.title}>Crear Cuenta</Text>
            
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

            <StyledButton 
                title={isLoading ? "Registrando..." : "Registrarse"} 
                onPress={handleRegister} 
                disabled={isLoading}
            />
            
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
    fontSize: 28, 
    fontWeight: 'bold', 
    color: Colors.primaryDark, 
    textAlign: 'center', 
    marginVertical: 10 
  },
  formContainer: { 
    backgroundColor: Colors.primary, 
    borderRadius: 20, 
    padding: 20, 
    width: '100%', 
    marginTop: 20, 
    marginBottom: 30 
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
    marginTop: 10 
  },
  linkText: { 
    color: Colors.text 
  },
  loginLink: { 
    color: Colors.primary, 
    fontWeight: 'bold' 
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