const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getConversation(userId1, userId2) {
  const response = await fetch(API_BASE_URL + '/message/conversation/' + userId1 + '/' + userId2, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch conversation');
  return await response.json();
}

async function getAllMessages() {
  const response = await fetch(API_BASE_URL + '/message/all', {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch all messages');
  return await response.json();
}

async function deleteMessageById(id) {
  const response = await fetch(API_BASE_URL + '/message/delete/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete message with id ' + id);
  return await response.json();
}

async function deleteAllMessages() {
  const response = await fetch(API_BASE_URL + '/message/deleteAll', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete all messages');
  return await response.json();
}

export {
  getConversation,
  getAllMessages,
  deleteMessageById,
  deleteAllMessages,
};
