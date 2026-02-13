import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

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
        return 'Sem permissão';
      case 500:
        return 'Erro interno do servidor';
    }

    return error;
  }


}