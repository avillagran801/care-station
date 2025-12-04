import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { baseURL } from '../lib/apiConfig';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

async function getToken() {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem('token');
    } else {
      return await SecureStore.getItemAsync('token');
    }
  } catch (error) {
    console.error("Error leyendo token", error);
    return null;
  }
}

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Sesión expirada o token inválido");
    }
    return Promise.reject(error);
  }
);


export const authApi = {
  login: (data: { email: string; password: string }) => {
    return apiClient.post('/login', data);
  },
  register: (data: any) => { 
    return apiClient.post('/register', data);
  },
};

export const groupsApi = {
    getMyGroups: () => {
        return apiClient.get('/my-groups');
    },
    // AÑADIDOS DE AQUÍ A ABAJO, NO SE SI ESTÁ BIEN
    createGroup: (data: any) => {
        return apiClient.post('/my-groups', data);
    },
    findGroup: (data: {code: string}) => {
      return ;
    },
}

// AÑADIDO, NO SE SI ESTÁ BIEN
export const patientApi = {
  registerPatient: (data: any) => { 
    return apiClient.post('/patient', data);
  },
}

export const tasksApi = {
    getTasks: () => {
        return apiClient.get('/tasks');
    },
}

export const healthApi = {
  check: () => apiClient.get('/health'),
};

export const careGroupApi = {
  create: (data: {
    group_name: string;
    photo_url?: string | null;
    patient_names: string;
    patient_surnames?: string | null;
    patient_cellphone?: string | null;
    patient_telephone?: string | null;
    patient_address?: string | null;
  }) => {
    return apiClient.post('/care-groups', data);
  },

  getMyGroups: () => {
    return apiClient.get('/my-groups');
  },
};


export const patientsApi = {
  create: (data: {
    care_group_id: number;
    names: string;
    surnames?: string | null;
    cellphone?: string | null;
    telephone?: string | null;
    address?: string | null;
  }) => {
    return apiClient.post('/patients', data);
  },
};


export default apiClient;