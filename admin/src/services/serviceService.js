const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getServices = async () => (await fetch(`${BACKEND_URL}/api/services?includeInactive=true`)).json();
export const saveService = async (payload, editingService) => {
  const res = await fetch(editingService ? `${BACKEND_URL}/api/services/${editingService._id}` : `${BACKEND_URL}/api/services`, {
    method: editingService ? 'PUT' : 'POST',
    headers: authHeaders(),
    body: payload,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Service save failed');
  return data;
};
export const deleteService = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/services/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Service delete failed');
  return data;
};
