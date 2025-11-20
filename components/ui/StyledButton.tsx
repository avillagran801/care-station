import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

type StyledButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean; 
};

export default function StyledButton({ title, onPress, variant = 'primary', style, disabled = false }: StyledButtonProps) { // MODIFICAR: Recibimos 'disabled'
  const buttonStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textStyle = variant === 'primary' ? styles.primaryText : styles.secondaryText;

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        buttonStyle, 
        style,
        disabled && styles.disabledButton 
      ]} 
      onPress={onPress}
      disabled={disabled} 
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontFamily: 'Poppins-SemiBold',
  },
  primaryButton: {
    backgroundColor: Colors.primaryDark,
  },
  secondaryButton: {
    backgroundColor: Colors.primary2,
  },
  text: {
    fontSize: 16,
    
    fontFamily: 'Poppins-Medium',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.5,
  }
});