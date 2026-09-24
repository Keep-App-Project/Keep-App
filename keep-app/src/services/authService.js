import { USE_MOCK, wait, apiFetch } from './config';
import { mockUser, mockCredentials } from './mock/user';

let currentMockUser = null;

export async function login(email, password) {
  if (USE_MOCK) {
    await wait();
    if (email.trim().toLowerCase() === mockCredentials.email.toLowerCase() && password === mockCredentials.password) {
      currentMockUser = { ...mockUser };
      return { user: currentMockUser, token: 'mock-token' };
    }
    throw new Error('E-mail ou senha inválidos.');
  }
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function signUp(payload) {
  if (USE_MOCK) {
    await wait();
    currentMockUser = { ...mockUser, ...payload, id: 'u_new', plan: 'free' };
    return { user: currentMockUser, token: 'mock-token' };
  }
  return apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
}

export async function logout() {
  if (USE_MOCK) {
    await wait(200);
    currentMockUser = null;
    return { success: true };
  }
  return apiFetch('/auth/logout', { method: 'POST' });
}

export async function requestPasswordReset(email) {
  if (USE_MOCK) {
    await wait();
    return { success: true, email };
  }
  return apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function getCurrentUser() {
  if (USE_MOCK) {
    await wait(200);
    return currentMockUser;
  }
  return apiFetch('/auth/me');
}

export default { login, signUp, logout, requestPasswordReset, getCurrentUser };
