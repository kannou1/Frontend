import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/notification`;

// Get all notifications
export async function getAllNotifications() {
  return await axios.get(`${API_URL}/getAllNotifications`, {
    withCredentials: true,
  });
}

// Get notification by ID
export async function getNotificationById(id) {
  return await axios.get(`${API_URL}/getNotificationById/${id}`, {
    withCredentials: true,
  });
}

// Delete notification by ID
export async function deleteNotificationById(id) {
  return await axios.delete(`${API_URL}/deleteNotification/${id}`, {
    withCredentials: true,
  });
}

// Delete all notifications
export async function deleteAllNotifications() {
  return await axios.delete(`${API_URL}/deleteAllNotifications`, {
    withCredentials: true,
  });
}
