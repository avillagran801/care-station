import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

// --- Tipificación para TypeScript ---
interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle; 
}

const GradientButton: React.FC<GradientButtonProps> = ({ title, onPress, style }) => {
  const [isPressed, setIsPressed] = useState(false);

  // Colores con la cláusula 'as const' para satisfacer el requisito de tupla (longitud mínima 2)
  const baseColors = ['#BDEBFF', '#D0F0C0', '#A8E6CF'] as const; 
  const pressedColors = ['#99D6FF', '#B0E09A', '#88D9B0'] as const; 
  
  const borderColor = isPressed ? '#60C0A0' : '#8ED6C3'; 

  return (
    <TouchableOpacity
      activeOpacity={1} 
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.buttonWrapper, style, { borderColor: borderColor }]}
    >
      <LinearGradient
        colors={isPressed ? pressedColors : baseColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

// --- Hoja de Estilos ---
const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 30, 
    overflow: 'hidden',
    borderWidth: 1, 
    width: '100%',
    height: 60,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold', 
    color: '#333',
    fontSize: 16,
    lineHeight: 22, 
  },
});