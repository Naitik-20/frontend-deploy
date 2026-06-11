const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getCategories = async () => (await fetch(`${BACKEND_URL}/api/categories?includeInactive=true`)).json();
export const saveCategory = async (payload, editingCategory) => {
  const isFormData = payload instanceof FormData;
  const res = await fetch(editingCategory ? `${BACKEND_URL}/api/categories/${editingCategory._id}` : `${BACKEND_URL}/api/categories`, {
    method: editingCategory ? 'PUT' : 'POST',
    headers: isFormData ? authHeaders() : { 'Content-Type': 'application/json', ...authHeaders() },
    body: isFormData ? payload : JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Category save failed');
  return data;
};
export const deleteCategory = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/categories/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Category delete failed');
  return data;
};
