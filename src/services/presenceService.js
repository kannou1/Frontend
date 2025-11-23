import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/presence`;

// Get all presence
export async function getAllPresence() {
  return await axios.get(`${API_URL}/getAllPresence`, {
    withCredentials: true,
  });
}

// Get presence by ID
export async function getPresenceById(id) {
  return await axios.get(`${API_URL}/getPresenceById/${id}`, {
    withCredentials: true,
  });
}

// Delete presence by ID
export async function deletePresenceById(id) {
  return await axios.delete(`${API_URL}/deletePresence/${id}`, {
    withCredentials: true,
  });
}

// Delete all presence
export async function deleteAllPresence() {
  return await axios.delete(`${API_URL}/deleteAllPresence`, {
    withCredentials: true,
  });
}
