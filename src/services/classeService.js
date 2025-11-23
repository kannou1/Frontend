import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/classe";

// Get all classes
export async function getAllClasses() {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllClasses`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch all classes: " + error.message);
  }
}

// Get class by ID
export async function getClasseById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/getClasseById/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch class with id ${id}: ${error.message}`);
  }
}

// Delete class by ID
export async function deleteClasseById(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteClasse/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete class with id ${id}: ${error.message}`);
  }
}

// Delete all classes
export async function deleteAllClasses() {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteAllClasses`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete all classes: " + error.message);
  }
}
