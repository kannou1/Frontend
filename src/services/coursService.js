const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAllCours() {
  const response = await fetch(API_BASE_URL + '/cours/getAllCours', {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch all cours');
  return await response.json();
}

async function getCoursById(id) {
  const response = await fetch(API_BASE_URL + '/cours/getCoursById/' + id, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch cours with id ' + id);
  return await response.json();
}

async function deleteCoursById(id) {
  const response = await fetch(API_BASE_URL + '/cours/deleteCours/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete cours with id ' + id);
  return await response.json();
}

async function deleteAllCours() {
  const response = await fetch(API_BASE_URL + '/cours/deleteAllCours', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete all cours');
  return await response.json();
}

export {
  getAllCours,
  getCoursById,
  deleteCoursById,
  deleteAllCours,
};
