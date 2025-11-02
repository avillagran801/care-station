import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';


export default function LoginScreen() {
    const router = useRouter();

    // Colores para el degradado del botón
    const buttonGradientColors = [Colors.primaryDark, Colors.primary] as const;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.fullScreen}>
                <Image 
                    source={require('../../assets/images/background2.jpg')} 
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />
                
                <LinearGradient
                    colors={['rgba(255, 250, 250, 0.5)', 'rgba(255, 250, 250, 0.3)', 'transparent']} // De oscuro a transparente
                    style={styles.gradientOverlay}
                />

                {/* El Contenedor Principal del Formulario */}
                <View style={styles.container}>
                    <View style={styles.card}>
                        <Image 
                            source={require('../../assets/images/logo.png')} 
                            style={styles.logo}
                        />
                        <Text style={styles.title}>¡Bienvenid@!</Text>
                        <Text style={styles.subtitle}>Inicia sesión para acceder</Text>

                        <View style={styles.formContainer}>
                            <StyledTextInput label="Correo electrónico" placeholder="tu@email.com" keyboardType="email-address"  />
                            <StyledTextInput label="Contraseña" placeholder="********" secureTextEntry />
                        </View>

                        {/* Botón Principal con Degradado */}
                        <LinearGradient
                            colors={buttonGradientColors}
                            style={styles.gradientButtonWrapper} 
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <StyledButton 
                                title="Iniciar sesión" 
                                onPress={() => router.replace('/(tabs)')} 
                                style={styles.transparentButton}
                            />
                        </LinearGradient>

                        <Link href="/(auth)/forgot-password" asChild>
                            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                        </Link>
                    </View>
                    
                    {/* Botón de Registro abajo del todo */}
                    <View style={styles.registerContainer}>
                        <StyledButton 
                            title="Crea una nueva cuenta" 
                            variant="secondary"
                            onPress={() => router.push('/(auth)/register')}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1,
    },
    fullScreen: {
        flex: 1,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    gradientOverlay: { 
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    card: { 
        backgroundColor: 'rgba(255, 255, 255, 0.45)', 
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 400, 
        alignItems: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 'auto', 
        marginTop: 50, 
    },
    logo: {
        width: 160, 
        height: 160, 
        resizeMode: 'contain', 
        marginBottom: 10, 
    },
    title: {
        fontSize: 28,
        fontFamily: 'Poppins-Bold',
        color: Colors.primaryDark, 
        textAlign: 'center',
        marginTop: -10,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.grey, 
        textAlign: 'center',
        marginBottom: 25,
      
    },
    formContainer: {
        width: '100%',
        marginBottom: 20,
    },
    // Estilos para el botón con degradado
    gradientButtonWrapper: {
        width: 200,
        marginTop: 10,
        borderRadius: 30, 
    },
    transparentButton: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingVertical: 15,
        fontFamily: 'Poppins-Medium',
    },
    linkText: {
        color: Colors.primaryDark,
        marginTop: 15,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    registerContainer: {
        marginTop: 'auto', 
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 24, 
        marginBottom: 20,
    }
});