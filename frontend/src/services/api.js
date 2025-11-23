// // src/services/api.js
import axios from 'axios';

// // Your Flask backend is running on port 5000
// const API_BASE_URL = 'http://localhost:5000';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
// });

// export const invoiceAPI = {
//   // Process single invoice file
//   processInvoice: async (file) => {
//     const formData = new FormData();
//     formData.append('file', file); // Field name should be 'file'
    
//     const response = await api.post('/upload-pdf', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   },

//   // Process uploaded files for extraction
//   processUploadedFiles: async () => {
//     const response = await api.post('/process-uploaded-files');
//     return response.data;
//   },

//   // List uploaded files
//   listUploadedFiles: async () => {
//     const response = await api.get('/list-uploaded-files');
//     return response.data;
//   },

//   // Health check
//   healthCheck: async () => {
//     const response = await api.get('/health');
//     return response.data;
//   },
// };

// export default api;


// src/services/api.js
const API_BASE_URL = 'http://localhost:5000';

export const invoiceAPI = {
  // Process single invoice file - direct processing
  processInvoice: async (file) => {
    try {
      console.log('Starting file upload and processing...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/api/process-invoice`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Processing result:', result);
      return result;
      
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};
export default invoiceAPI;