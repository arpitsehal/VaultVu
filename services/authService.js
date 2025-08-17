import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiConfig } from './apiConfig';

const API_URL = `${apiConfig.baseURL}/api/auth`;

export async function login(emailOrUsername, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password }),
    });
    const data = await response.json();
    if (data.success && data.token) {
      await AsyncStorage.setItem('token', data.token);
      const userWithToken = { ...data.user, token: data.token };
      await AsyncStorage.setItem('user', JSON.stringify(userWithToken));
      return { success: true, user: userWithToken };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
}

export async function register(email, password) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
}

export async function completeProfile(email, username, dateOfBirth, country, gender) {
  try {
    const response = await fetch(`${API_URL}/complete-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, dateOfBirth, country, gender }),
    });
    const data = await response.json();
    if (data.success) {
      // Get existing token and include it with profile data
      const existingToken = await AsyncStorage.getItem('token');
      const userWithToken = { ...data.user, token: existingToken };
      await AsyncStorage.setItem('user', JSON.stringify(userWithToken));
    }
    return { success: data.success, message: data.message, user: data.user };
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Logout error' };
  }
}

// Request password reset OTP
export async function requestPasswordReset(email) {
  try {
    const response = await fetch(`${API_URL}/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
}

// Reset password with OTP
export async function resetPassword(email, otp, newPassword) {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
}

export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: apiConfig.headers,
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  requestPasswordReset,
  resetPassword,
};
