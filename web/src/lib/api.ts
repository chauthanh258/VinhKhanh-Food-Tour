import Cookies from 'js-cookie';

// Match the backend port 3001 as defined in server.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

  // Handle potential non-JSON responses (security/errors)
  const contentType = response.headers.get("content-type");
  let json;
  if (contentType && contentType.includes("application/json")) {
    json = await response.json();
  } else {
    json = { message: await response.text() };
  }

  if (!response.ok) {
    if (response.status === 401) {
      Cookies.remove('auth-token');
      Cookies.remove('user-role');
      // Only redirect if in browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Phiên đăng nhập hết hạn');
    }
    throw new Error(json.message || json.error || `Error ${response.status}: ${response.statusText}`);
  }

  /**
   * UNWRAP LOGIC:
   * The backend returns { success: true, message: "...", data: PAYLOAD }
   * We want response.data to be the PAYLOAD to match UI expectations.
   */
  const actualData = (json.success && json.data !== undefined) ? json.data : json;

  // Return data wrapped in an object for Axios compatibility
  return { 
    data: actualData, 
    status: response.status,
    headers: response.headers,
    fullResponse: json // Keep the full response just in case
  };
}

export const api = {
  get: (endpoint: string) => fetcher(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => fetcher(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) => fetcher(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) => fetcher(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetcher(endpoint, { method: 'DELETE' }),
};
