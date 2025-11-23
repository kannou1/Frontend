const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAllEmploiDuTemps() {
  const response = await fetch(API_BASE_URL + '/emploiDuTemps/getAllEmploiDuTemps', {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch all emploi du temps');
  return await response.json();
}

async function getEmploiDuTempsById(id) {
  const response = await fetch(API_BASE_URL + '/emploiDuTemps/getEmploiDuTempsById/' + id, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch emploi du temps with id ' + id);
  return await response.json();
}

async function deleteEmploiDuTempsById(id) {
  const response = await fetch(API_BASE_URL + '/emploiDuTemps/deleteEmploiDuTemps/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete emploi du temps with id ' + id);
  return await response.json();
}

async function deleteAllEmploiDuTemps() {
  const response = await fetch(API_BASE_URL + '/emploiDuTemps/deleteAllEmploiDuTemps', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete all emploi du temps');
  return await response.json();
}

export {
  getAllEmploiDuTemps,
  getEmploiDuTempsById,
  deleteEmploiDuTempsById,
  deleteAllEmploiDuTemps,
};
