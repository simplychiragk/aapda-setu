export const authClient = {
  async login({ userId, password, role }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId, password, role })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || 'Login failed');
    }
    return data;
  },
  async me() {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.status === 401) return { user: null };
    const data = await res.json().catch(() => null);
    return data;
  },
};

