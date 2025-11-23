const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAllExamen() {
  const response = await fetch(API_BASE_URL + '/examen/getAllExamen', {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch all examen');
  return await response.json();
}

async function getExamenById(id) {
  const response = await fetch(API_BASE_URL + '/examen/getExamenById/' + id, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch examen with id ' + id);
  return await response.json();
}

async function deleteExamenById(id) {
  const response = await fetch(API_BASE_URL + '/examen/deleteExamen/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete examen with id ' + id);
  return await response.json();
}

async function deleteAllExamen() {
  const response = await fetch(API_BASE_URL + '/examen/deleteAllExamen', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete all examen');
  return await response.json();
}

export {
  getAllExamen,
  getExamenById,
  deleteExamenById,
  deleteAllExamen,
};
