const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getBreeds = async () => (await fetch(`${BACKEND_URL}/api/breeds?includeInactive=true`)).json();

export const saveBreed = async (payload, editingBreed) => {
  const isFormData = payload instanceof FormData;
  const res = await fetch(editingBreed ? `${BACKEND_URL}/api/breeds/${editingBreed._id}` : `${BACKEND_URL}/api/breeds`, {
    method: editingBreed ? 'PUT' : 'POST',
    headers: isFormData ? authHeaders() : { 'Content-Type': 'application/json', ...authHeaders() },
    body: isFormData ? payload : JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Breed save failed');
  return data;
};

export const deleteBreed = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/breeds/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Breed delete failed');
  return data;
};
