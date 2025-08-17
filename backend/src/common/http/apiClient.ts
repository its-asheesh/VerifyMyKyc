import axios from 'axios';
// Loads API key and base URL from environment variables
const apiClient = axios.create({
    
  baseURL: process.env.GRIDLINES_BASE_URL, // e.g., https://api.gridlines.io
  timeout: 30000, // Increased from 10000 to 30000 (30 seconds)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-API-Key': process.env.GRIDLINES_API_KEY || '',
    'X-Auth-Type': 'API-Key',
  },
});

// Attach per-request X-Reference-ID
apiClient.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  // Generate unique reference ID for each outgoing request
  (config.headers as any)['X-Reference-ID'] = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  return config;
});

export default apiClient;
