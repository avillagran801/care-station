import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

{ /* Solo es una maqueta, no esta conectado a nada, solo funciona el boton de "crear una nueva cuenta", para redirigir a Register */ }

export default function LoginScreen() {
    const router = useRouter();

    return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>¡Bienvenid@!</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <View style={styles.formContainer}>
          <StyledTextInput label="Correo electrónico" placeholder="tu@email.com" keyboardType="email-address" />
          <StyledTextInput label="Contraseña" placeholder="********" secureTextEntry />
        </View>

        <StyledButton title="Iniciar sesión" onPress={() => router.replace('/(tabs)')} />
        <Link href="/(auth)/forgot-password" asChild>
           <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </Link>
        
        <View style={{ marginTop: 'auto', width: '100%', alignItems: 'center' }}>
            <StyledButton 
                title="Crea una nueva cuenta" 
                variant="secondary"
                onPress={() => router.push('/(auth)/register')}
            />
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
  logo: {
    width: 200, 
    height: 200, 
    resizeMode: 'contain', 
    marginBottom: 0, 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: 0,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 30,
  },
  linkText: {
    color: Colors.primary,
    marginTop: 15,
  },
});