import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddButton from './AddButton';
import TabBarBackground from './TabBarBackground';

type TabItemProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  isFocused: boolean;
  onPress: () => void;
};

const TabItem = ({ iconName, isFocused, onPress }: TabItemProps) => (
  <TouchableOpacity onPress={onPress} style={styles.tabItem}>
    <Ionicons
      name={iconName}
      size={28}
      color={isFocused ? Colors.iconFocused : Colors.iconDefault}
    />
  </TouchableOpacity>
);

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const handleAddPress = () => {
    navigation.navigate('add-task');
  };

  const currentRouteName = state.routes[state.index].name;

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: insets.bottom }]}>
      <AddButton onPress={handleAddPress} />
      
      <View style={styles.tabBar}>
        <TabBarBackground />
        
        <View style={styles.tabBarItemsContainer}>
          {/* CONTENEDOR IZQUIERDO  */}
          <View style={styles.sideContainer}>
            <TabItem
              iconName="home-outline"
              isFocused={currentRouteName === 'index'}
              onPress={() => navigation.navigate('index')}
            />
            <TabItem
              iconName="calendar-outline"
              isFocused={currentRouteName === 'calendar'}
              onPress={() => navigation.navigate('calendar')}
            />
          </View>

          {/* ESPACIADOR CENTRAL */}
          <View style={styles.notchSpacer} />

          {/* CONTENEDOR DERECHO */}
          <View style={styles.sideContainer}>
            <TabItem
              iconName="document-text-outline"
              isFocused={currentRouteName === 'contacts'} 
              onPress={() => navigation.navigate('contacts')}
            />
            <TabItem
              iconName="people-outline"
              isFocused={currentRouteName === 'profile'}
              onPress={() => navigation.navigate('profile')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        // bottom: 20,
        left: 0,
        right: 0,
        height: 60,
        alignItems: 'center',
    },
    tabBar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    tabBarItemsContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sideContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    notchSpacer: {
        width: 80,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});