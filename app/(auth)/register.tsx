import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

{ /* Solo es una maqueta, no esta conectado a nada, solo funciona el boton de iniciar sesion, para redirigir a login */ }
export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
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
    color: Colors.textLight,
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