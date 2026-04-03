import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const token = Cookies.get('auth-token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  get: (endpoint: string) => fetcher(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => fetcher(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) => fetcher(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) => fetcher(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetcher(endpoint, { method: 'DELETE' }),
};
