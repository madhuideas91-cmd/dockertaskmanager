

// src/api/axiosInstance.ts
import axios from "axios";

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  timeout: 10000,
  withCredentials: true,

});

// ✅ Attach JWT automatically to all requests
axiosInstance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.dispatchEvent(
        new CustomEvent("apiUnauthorized", {
          detail: { message: "Session expired. Please login again." },
        })
      );
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
