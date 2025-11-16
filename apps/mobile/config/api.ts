import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Get the API base URL dynamically based on the environment
 * For Expo Go development, it uses the computer's local IP address
 */
function getApiUrl(): string {
  // Check if there's a custom API URL in app config
  const customApiUrl = Constants.expoConfig?.extra?.API_URL;
  if (customApiUrl) {
    return customApiUrl;
  }

  // For Expo Go development, use the debugger host IP
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();

    if (debuggerHost) {
      // Use the computer's IP address for Expo Go
      return `http://${debuggerHost}:3000`;
    }

    // Fallback for Android emulator
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    }

    // Fallback for iOS simulator
    return 'http://localhost:3000';
  }

  // Production URL (should be set in app.config.js for production builds)
  return 'https://api.your-domain.com';
}

export const API_URL = getApiUrl();

/**
 * Generic fetch wrapper with error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      );
    }

    // Handle empty responses (e.g., DELETE requests)
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');

    // If no content, return undefined (for void responses)
    if (contentLength === '0' || response.status === 204) {
      return undefined as T;
    }

    // Only parse JSON if content-type indicates JSON
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    // For other content types or empty responses, return undefined
    return undefined as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}
