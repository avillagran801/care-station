import CustomTabBar from '@/components/navigation/CustomTabBar';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        initialParams={{ tabBarIconName: 'home-outline' }}
        options={{ title: 'Inicio' }}
      />
      <Tabs.Screen
        name="calendar"
        initialParams={{ tabBarIconName: 'calendar-outline' }}
        options={{ title: 'Calendario' }}
      />
      <Tabs.Screen
        name="addTask" //name="add-placeholder"
        options={{ title: '' }}
        listeners={{ tabPress: (e) => e.preventDefault() }}
      />
      <Tabs.Screen
        name="contacts"
        initialParams={{ tabBarIconName: 'document-text-outline' }}
        options={{ title: 'Contactos' }}
      />
      <Tabs.Screen
        name="profile"
        initialParams={{ tabBarIconName: 'people-outline' }}
        options={{ title: 'Perfil' }}
      />
    </Tabs>
  );
}