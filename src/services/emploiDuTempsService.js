import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/emploiDuTemps`;

// Get all emploi du temps
export async function getAllEmploiDuTemps() {
  return await axios.get(`${API_URL}/getAllEmploiDuTemps`, {
    withCredentials: true,
  });
}

// Get emploi du temps by ID
export async function getEmploiDuTempsById(id) {
  return await axios.get(`${API_URL}/getEmploiDuTempsById/${id}`, {
    withCredentials: true,
  });
}

// Delete emploi du temps by ID
export async function deleteEmploiDuTempsById(id) {
  return await axios.delete(`${API_URL}/deleteEmploiDuTemps/${id}`, {
    withCredentials: true,
  });
}

// Delete all emploi du temps
export async function deleteAllEmploiDuTemps() {
  return await axios.delete(`${API_URL}/deleteAllEmploiDuTemps`, {
    withCredentials: true,
  });
}
