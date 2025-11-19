import apiClient from '@/services/api';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface AuthProps {
  authState: { token: string | null; authenticated: boolean | null };
  onLogin: (token: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({} as AuthProps);

export const useAuth = () => {
  return useContext(AuthContext);
};

const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.warn('Error obteniendo token:', error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.warn('Error guardando token:', error);
    }
  },
  async deleteToken(key: string) {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.warn('Error borrando token:', error);
    }
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await tokenCache.getToken('token'); 
      
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthState({ token, authenticated: true });
      } else {
        setAuthState({ token: null, authenticated: false });
      }
    };
    loadToken();
  }, []);

  const onLogin = async (token: string) => {
    try {
      await tokenCache.saveToken('token', token); 
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuthState({ token, authenticated: true });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const onLogout = async () => {
    await tokenCache.deleteToken('token'); 
    apiClient.defaults.headers.common['Authorization'] = '';
    setAuthState({ token: null, authenticated: false });
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ authState, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};