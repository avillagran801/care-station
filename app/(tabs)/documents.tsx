import CustomSafeArea from '@/components/ui/CustomSafeArea';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DocumentsScreen() {
  return (
    <CustomSafeArea>
      <View style={styles.container}>
        <Text style={styles.title}>Pantalla de Documentos</Text>
      </View>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});