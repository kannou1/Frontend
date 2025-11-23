import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/note`;

// Get all notes
export async function getAllNotes() {
  return await axios.get(`${API_URL}/getAllNotes`, {
    withCredentials: true,
  });
}

// Get note by ID
export async function getNoteById(id) {
  return await axios.get(`${API_URL}/getNoteById/${id}`, {
    withCredentials: true,
  });
}

// Delete note by ID
export async function deleteNoteById(id) {
  return await axios.delete(`${API_URL}/deleteNote/${id}`, {
    withCredentials: true,
  });
}

// Delete all notes
export async function deleteAllNotes() {
  return await axios.delete(`${API_URL}/deleteAllNotes`, {
    withCredentials: true,
  });
}
