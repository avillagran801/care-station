import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <AuthProvider> 
      <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            
            <Stack.Screen name="add-task" />
            
            <Stack.Screen name="medications" />
            <Stack.Screen name="edit-medication" />
          </Stack>
          <Toast />
        </SafeAreaProvider>
      </AuthProvider>
  );
}