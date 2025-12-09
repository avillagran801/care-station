import { AuthProvider } from '@/context/AuthContext';
import { EditProvider } from '@/context/EditContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <AuthProvider> 
      <EditProvider>
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              
              <Stack.Screen name="add-task" />
              
              <Stack.Screen name="medications" />
              <Stack.Screen name="edit-medication" />
              <Stack.Screen name="medical-tests" />
              <Stack.Screen name="edit-medical-test" />
              <Stack.Screen name="prescriptions" />
              <Stack.Screen name="edit-prescription" />
            </Stack>
            <Toast />
          </SafeAreaProvider>
      </EditProvider>
      </AuthProvider>
  );
}