import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/cours";

// Get all cours
export async function getAllCours() {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllCours`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch all cours: " + error.message);
  }
}

// Get cours by ID
export async function getCoursById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/getCoursById/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch cours with id " + id + ": " + error.message);
  }
}

// Delete cours by ID
export async function deleteCoursById(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteCours/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete cours with id " + id + ": " + error.message);
  }
}

// Delete all cours
export async function deleteAllCours() {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteAllCours`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete all cours: " + error.message);
  }
}
