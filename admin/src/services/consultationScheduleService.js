const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getConsultationSchedule = async () => {
  const res = await fetch(`${BACKEND_URL}/api/consultation-schedule`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Consultation schedule load failed');
  return data;
};

export const saveConsultationSchedule = async (payload) => {
  const res = await fetch(`${BACKEND_URL}/api/consultation-schedule`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Consultation schedule save failed');
  return data;
};

export const deleteConsultationSchedule = async () => {
  const res = await fetch(`${BACKEND_URL}/api/consultation-schedule`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Consultation schedule reset failed');
  return data;
};
