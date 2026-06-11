const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getProducts = async () => (await fetch(`${BACKEND_URL}/api/products`)).json();
export const saveProduct = async (formData, editingProduct) => {
  const res = await fetch(editingProduct ? `${BACKEND_URL}/api/products/${editingProduct._id}` : `${BACKEND_URL}/api/products/add`, {
    method: editingProduct ? 'PUT' : 'POST',
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Product save failed');
  return data;
};
export const deleteProduct = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/products/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Product delete failed');
  return data;
};
