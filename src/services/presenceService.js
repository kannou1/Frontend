import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/presence`;

// Create presence
export async function createPresence(presenceData) {
  const response = await axios.post(`${API_URL}/create`, presenceData, {
    withCredentials: true,
  });
  return response.data;
}

// Get all presence
export async function getAllPresence() {
  const response = await axios.get(`${API_URL}/getAllPresence`, {
    withCredentials: true,
  });
  return response.data;
}

// Get presence by ID
export async function getPresenceById(id) {
  const response = await axios.get(`${API_URL}/getPresenceById/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

// Delete presence by ID
export async function deletePresenceById(id) {
  const response = await axios.delete(`${API_URL}/deletePresence/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

// Delete all presence
export async function deleteAllPresence() {
  const response = await axios.delete(`${API_URL}/deleteAllPresence`, {
    withCredentials: true,
  });
  return response.data;
}

// Get presence by course
export async function getPresenceByCours(courseId) {
  const response = await axios.get(`${API_URL}/getByCours/${courseId}`, {
    withCredentials: true,
  });
  return response.data;
}

// Get attendance rate by course
export async function getTauxPresenceParCours(courseId) {
  const response = await axios.get(`${API_URL}/taux/cours/${courseId}`, {
    withCredentials: true,
  });
  return response.data;
}
