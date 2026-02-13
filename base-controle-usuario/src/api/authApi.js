import { api } from './api';

export async function login(email, password) {

  const response = await api.post('/auth/login', {
    email: email.trim(),
    password,
  });

  return response.data;
}
