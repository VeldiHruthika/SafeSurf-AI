import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../api';

const TOKEN_KEY = 'ss_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  // The signed-in user, resolved from the token by the backend.
  const [user, setUser] = useState(null);

  // True until the stored token has been checked once, so the navbar can
  // avoid flashing "Login" at a user who is actually signed in.
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_KEY))
  );

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // -----------------------------------------------------
  // Restore the session on load / whenever the token changes.
  // A token in localStorage is only a claim - the backend decides
  // whether it is still valid.
  // -----------------------------------------------------

  useEffect(() => {
    // No token means nothing to restore. `loading` was initialised from
    // the stored token and `clearSession` already clears `user`, so
    // there is no state to update here.
    if (!token) return;

    let cancelled = false;

    api('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((result) => {
      if (cancelled) return;

      if (result.ok && result.data?.user) {
        setUser(result.data.user);
      } else if (result.status === 401) {
        // Token was rejected - drop it rather than pretending we are
        // signed in. A network error (status 0) is left alone so a brief
        // backend outage does not log the user out.
        clearSession();
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [token, clearSession]);

  const value = useMemo(() => {
    // Contract §5.1: 200 OTP sent · 400 invalid · 409 email/mobile taken · 500 email failed
    const signup = ({ username, email, mobile }) =>
      api('/api/auth/signup', {
        method: 'POST',
        body: { username, email, mobile },
      });

    // Contract §5.2: 201 created · 401 invalid · 404 none · 410 expired · 429 attempts · 409 taken meanwhile
    const verifySignupOtp = ({ username, email, mobile, otp }) =>
      api('/api/auth/signup/verify', {
        method: 'POST',
        body: { username, email, mobile, otp },
      });

    // Contract §6.1: 200 sent · 400 invalid · 403 unverified · 404 no account
    const sendLoginOtp = (email) =>
      api('/api/auth/login', {
        method: 'POST',
        body: { email },
      });

    // Contract §6.2: 200 → { token } · 401 invalid · 404 none · 410 expired · 429 attempts
    const verifyLoginOtp = async ({ email, otp }) => {
      const result = await api('/api/auth/login/verify', {
        method: 'POST',
        body: { email, otp },
      });

      if (result.ok && result.data?.token) {
        localStorage.setItem(TOKEN_KEY, result.data.token);
        setToken(result.data.token);

        // The verify response already carries the user, so the navbar
        // updates immediately instead of waiting for /api/auth/me.
        if (result.data.user) {
          setUser(result.data.user);
        }
      }

      return result;
    };

    const logout = async () => {
      // Tell the backend to destroy the session, then clear locally
      // regardless of the outcome - the user asked to be logged out.
      if (token) {
        await api('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      clearSession();
    };

    return {
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      signup,
      verifySignupOtp,
      sendLoginOtp,
      verifyLoginOtp,
      logout,
    };
  }, [token, user, loading, clearSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
