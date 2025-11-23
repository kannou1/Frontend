const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAllUsers() {
  const response = await fetch(\`\${API_BASE_URL}/users/getAllUsers\`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch all users');
  return await response.json();
}

async function getAdmins() {
  const response = await fetch(\`\${API_BASE_URL}/users/admins\`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch admins');
  return await response.json();
}

async function getEnseignants() {
  const response = await fetch(\`\${API_BASE_URL}/users/enseignants\`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch enseignants');
  return await response.json();
}

async function getEtudiants() {
  const response = await fetch(\`\${API_BASE_URL}/users/etudiants\`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch etudiants');
  return await response.json();
}

async function getUserById(id) {
  const response = await fetch(\`\${API_BASE_URL}/users/getUserById/\${id}\`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error(\`Failed to fetch user with id \${id}\`);
  return await response.json();
}

async function deleteUserById(id) {
  const response = await fetch(\`\${API_BASE_URL}/users/delete/\${id}\`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(\`Failed to delete user with id \${id}\`);
  return await response.json();
}

async function deleteAllUsers() {
  const response = await fetch(\`\${API_BASE_URL}/users/deleteAllUsers\`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete all users');
  return await response.json();
}

export {
  getAllUsers,
  getAdmins,
  getEnseignants,
  getEtudiants,
  getUserById,
  deleteUserById,
  deleteAllUsers,
};
