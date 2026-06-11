const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getDeliveryMethods = async () => (await fetch(`${BACKEND_URL}/api/delivery/methods`)).json();
export const getPickupStores = async () => (await fetch(`${BACKEND_URL}/api/delivery/stores`)).json();
export const saveDeliveryMethod = async (payload, editingDeliveryMethod) => {
  const res = await fetch(editingDeliveryMethod ? `${BACKEND_URL}/api/delivery/methods/${editingDeliveryMethod._id}` : `${BACKEND_URL}/api/delivery/methods`, {
    method: editingDeliveryMethod ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Delivery method save failed');
  return data;
};
export const deleteDeliveryMethod = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/delivery/methods/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Delivery method delete failed');
  return data;
};
export const savePickupStore = async (payload, editingPickupStore) => {
  const res = await fetch(editingPickupStore ? `${BACKEND_URL}/api/delivery/stores/${editingPickupStore._id}` : `${BACKEND_URL}/api/delivery/stores`, {
    method: editingPickupStore ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Pickup store save failed');
  return data;
};
export const deletePickupStore = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/delivery/stores/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Pickup store delete failed');
  return data;
};
