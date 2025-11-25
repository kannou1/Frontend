import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/demande`;

// Get all demandes (admin/teacher)
export async function getAllDemandes() {
  try {
    const response = await axios.get(`${API_URL}/getAll`, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get demande by ID
export async function getDemandeById(id) {
  try {
    const response = await axios.get(`${API_URL}/getById/${id}`, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Update demande status (admin/teacher)
export async function updateDemandeStatus(id, statut) {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, { statut }, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Delete demande (admin/teacher)
export async function deleteDemande(id) {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Delete all demandes (admin only)
export async function deleteAllDemandes() {
  try {
    const response = await axios.delete(`${API_URL}/deleteAll`, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
