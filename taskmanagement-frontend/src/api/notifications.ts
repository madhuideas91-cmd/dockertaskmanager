
// src/api/notifications.ts
import axios from "axios";
import axiosNotifInstance from "./axiosInstanceNotifications";
import { API_URL } from "../config/api";

const API_BASE = `${API_URL}/notifications`;


export interface NotificationPref {
  type: "TASK_ASSIGNED" | "STATUS_CHANGED" | "COMMENT_MENTION" | "PROJECT_UPDATES";
  emailEnabled: boolean;
  inAppEnabled: boolean;
}

// Fetch all notifications
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      return [];
    }
    throw error;
  }
};

// Create new notification
export const createNotification = async (payload: { message: string }) => {
  const response = await axios.post(`${API_BASE}/create`, payload);
  return response.data;
};

// Fetch current user's notification preferences
export const getNotificationPreferences = async (): Promise<NotificationPref[]> => {
  const userId = localStorage.getItem("userId") || "";
  const res = await axiosNotifInstance.get<NotificationPref[]>(`${API_BASE}/preferences`, {
    headers: {
      "X-User-Id": userId,
    },
  });
  return res.data;
};

// Update current user's notification preferences
export const updateNotificationPreferences = async (prefs: NotificationPref[]) => {
  const userId = localStorage.getItem("userId") || "";
  await axiosNotifInstance.put(`${API_BASE}/preferences`, prefs, {
    headers: {
      "X-User-Id": userId,
    },
  });
};

export const fetchNotifications = async () => {
  const token = localStorage.getItem("token");
  if (!token) return []; // stop API call after logout
  return axiosNotifInstance.get(API_BASE).then(res => res.data);

};
