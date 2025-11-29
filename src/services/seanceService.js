import axios from "axios";

// Base URL of your backend
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/seance";

// 🟢 Create a seance
export const createSeance = async (data, token) => {
  const res = await axios.post(`${API_URL}/createSeance`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔍 Get all seances
export const getAllSeances = async (token) => {
  const res = await axios.get(`${API_URL}/getAllSeances`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔍 Get seance by ID
export const getSeanceById = async (id, token) => {
  const res = await axios.get(`${API_URL}/getSeanceById/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✏️ Update a seance
export const updateSeance = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/updateSeance/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ❌ Delete a seance
export const deleteSeance = async (id, token) => {
  const res = await axios.delete(`${API_URL}/deleteSeance/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ❌ Delete all seances
export const deleteAllSeances = async (token) => {
  const res = await axios.delete(`${API_URL}/deleteAllSeances`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
