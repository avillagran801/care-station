import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

// Definición de las Props
interface StyledTextInputProps extends TextInputProps {
    label: string;
    // La prop leftIcon es opcional y usa el mapa de glifos de Ionicons
    leftIcon?: keyof typeof Ionicons.glyphMap; 
}

export default function StyledTextInput({ label, leftIcon, style, ...props }: StyledTextInputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            
            {/* Contenedor principal para el campo de entrada y el icono */}
            <View style={styles.inputWrapper}>
                
                {/* 1. Icono Izquierdo */}
                {leftIcon && (
                    <Ionicons 
                        name={leftIcon} 
                        size={20} 
                        color={Colors.grey || '#888'} // Color gris sutil
                        style={styles.iconStyle}
                    />
                )}
                
                {/* 2. Campo de Entrada de Texto */}
                <TextInput
                    style={[styles.input, style]} // Permitimos pasar estilos externos
                    placeholderTextColor={Colors.grey}
                    {...props}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 15,
        fontFamily: 'Poppins-Regular',
    },
    label: {
        color: Colors.black,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    // NUEVO: Wrapper que contiene el icono y el TextInput
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center', // Alinea el icono y el texto verticalmente
        backgroundColor: Colors.white,
        borderRadius: 15,
        paddingHorizontal: 16,
        borderWidth: 1, // Borde sutil
        borderColor:'#E0E0E0', 
    },
    // Estilo para el icono
    iconStyle: {
        marginRight: 10,
    },
    // Modificado: El TextInput ahora toma 'flex: 1' para ocupar el espacio
    input: {
        flex: 1, // ¡Crucial! Hace que el input ocupe el espacio restante
        backgroundColor: Colors.white, // Mantenemos el fondo (aunque ya está en el wrapper)
        paddingVertical: 12, // Mantenemos el padding vertical
        // Eliminamos paddingHorizontal aquí, ya lo maneja el inputWrapper
        paddingHorizontal: 0, 
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
});