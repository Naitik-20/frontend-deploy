const BACKEND_URL = 'https://dr-snoopy2.onrender.com';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getNormalUsers = async () => {
  const res = await fetch(`${BACKEND_URL}/api/auth/admin/users`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Users load failed');
  return data;
};
