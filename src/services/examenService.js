import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/examen`;

// Get all examen
export async function getAllExamen() {
  return await axios.get(`${API_URL}/getAllExamen`, {
    withCredentials: true,
  });
}

// Get examen by ID
export async function getExamenById(id) {
  return await axios.get(`${API_URL}/getExamenById/${id}`, {
    withCredentials: true,
  });
}

// Delete examen by ID
export async function deleteExamenById(id) {
  return await axios.delete(`${API_URL}/deleteExamen/${id}`, {
    withCredentials: true,
  });
}

// Delete all examen
export async function deleteAllExamen() {
  return await axios.delete(`${API_URL}/deleteAllExamen`, {
    withCredentials: true,
  });
}
