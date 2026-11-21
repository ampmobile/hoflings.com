import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { Icon } from '../components/Icons.jsx';

/**
 * Admin sign-in — mounted at /auth.
 *
 * Four modes share one panel:
 *   signin  default
 *   signup  first-run account creation (restricted to the admin address)
 *   forgot  password reset request
 *   reset   set a new password from a recovery link
 */
export default function Auth() {
  const requestedNext = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('next') : null;
  const next = requestedNext === '/admin#settings' ? requestedNext : '/admin';
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // A recovery link arrives with the token in the URL fragment.
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const accessToken = hash.get('access_token');
    if (accessToken) {
      setToken(accessToken);
      setMode('reset');
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    api('/auth/session').then(({ data }) => {
      if (data?.authenticated) window.location.replace(next);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);

    try {
      if (mode === 'signin') {
        const { ok, data } = await api('/auth/login', { method: 'POST', body: { email, password } });
        if (!ok) throw new Error(data?.error || 'Sign in failed.');
        window.location.replace(next);
        return;
      }

      if (mode === 'signup') {
        if (password !== confirm) throw new Error('Those passwords do not match.');
        const { ok, data } = await api('/auth/signup', { method: 'POST', body: { email, password } });
        if (!ok) throw new Error(data?.error || 'Could not create the account.');
        window.location.replace(next);
        return;
      }

      if (mode === 'forgot') {
        const { ok, data } = await api('/auth/forgot', { method: 'POST', body: { email } });
        if (!ok) throw new Error(data?.error || 'Could not start the reset.');
        setNotice('If that address is registered, a reset link is on its way.');
        setMode('signin');
        return;
      }

      if (mode === 'reset') {
        const { ok, data } = await api('/auth/reset', { method: 'POST', body: { access_token: token, password } });
        if (!ok) throw new Error(data?.error || 'Could not update the password.');
        setNotice('Password updated. Sign in with the new one.');
        setMode('signin');
        setPassword('');
        setConfirm('');
        return;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const heading = {
    signin: 'Operations console',
    signup: 'Create the admin account',
    forgot: 'Reset your password',
    reset: 'Choose a new password',
  }[mode];

  const blurb = {
    signin: 'Sign in to read the enquiries that come in through the contact form.',
    signup: 'One account, one address. Set it up once and it is the only way into the inbox.',
    forgot: 'We will email a one-time link to set a new password.',
    reset: 'Pick something long. You will use it every time you open the inbox.',
  }[mode];

  return (
    <section className="sec sec--tight auth">
      <div className="wrap">
        <div className="auth__card panel panel--tick">
          <p className="kicker">Hoflings · restricted</p>
          <h1 className="auth__title">{heading}</h1>
          <p className="lede auth__lede">{blurb}</p>

          <form onSubmit={submit} noValidate>
            {mode !== 'reset' && (
              <div className="field">
                <label htmlFor="a-email">Admin email</label>
                <input
                  id="a-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hoflings.com"
                />
              </div>
            )}

            {mode !== 'forgot' && (
              <div className="field">
                <label htmlFor="a-pass">Password</label>
                <input
                  id="a-pass"
                  type="password"
                  autoComplete={mode === 'reset' ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                />
              </div>
            )}

            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="a-confirm">Confirm password</label>
                <input
                  id="a-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••••"
                />
              </div>
            )}

            {error && (
              <p className="auth__msg auth__msg--bad" role="alert">
                <span className="auth__dot" aria-hidden="true" /> {error}
              </p>
            )}
            {notice && (
              <p className="auth__msg auth__msg--good" role="status">
                <Icon name="check" /> {notice}
              </p>
            )}

            <button className="btn btn--fill btn--block" type="submit" disabled={busy}>
              {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Set new password'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          <div className="auth__links">
            {mode === 'signin' && (
              <>
                <button type="button" onClick={() => setMode('forgot')}>
                  Forgot password
                </button>
                <button type="button" onClick={() => setMode('signup')}>
                  Set up the admin account
                </button>
              </>
            )}
            {mode !== 'signin' && (
              <button type="button" onClick={() => setMode('signin')}>
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
