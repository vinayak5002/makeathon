import { apiClient } from "../api/client";

interface LoginResponse {
  message: string;
  token?: string; // Assuming you are using token for authentication
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/login', { username, password });
    return response.data; // Returns the response data if login is successful
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.get('/logout');
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
