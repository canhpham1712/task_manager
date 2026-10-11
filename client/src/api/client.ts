import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, ApiError } from '@task-manager/shared';

const API_BASE_URL = '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = 'Bearer ' + accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle 401 and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use a shared promise to avoid multiple simultaneous refresh calls
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken();
        }

        const newToken = await refreshPromise;
        refreshPromise = null;

        if (newToken) {
          setAccessToken(newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = 'Bearer ' + newToken;
          }
          return apiClient(originalRequest);
        }
      } catch {
        refreshPromise = null;
        setAccessToken(null);
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post<ApiResponse<{ accessToken: string }>>(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    return response.data.data.accessToken;
  } catch {
    return null;
  }
}

// Typed API helpers
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, { params });
  return response.data.data;
}

export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data.data;
}

export async function apiPatch<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data);
  return response.data.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data.data;
}
