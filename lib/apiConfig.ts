import Constants from 'expo-constants';
import { Platform } from 'react-native';

const envApiUrl = Constants.expoConfig?.extra?.apiUrl as string;


const isAndroidEmulator = Platform.OS === 'android' && !Constants.isDevice;


const baseURL = isAndroidEmulator 
  ? envApiUrl.replace(/:\/\/.*?:/, `://10.0.2.2:`) 
  : envApiUrl;

console.log('Final API Base URL:', baseURL);

if (!baseURL) {
  console.error("Error: La variable de entorno API_URL no está configurada. Revisa tu archivo .env y reinicia el servidor de desarrollo.");
}

export { baseURL };

