import axios from 'axios';

interface AxiosError<T = any> extends Error {
  config: any;
  code?: string;
  request?: any;
  response?: {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
  };
  isAxiosError: boolean;
  toJSON: () => object;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://backend.verifymykyc.com/api';

interface ApiErrorResponse {
  message: string;
  [key: string]: any;
}

export const subscribe = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/subscribers`, { email });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data?.message || 'Failed to subscribe');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const getSubscribers = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/subscribers`, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch subscribers');
  }
};

export const deleteSubscriber = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/subscribers/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  } catch (error) {
    throw new Error('Failed to delete subscriber');
  }
};

export const exportSubscribers = async (format: 'excel' | 'csv' | 'json') => {
  try {
    const response = await axios.get(`${API_URL}/subscribers/export`, {
      params: { format },
      responseType: 'blob',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    // Create a download link and trigger download
    const blobData = response.data as BlobPart;
    const url = window.URL.createObjectURL(new Blob([blobData]));
    const link = document.createElement('a');
    const extension = format === 'excel' ? 'xlsx' : format === 'csv' ? 'csv' : 'json';
    const filename = `subscribers.${extension}`;
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error('Failed to export subscribers');
  }
};