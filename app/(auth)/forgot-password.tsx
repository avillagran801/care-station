import Colors from '@/constants/Colors';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text>Aquí irá el formulario para recuperar la contraseña.</Text>
      </View>
    </SafeAreaView>
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