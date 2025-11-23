const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAllPresence() {
  const response = await fetch(API_BASE_URL + '/presence/getAllPresence', {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch all presence');
  return await response.json();
}

async function getPresenceById(id) {
  const response = await fetch(API_BASE_URL + '/presence/getPresenceById/' + id, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch presence with id ' + id);
  return await response.json();
}

async function deletePresenceById(id) {
  const response = await fetch(API_BASE_URL + '/presence/deletePresence/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete presence with id ' + id);
  return await response.json();
}

async function deleteAllPresence() {
  const response = await fetch(API_BASE_URL + '/presence/deleteAllPresence', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete all presence');
  return await response.json();
}

export {
  getAllPresence,
  getPresenceById,
  deletePresenceById,
  deleteAllPresence,
};
