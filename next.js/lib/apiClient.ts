import { useHrmsStore } from '../stores/hrmsStore';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7007';
};

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Try to get role from Zustand store state if client side
  try {
    const role = useHrmsStore.getState().activeRole;
    if (role) {
      headers['X-User-Role'] = role;
    }
  } catch (e) {
    // SSR safe
  }
  
  return headers;
};

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`API GET request failed on ${path}: ${response.statusText}`);
    }
    return response.json();
  },

  async post<T, U = any>(path: string, body?: U): Promise<T> {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API POST request failed on ${path}: ${response.statusText}`);
    }
    return response.json();
  },

  async patch<T, U = any>(path: string, body?: U): Promise<T> {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API PATCH request failed on ${path}: ${response.statusText}`);
    }
    return response.json();
  },
  
  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`API DELETE request failed on ${path}: ${response.statusText}`);
    }
    return response.json();
  }
};
