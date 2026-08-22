import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api';

const TOKEN_KEY = 'ss_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

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
      }

      return result;
    };

    const logout = () => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    };

    return {
      token,
      isAuthenticated: Boolean(token),
      signup,
      verifySignupOtp,
      sendLoginOtp,
      verifyLoginOtp,
      logout,
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
