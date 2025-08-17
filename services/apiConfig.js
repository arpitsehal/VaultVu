const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vaultvu.onrender.com';

export const apiConfig = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
};