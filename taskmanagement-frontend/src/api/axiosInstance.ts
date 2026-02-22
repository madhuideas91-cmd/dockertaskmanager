

// src/api/axiosInstance.ts
import axios from "axios";
import { API_URL } from "../config/api";

let unauthorizedEventDispatched = false;

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
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
  async (error) => {
    const config = error?.config || {};
    const status = error?.response?.status;
    const requestUrl = String(config?.url || "");

    if (status === 503 && (config.method || "get").toLowerCase() === "get") {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < 3) {
        config.__retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 400 * config.__retryCount));
        return axiosInstance(config);
      }
    }

    const shouldForceLogout =
      requestUrl.includes("/api/auth/profile") ||
      requestUrl.includes("/api/auth/validate") ||
      requestUrl.includes("/api/auth/me");

    if (error?.response?.status === 401 && shouldForceLogout) {
      if (unauthorizedEventDispatched) {
        return Promise.reject(error);
      }
      unauthorizedEventDispatched = true;
      window.dispatchEvent(
        new CustomEvent("apiUnauthorized", {
          detail: { message: "Session expired. Please login again." },
        })
      );
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      setTimeout(() => {
        unauthorizedEventDispatched = false;
      }, 1500);
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
