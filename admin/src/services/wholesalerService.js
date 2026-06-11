const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getWholesalers = async () => {
  const res = await fetch(`${BACKEND_URL}/api/wholesalers`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Wholesalers load failed');
  return data;
};

export const saveWholesaler = async (payload, editingWholesaler) => {
  const res = await fetch(
    editingWholesaler ? `${BACKEND_URL}/api/wholesalers/${editingWholesaler._id}` : `${BACKEND_URL}/api/wholesalers`,
    {
      method: editingWholesaler ? 'PUT' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Wholesaler save failed');
  return data;
};

export const updateWholesalerStatus = async (id, isActive) => {
  const res = await fetch(`${BACKEND_URL}/api/wholesalers/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ isActive }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Wholesaler status update failed');
  return data;
};

export const deleteWholesaler = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/wholesalers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Wholesaler delete failed');
  return data;
};
