const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getConsultations = async () => (await fetch(`${BACKEND_URL}/api/online-consultations?includeInactive=true`)).json();
export const saveConsultation = async (payload, editingConsultation) => {
  const res = await fetch(editingConsultation ? `${BACKEND_URL}/api/online-consultations/${editingConsultation._id}` : `${BACKEND_URL}/api/online-consultations`, {
    method: editingConsultation ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Consultation save failed');
  return data;
};
export const deleteConsultation = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/online-consultations/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Consultation delete failed');
  return data;
};
