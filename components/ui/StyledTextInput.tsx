import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface StyledTextInputProps extends TextInputProps {
    label: string;
}

export default function StyledTextInput({label, ...props}: StyledTextInputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor={Colors.grey}
                {...props}
            />
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
  input: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});