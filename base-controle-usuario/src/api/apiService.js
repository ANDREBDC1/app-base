import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { api } from './api';

export async function saveTokens(access) {
  await SecureStore.setItemAsync('access_token', access);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync('access_token');
}


export function obterMensagemErro(error) {
  
  if (axios.isAxiosError(error)) {
    
    const status = error.response?.status;

    switch (status) {
      case 400:
        return 'Dados inválidos';
      case 401:
        const data = error.response?.data;

        if (Array.isArray(data?.message)) {
          return data.message.join(' | ');
        }

        return 'Email ou senha invalido!';
      case 403:
        return 'Usuário sem permissão para essa ação';
      case 500:
        return 'Erro interno do servidor';
    }

    return error;
  }


}


export async function getPermissions() {

  const response = await api.get('/permissions');
  return response.data;
}

export async function getPermissionsUser(userId) {

  const response = await api.get('/permissions/' + userId);

  return response.data;
}


export async function createUser(data) {

  const response = await api.post('/users', data);

  return response.data;
}

export async function updateUser(id, data) {
  const response = await api.put('/users/' + id, data);

  return response.data;
}

export async function getUsers() {

  const response = await api.get('/users');
  return response.data;
}

export async function deleteUser(id) {

  const response = await api.delete('/users/' + id);
  return response.data;
}