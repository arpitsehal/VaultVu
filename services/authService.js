import AsyncStorage from '@react-native-async-storage/async-storage';

// To this
const API_URL = 'https://vaultvu.onrender.com/api/auth';

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
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
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
      // Update stored user data with profile info
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
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