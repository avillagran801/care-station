import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();

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

          <View style={styles.formContainer}>
            <StyledTextInput label="Nombre" placeholder="Ricardo Medina" />
            <StyledTextInput label="Fecha de nacimiento" placeholder="01 May, 2002" />
            <StyledTextInput label="Correo electrónico" placeholder="tu@email.com" keyboardType="email-address" />
            <StyledTextInput label="Contraseña" placeholder="********" secureTextEntry />
            <StyledTextInput label="Confirmar contraseña" placeholder="********" secureTextEntry />
          </View>

          <StyledButton title="Registrarse" onPress={() => { /* Lógica de registro */ }} />
          <View style={styles.loginLinkContainer}>
            <Text style={styles.linkText}>¿Ya tienes una cuenta? </Text>
            <Link href="/(auth)/login" asChild>
              <Text style={styles.loginLink}>Iniciar sesión</Text>
            </Link>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.43)' 
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginVertical: 10,
  },
  formContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 0,
    marginBottom: 30,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  linkText: {
    color: Colors.text,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  logo: {
    width: 200, 
    height: 200, 
    resizeMode: 'contain', 
    marginBottom: 0, 
  },
});