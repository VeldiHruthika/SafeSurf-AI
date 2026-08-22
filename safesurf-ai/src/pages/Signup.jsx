import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, HeartPulse, User, Mail, Phone, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[0-9]{10,15}$/;

export default function Signup() {
  const { signup, verifySignupOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('details'); // details | otp | done
  const [form, setForm] = useState({
    username: '',
    email: '',
    mobile: '',
    otp: '',
  });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const validateDetails = () => {
    const errs = {};

    if (!form.username.trim()) {
      errs.username = 'Username is required';
    } else if (form.username.trim().length > 100) {
      errs.username = 'Max 100 characters';
    }

    if (!EMAIL_RE.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!MOBILE_RE.test(form.mobile)) {
      errs.mobile = 'Enter 10–15 digits';
    }

    return errs;
  };

  const handleDetails = async (e) => {
    e.preventDefault();
    setServerMsg('');

    const errs = validateDetails();
    setErrors(errs);

    if (Object.keys(errs).length) return;

    setBusy(true);

    // Contract §5.1: 200 OTP sent · 400 invalid · 409 email/mobile taken · 500 email failed
    const { ok, data } = await signup({
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      mobile: form.mobile.trim(),
    });

    setBusy(false);

    if (ok && data.success) {
      setStep('otp');
    } else {
      setServerMsg(data.message ?? 'Signup failed. Please try again.');
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setServerMsg('');

    if (!/^[0-9]{6}$/.test(form.otp)) {
      return setErrors({ otp: 'Enter the 6-digit OTP' });
    }

    setErrors({});
    setBusy(true);

    // Contract §5.2: 201 created · 401 invalid · 404 none · 410 expired · 429 attempts · 409 taken meanwhile
    const { ok, data } = await verifySignupOtp({
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      mobile: form.mobile.trim(),
      otp: form.otp,
    });

    setBusy(false);

    if (ok && data.success) {
      setStep('done');
    } else {
      setServerMsg(data.message ?? 'OTP verification failed.');
    }
  };

  return (
    <main className="ss-auth">
      <Link to="/" className="ss-back">
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <div className="ss-card ss-auth-card">
        <div className="ss-icon">
          {step === 'details' ? (
            <User size={22} />
          ) : step === 'otp' ? (
            <KeyRound size={22} />
          ) : (
            <CheckCircle2 size={22} />
          )}
        </div>
        <span className="ss-eyebrow">
          <HeartPulse size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
          SafeSurf AI
        </span>
        <h1 className="ss-title">
          {step === 'details'
            ? 'Create your account'
            : step === 'otp'
              ? 'Verify OTP'
              : 'Welcome aboard'}
        </h1>

        {step === 'details' && (
          <form onSubmit={handleDetails} noValidate>
            {serverMsg && (
              <p className="ss-error" role="alert">
                <AlertCircle size={16} />
                {serverMsg}
              </p>
            )}

            <label className="ss-label">
              Username
              <span className="ss-input-wrap">
                <User size={16} />
                <input
                  className="ss-input"
                  value={form.username}
                  onChange={set('username')}
                  maxLength={101}
                  autoComplete="username"
                />
              </span>
              {errors.username && (
                <span className="ss-fielderr">{errors.username}</span>
              )}
            </label>

            <label className="ss-label">
              Email
              <span className="ss-input-wrap">
                <Mail size={16} />
                <input
                  className="ss-input"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                />
              </span>
              {errors.email && (
                <span className="ss-fielderr">{errors.email}</span>
              )}
            </label>

            <label className="ss-label">
              Mobile number
              <span className="ss-input-wrap">
                <Phone size={16} />
                <input
                  className="ss-input"
                  inputMode="numeric"
                  value={form.mobile}
                  onChange={set('mobile')}
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                />
              </span>
              {errors.mobile && (
                <span className="ss-fielderr">{errors.mobile}</span>
              )}
            </label>

            <button className="ss-btn" disabled={busy}>
              {busy ? 'Sending OTP…' : 'Sign up'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtp} noValidate>
            <p className="ss-hint">
              We sent a 6-digit code to <strong>{form.email}</strong>. It
              expires in 5 minutes.
            </p>

            {serverMsg && (
              <p className="ss-error" role="alert">
                <AlertCircle size={16} />
                {serverMsg}
              </p>
            )}

            <label className="ss-label">
              OTP
              <input
                className="ss-input ss-otp"
                inputMode="numeric"
                maxLength={6}
                value={form.otp}
                onChange={set('otp')}
                autoFocus
                placeholder="••••••"
              />
              {errors.otp && (
                <span className="ss-fielderr">{errors.otp}</span>
              )}
            </label>

            <button className="ss-btn" disabled={busy}>
              {busy ? 'Verifying…' : 'Verify OTP'}
            </button>

            <button
              type="button"
              className="ss-linkbtn"
              onClick={() => setStep('details')}
            >
              ← Edit my details
            </button>
          </form>
        )}

        {step === 'done' && (
          <div>
            <p className="ss-success">
              <CheckCircle2 size={18} />
              Account created successfully!
            </p>

            <button
              className="ss-btn"
              onClick={() =>
                navigate('/login', {
                  state: {
                    email: form.email.trim().toLowerCase(),
                  },
                })
              }
            >
              Go to Login
            </button>
          </div>
        )}

        <p className="ss-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
