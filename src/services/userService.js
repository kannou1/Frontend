import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/users`;

// ------------------- CREATE USERS -------------------
export const createUser = async (userData) => {
  // Determine endpoint based on role
  let endpoint = `${API_URL}/create-Etudiant`; // default
  if (userData.role === "admin") endpoint = `${API_URL}/create-Admin`;
  if (userData.role === "enseignant") endpoint = `${API_URL}/create-Enseignant`;

  // Use FormData to support file uploads
  const formData = new FormData();
  Object.keys(userData).forEach((key) => {
    // Handle arrays (like classes for enseignant)
    if (Array.isArray(userData[key])) {
      userData[key].forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, userData[key]);
    }
  });

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create user");
  }

  return res.json();
};

// ------------------- GET USERS -------------------
export const getAllUsers = () =>
  axios.get(`${API_URL}/getAllUsers`, { withCredentials: true });

export const getAdmins = () =>
  axios.get(`${API_URL}/admins`, { withCredentials: true });

export const getEnseignants = () =>
  axios.get(`${API_URL}/enseignants`, { withCredentials: true });

export const getEtudiants = () =>
  axios.get(`${API_URL}/etudiants`, { withCredentials: true });

export const getUserById = (id) =>
  axios.get(`${API_URL}/getUserById/${id}`, { withCredentials: true });

// ------------------- DELETE USERS -------------------
export const deleteUserById = (id) =>
  axios.delete(`${API_URL}/delete/${id}`, { withCredentials: true });

export const deleteAllUsers = () =>
  axios.delete(`${API_URL}/deleteAllUsers`, { withCredentials: true });
