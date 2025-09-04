import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const subscribe = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/subscribers`, { email });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to subscribe');
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
    const url = window.URL.createObjectURL(new Blob([response.data]));
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
