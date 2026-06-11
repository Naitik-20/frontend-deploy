const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getBrandsWeLove = async () => (await fetch(`${BACKEND_URL}/api/brands-we-love?includeInactive=true`)).json();

export const saveBrandWeLove = async (payload, editingBrand) => {
  const res = await fetch(editingBrand ? `${BACKEND_URL}/api/brands-we-love/${editingBrand._id}` : `${BACKEND_URL}/api/brands-we-love`, {
    method: editingBrand ? 'PUT' : 'POST',
    headers: authHeaders(),
    body: payload,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Brand save failed');
  return data;
};

export const deleteBrandWeLove = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/brands-we-love/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Brand delete failed');
  return data;
};
