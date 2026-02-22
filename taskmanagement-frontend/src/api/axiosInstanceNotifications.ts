// src/api/axiosInstanceNotifications.ts
import axios from "axios";
import { API_URL } from "../config/api";

let unauthorizedEventDispatched = false;

// Axios instance for notifications microservice
const axiosNotifInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000

});

// Attach JWT automatically to all requests
axiosNotifInstance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
axiosNotifInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config || {};
    const status = error?.response?.status;

    if (status === 503 && (config.method || "get").toLowerCase() === "get") {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < 3) {
        config.__retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 400 * config.__retryCount));
        return axiosNotifInstance(config);
      }
    }

    if (error?.response?.status === 401) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosNotifInstance;
