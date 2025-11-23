const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAllNotifications() {
  const response = await fetch(API_BASE_URL + '/notification/getAllNotifications', {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch all notifications');
  return await response.json();
}

async function getNotificationById(id) {
  const response = await fetch(API_BASE_URL + '/notification/getNotificationById/' + id, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch notification with id ' + id);
  return await response.json();
}

async function deleteNotificationById(id) {
  const response = await fetch(API_BASE_URL + '/notification/deleteNotification/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete notification with id ' + id);
  return await response.json();
}

async function deleteAllNotifications() {
  const response = await fetch(API_BASE_URL + '/notification/deleteAllNotifications', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete all notifications');
  return await response.json();
}

export {
  getAllNotifications,
  getNotificationById,
  deleteNotificationById,
  deleteAllNotifications,
};
