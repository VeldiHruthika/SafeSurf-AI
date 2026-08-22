import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HeartPulse, MessageSquare, User, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api';

import '../styles/Login.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverMsg, setServerMsg] = useState('');

  const set = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = 'Name is required';
    }

    if (!EMAIL_RE.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!form.message.trim()) {
      errs.message = 'Message cannot be empty';
    } else if (form.message.trim().length > 2000) {
      errs.message = 'Max 2000 characters';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length) return;

    setStatus('sending');
    setServerMsg('');

    const { ok, data } = await api('/api/contact', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        message: form.message.trim(),
      },
    });

    if (ok && data.success) {
      setStatus('sent');
      setForm({
        name: '',
        email: '',
        message: '',
      });
    } else {
      setStatus('error');
      setServerMsg(data.message ?? 'Something went wrong.');
    }
  };

  return (
    <main className="ss-auth">
      <Link to="/" className="ss-back">
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <div className="ss-card ss-auth-card ss-contact-card">
        <div className="ss-icon">
          <MessageSquare size={22} />
        </div>
        <span className="ss-eyebrow">
          <HeartPulse size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
          SafeSurf AI
        </span>
        <h1 className="ss-title">Get in touch</h1>

        {status === 'sent' && (
          <p className="ss-success" role="status">
            <CheckCircle2 size={18} />
            Thanks! Your message was sent — we'll get back to you soon.
          </p>
        )}

        {status === 'error' && (
          <p className="ss-error" role="alert">
            <AlertCircle size={16} />
            {serverMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label className="ss-label">
            Name
            <span className="ss-input-wrap">
              <User size={16} />
              <input
                className="ss-input"
                value={form.name}
                onChange={set('name')}
                maxLength={101}
              />
            </span>
            {errors.name && (
              <span className="ss-fielderr">{errors.name}</span>
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
            Message
            <textarea
              className="ss-input"
              rows={6}
              value={form.message}
              onChange={set('message')}
            />
            {errors.message && (
              <span className="ss-fielderr">{errors.message}</span>
            )}
          </label>

          <button className="ss-btn" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </main>
  );
}
