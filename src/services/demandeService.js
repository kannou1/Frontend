import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/demande`;

// Get all demandes
export async function getAllDemandes() {
  return await axios.get(`${API_URL}/getAllDemandes`, {
    withCredentials: true,
  });
}

// Get demande by ID
export async function getDemandeById(id) {
  return await axios.get(`${API_URL}/getDemandeById/${id}`, {
    withCredentials: true,
  });
}

// Delete demande by ID
export async function deleteDemandeById(id) {
  return await axios.delete(`${API_URL}/deleteDemande/${id}`, {
    withCredentials: true,
  });
}

// Delete all demandes
export async function deleteAllDemandes() {
  return await axios.delete(`${API_URL}/deleteAllDemandes`, {
    withCredentials: true,
  });
}
