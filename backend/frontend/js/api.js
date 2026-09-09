const API_BASE = window.location.origin;

// Helper to make API calls
async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('nexmove_token');
  const headers = { ...options.headers };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }
  
  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  return response;
}

// Export for use in other scripts
window.apiFetch = apiFetch;
window.API_BASE = API_BASE;
