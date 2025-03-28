import { useAuth } from '../contexts/AuthContext';
import { API_URL, API_KEY } from '../lib/config';
import { ApiResponse } from '../types/api';

interface FetchOptions extends RequestInit {
  baseUrl?: string;
}

interface DebugInfo {
  url: string;
  headers: Record<string, string>;
  error?: any;
}

export function useApi() {
  const { tenant, userId } = useAuth();

  const fetchWithAuth = async (endpoint: string, options: FetchOptions = {}): Promise<ApiResponse> => {
    if (!tenant) {
      throw new Error('No tenant information available');
    }

    const headers = new Headers(options.headers || {});
    headers.set('X-DB-Name', tenant.name);
    headers.set('x-api-key', API_KEY);
    headers.set('Content-Type', 'application/json');

    if (userId) {
      headers.set('user-id', userId);
    }

    const url = options.baseUrl ? 
      `${options.baseUrl}${endpoint}` : 
      `${API_URL}${endpoint}`;

    const debugInfo: DebugInfo = {
      url,
      // Convert headers to plain object, excluding sensitive data
      headers: Object.fromEntries(
        Array.from(headers.entries()).filter(([key]) => key.toLowerCase() !== 'x-api-key')
      )
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = `API call failed: ${response.status} ${response.statusText}`;
        debugInfo.error = error;
        throw new Error(error);
      }

      return {
        data: await response.json(),
        debug: debugInfo
      };
    } catch (error) {
      debugInfo.error = error;
      throw { error, debug: debugInfo };
    }
  };

  return { fetchWithAuth };
}