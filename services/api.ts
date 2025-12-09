import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { baseURL } from '../lib/apiConfig';

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export async function getToken() {
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

export async function removeToken() {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem('token');
    } else {
      await SecureStore.deleteItemAsync('token');
    }
  } catch (error) {
    console.error("Error eliminando token", error);
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
    if (error.response) {
      if(error.response.status === 401) {
        const isLoginRequest = error.config.url.includes('/login');

        if (!isLoginRequest) {
          console.log("Sesión expirada detectada. Redirigiendo...");

          await removeToken();

          setTimeout(() => {
              router.replace('/login');
          }, 100);
        }
      }
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

export const userApi = {
  me: () => apiClient.get('/user'),
};

export const groupsApi = {
  getMyGroups: () => {
    return apiClient.get('/my-groups');
  },
  // Método para unirse usando el código
  joinGroup: (data: { code: string }) => {
    return apiClient.post('/join-group', data);
  },
  // Método para generar el código (Solo admins)
  generateInvitation: (groupId: string | number) => {
    return apiClient.post(`/care-groups/${groupId}/invitation`);
  },
  // AÑADIDOS DE AQUÍ A ABAJO, NO SE SI ESTÁ BIEN
  createGroup: (data: any) => {
    return apiClient.post('/my-groups', data);
  },
  findGroup: (data: { code: string }) => {
    return;
  },

  getMembers: (care_group_id: number) => {
    return apiClient.get(`/care-groups/get-members/${care_group_id}`);
  },
}

export const tasksApi = {
  // GET /tasks/by-group/{care_group_id}
  listByGroup: (care_group_id: number) => {
      return apiClient.get(`/tasks/by-group/${care_group_id}`);
  },

  // GET /tasks/upcoming-by-group/{care_group_id}
  listUpcomingByGroup: (care_group_id: number) => {
      return apiClient.get(`/tasks/upcoming-by-group/${care_group_id}`);
  },

  // POST /tasks
  create: (data: {
    care_group_id: number;
    title: string;
    description?: string | null;
    frequency: string;
    category?: string | null;
    begin_time: string;
    end_time?: string | null;
  }) => {
    return apiClient.post('/tasks', data);
  },

  // GET /tasks/{id}
  read: (id: number) => {
    return apiClient.get(`/tasks/${id}`);
  },

  // PUT /tasks/{id}
  update: (id: number, data: {
    care_group_id: number;
    title: string;
    description?: string | null;
    frequency: string;
    category?: string | null;
    begin_time: string;
    end_time?: string | null;
  }) => {
    return apiClient.put(`/tasks/${id}`, data);
  },

  // DELETE /tasks/{id}
  delete: (id: number) => {
    return apiClient.delete(`/tasks/${id}`);
  }
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

  update: (groupId: string | number, formData: FormData) => {
    return apiClient.post(`/care-groups/${groupId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

  // GET /patients/by-group/{care_group_id}
  getByGroup: (care_group_id: number) => {
    return apiClient.get(`/patients/by-group/${care_group_id}`);
  },
};

export default apiClient;