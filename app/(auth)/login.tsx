import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();

    return (
    <CustomSafeArea>
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
          <StyledTextInput label="Correo electrónico" placeholder="tu@email.com" keyboardType="email-address"   />
          <StyledTextInput label="Contraseña" placeholder="********" secureTextEntry />
        </View>

        <StyledButton title="Iniciar sesión" onPress={() => router.replace('/(tabs)')} />
        <Link href="/(auth)/forgot-password" asChild>
           <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </Link>
        
        <View style={{ marginTop: 60, width: '100%', maxWidth: 300, alignItems: 'center' }}>
            <StyledButton 
                title="Crea una nueva cuenta" 
                variant="secondary"
                onPress={() => router.push('/(auth)/register')}
            />
        </View>
        </View>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
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
    width: 100, 
    height: 100, 
    resizeMode: 'contain', 
    marginBottom: 0, 
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: 0,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 10,
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