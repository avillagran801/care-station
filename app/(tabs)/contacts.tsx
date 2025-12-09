import CustomSafeArea from '@/components/ui/CustomSafeArea';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function DocumentsScreen() {
  return (
    <CustomSafeArea withTabBar>
      <ImageBackground
                    source={require('@/assets/images/background2.jpg')}
                    resizeMode="cover"
                    style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Pantalla de Documentos</Text>
        </View>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%'},
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