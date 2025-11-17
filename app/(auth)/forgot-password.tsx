import CustomSafeArea from '@/components/ui/CustomSafeArea';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <CustomSafeArea>
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text>Aquí irá el formulario para recuperar la contraseña.</Text>
      </View>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});