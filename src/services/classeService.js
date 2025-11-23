const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAllClasses() {
  const response = await fetch(\`\${API_BASE_URL}/classe/getAllClasses\`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch all classes');
  return await response.json();
}

async function getClasseById(id) {
  const response = await fetch(\`\${API_BASE_URL}/classe/getClasseById/\${id}\`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error(\`Failed to fetch class with id \${id}\`);
  return await response.json();
}

async function deleteClasseById(id) {
  const response = await fetch(\`\${API_BASE_URL}/classe/deleteClasse/\${id}\`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(\`Failed to delete class with id \${id}\`);
  return await response.json();
}

async function deleteAllClasses() {
  const response = await fetch(\`\${API_BASE_URL}/classe/deleteAllClasses\`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete all classes');
  return await response.json();
}

export {
  getAllClasses,
  getClasseById,
  deleteClasseById,
  deleteAllClasses,
};
