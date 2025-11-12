import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      
      <Stack.Screen name="add-task" />
      
      <Stack.Screen name="medications" />
      <Stack.Screen name="edit-medication" />
    </Stack>
  );
}