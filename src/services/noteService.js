const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAllNotes() {
  const response = await fetch(API_BASE_URL + '/note/getAllNotes', {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch all notes');
  return await response.json();
}

async function getNoteById(id) {
  const response = await fetch(API_BASE_URL + '/note/getNoteById/' + id, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch note with id ' + id);
  return await response.json();
}

async function deleteNoteById(id) {
  const response = await fetch(API_BASE_URL + '/note/deleteNote/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete note with id ' + id);
  return await response.json();
}

async function deleteAllNotes() {
  const response = await fetch(API_BASE_URL + '/note/deleteAllNotes', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete all notes');
  return await response.json();
}

export {
  getAllNotes,
  getNoteById,
  deleteNoteById,
  deleteAllNotes,
};
