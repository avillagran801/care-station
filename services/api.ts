import axios from 'axios';
import { baseURL } from '../lib/apiConfig';

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const authApi = {
  login: (data: { email: string; password: string }) => {
    return apiClient.post('/login', data);
  },
  register: (data: any) => { 
    return apiClient.post('/register', data);
  },
};

// CHANGE LATER
export const tasksApi = {
    getTasks: () => {
        return apiClient.get('/tasks');
    },
}

export const healthApi = {
  check: () => apiClient.get('/health'),
};

export default apiClient;