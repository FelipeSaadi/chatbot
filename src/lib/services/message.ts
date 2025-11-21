import axios from "axios"

interface History {
  role: "user" | "assistant",
  content: string
}

interface MessageRequest {
  message: string,
  history?: History[]
}

interface ApiResponse {
  success: boolean,
  data: {
    message: string
  }
}

// Usar URLs relativas em produção (Vercel) para funcionar com o proxy do Next.js
// Em desenvolvimento local, usar URLs absolutas
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const API_URL = isProduction ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
const STT_URL = isProduction ? '' : (process.env.NEXT_PUBLIC_STT_URL || 'http://localhost:3001');

const messageService = {
  getMessage: async (request: MessageRequest) => {
    try {
      const response = await axios.post<ApiResponse>(`${API_URL}/get-response`, {
        message: request.message,
        history: request.history || []
      })

      return response.data.data.message
    }
    catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  getImage: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/images/${id}`, {
        responseType: 'arraybuffer'
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error getting image:', error);
      throw error;
    }
  },

  getResponse: async (message: string) => {
    try {
      const response = await axios.post<ApiResponse>(`${API_URL}/get-response`, {
        message: message,
        history: []
      });

      return response.data;
    } catch (error) {
      console.error("Error getting response:", error);
      throw error;
    }
  },

  getTextToSpeech: async (text: string): Promise<Blob> => {
    try {
      const response = await axios.get(`${API_URL}/api/tts`, {
        params: { text },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error("Error getting text-to-speech:", error);
      throw error;
    }
  }
};

export default messageService
