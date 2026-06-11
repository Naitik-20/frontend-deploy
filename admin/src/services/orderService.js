const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getOrders = async (orderTypeView = 'All') => {
  const res = await fetch(`${BACKEND_URL}/api/orders/admin/all?orderType=${encodeURIComponent(orderTypeView)}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Orders could not be loaded');
  return data;
};
export const updateOrder = async (orderId, updates) => {
  const res = await fetch(`${BACKEND_URL}/api/orders/admin/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Order update failed');
  return data;
};
export const deleteOrder = async (orderId) => {
  const res = await fetch(`${BACKEND_URL}/api/orders/admin/${orderId}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Order delete failed');
  return data;
};
