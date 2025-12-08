import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

// Datos de Usuario de ejemplo
const mockUser = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '569 1234 5678',
    photoUrl: null, 
};

export default function EditProfileScreen() {
    const [firstName, setFirstName] = useState(mockUser.firstName);
    const [lastName, setLastName] = useState(mockUser.lastName);
    const [email, setEmail] = useState(mockUser.email);
    const [phone, setPhone] = useState(mockUser.phone);
    const [photoUrl, setPhotoUrl] = useState(mockUser.photoUrl);
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveChanges = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            Toast.show({ type: 'success', text1: '¡Éxito!', text2: 'Perfil actualizado correctamente.' });
        }, 1500);
    };

    const handlePickImage = () => {
        Toast.show({ type: 'info', text1: 'Función en progreso', text2: 'Selector de imagen de perfil.' });
    };
    

    const renderSaveButton = () => (
        <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSaveChanges}
            disabled={isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
            ) : (
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <CustomSafeArea>
            <ImageBackground 
                source={require('../assets/images/background2.jpg')} 
                resizeMode="cover"
                style={styles.backgroundImage}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    
                    {/* Contenedor Principal (la tarjeta opaca) */}
                    <View style={styles.formCard}> 
                        
                        <Text style={styles.title}>Editar Mi Perfil</Text>

                        {/* 1. Selector de Imagen de Perfil Estilizado */}
                        <TouchableOpacity style={styles.avatarPicker} onPress={handlePickImage}>
                            <View style={styles.userAvatarWrapper}>
                                {photoUrl ? (
                                    <Image source={{ uri: photoUrl }} style={styles.userAvatar} />
                                ) : (
                                    <Ionicons name="person" size={70} color={Colors.primary} />
                                )}
                            </View>
                            <View style={styles.cameraIconContainer}>
                                <Ionicons name="camera" size={18} color={Colors.white} />
                            </View>
                        </TouchableOpacity>

                        {/* 2. Formulario de Datos */}
                        <View style={styles.formContainerInputs}>
                            <StyledTextInput
                                label="Nombre"
                                placeholder="Tu nombre"
                                leftIcon="person-outline"
                                value={firstName}
                                onChangeText={setFirstName}
                                autoCapitalize="words"
                            />
                            <StyledTextInput
                                label="Apellido"
                                placeholder="Tu apellido"
                                leftIcon="person-outline"
                                value={lastName}
                                onChangeText={setLastName}
                                autoCapitalize="words"
                            />
                            <StyledTextInput
                                label="Correo Electrónico"
                                placeholder="tu@email.com"
                                leftIcon="mail-outline"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                editable={false} 
                                style={styles.disabledInput}
                            />
                            <StyledTextInput
                                label="Teléfono"
                                placeholder="Ej: 569 1234 5678"
                                leftIcon="call-outline"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                        {/* 3. Botón de Guardar */}
                        {renderSaveButton()}

                    </View>

                </ScrollView>
            </ImageBackground>
        </CustomSafeArea>
    );
}


const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1, 
        width: '100%',
        height: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        width: '100%',
    },
    
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: 20, 
        padding: 30,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
    },
    
    title: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold', 
        color: Colors.primaryDark || '#007AFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    
    avatarPicker: {
        marginBottom: 25,
        position: 'relative',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatarWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.primary || '#007AFF',
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    userAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary || '#007AFF',
        borderRadius: 15,
        padding: 5,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    
    formContainerInputs: { 
        width: '100%', 
        marginBottom: 20, 
        fontFamily: 'Poppins-Regular',
    },
    disabledInput: { 
        opacity: 0.6, 
        backgroundColor: '#F0F0F0', 
        fontFamily: 'Poppins-Regular',
    },
    saveButton: {
        width: '100%',
        height: 50,
        marginTop: 20,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary || '#007AFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    saveButtonDisabled: {
        backgroundColor: '#AAAAAA',
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
    }
});