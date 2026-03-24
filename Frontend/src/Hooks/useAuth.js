import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config/urls.js';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/auth/me`,
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { user, loading };
}
