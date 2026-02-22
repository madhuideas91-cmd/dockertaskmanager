import axiosInstance from "./axiosInstance";
import { API_URL } from "../config/api";

const API_BASE = `${API_URL}/api/auth`;


export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role?: string;
  userId: number; // ✅ NEW
}

export const signupUser = (data: SignupRequest) => {
  return axiosInstance.post(`${API_BASE}/signup`, data);
};

export const loginUser = (data: AuthRequest) => {
  const maxRetries = 9;

  const attempt = async (retry: number): Promise<any> => {
    try {
      return await axiosInstance.post<AuthResponse>(`${API_BASE}/login`, data);
    } catch (error: any) {
      if (error?.response?.status === 503 && retry < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 700 * retry));
        return attempt(retry + 1);
      }
      throw error;
    }
  };

  return attempt(1);
};

export const getProfile = (token: string) => {
  return axiosInstance.get(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

