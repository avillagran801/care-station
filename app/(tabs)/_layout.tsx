import CustomTabBar from '@/components/navigation/CustomTabBar';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
  (Text as any).defaultProps.style = {
    ...(((Text as any).defaultProps.style) || {}),
    fontFamily: 'Poppins-Regular',
  };

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
        name="addTask" 
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