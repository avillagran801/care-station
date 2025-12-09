import CustomSafeArea from "@/components/ui/CustomSafeArea";
import Colors from '@/constants/Colors';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function Tab() {
  return (
    <CustomSafeArea withTabBar>
      <ImageBackground
                    source={require('@/assets/images/background2.jpg')}
                    resizeMode="cover"
                    style={styles.backgroundImage}
      >
        <View>
          <Text>No sé qué más poner</Text>
        </View>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%'},
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, gap: 15 },
  placeholderText: { textAlign: 'center', color: Colors.textLight, paddingVertical: 40 },
});