import axios from 'axios';
//import * as SecureStore from 'expo-secure-store';

export const api = axios.create({
  baseURL: 'http://192.168.0.117:3000/api/v1', // ⚠️ nunca use localhost
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  //const token = await SecureStore.getItemAsync('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
  return config;
});
