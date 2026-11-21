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
  const [mfa, setMfa] = useState(null);
  const [code, setCode] = useState('');
  const beginMfa = async () => {
    setPassword(''); setConfirm(''); setMode('mfa'); setBusy(true); setError('');
    const { ok, data } = await api('/auth/mfa');
    setBusy(false);
    if (!ok) { setError(data?.error || 'Could not load authenticator status. Sign in again.'); return; }
    if (data.verified) { window.location.replace(next); return; }
    setMfa(data);
  };
  const enroll = async () => {
    setBusy(true); setError(''); setCode('');
    const { ok, data } = await api('/auth/mfa', { method: 'POST', body: { action: 'enroll' } });
    setBusy(false);
    if (!ok) { setError(data?.error || 'Could not start setup.'); return; }
    setMfa({ enrolled: false, ...data });
  };

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
      else if (data?.mfa_required) beginMfa();
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
        await beginMfa();
        return;
      }

      if (mode === 'signup') {
        if (password !== confirm) throw new Error('Those passwords do not match.');
        const { ok, data } = await api('/auth/signup', { method: 'POST', body: { email, password } });
        if (!ok) throw new Error(data?.error || 'Could not create the account.');
        await beginMfa();
        return;
      }

      if (mode === 'mfa') {
        const factorId = mfa?.factor_id || mfa?.factors?.[0]?.id;
        if (!factorId || !/^\d{6}$/.test(code)) throw new Error('Enter the six-digit code from Google Authenticator.');
        const { ok, data } = await api('/auth/mfa', { method: 'POST', body: { action: 'verify', factor_id: factorId, code } });
        setCode('');
        if (!ok) throw new Error(data?.error || 'Verification failed. Try the current code.');
        setMfa(null);
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
    mfa: mfa?.enrolled ? 'Verify your sign-in' : 'Set up two-factor login',
    signin: 'Operations console',
    signup: 'Create the admin account',
    forgot: 'Reset your password',
    reset: 'Choose a new password',
  }[mode];

  const blurb = {
    mfa: mfa?.enrolled ? 'Enter the current six-digit code from Google Authenticator.' : 'Add your Hoflings account to Google Authenticator to secure the admin console.',
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
            {mode !== 'reset' && mode !== 'mfa' && (
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

            {mode !== 'forgot' && mode !== 'mfa' && (
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

            {mode === 'mfa' && mfa && (
              <div className="auth__mfa">
                {!mfa.enrolled && !mfa.factor_id && <button className="btn btn--line btn--block" type="button" onClick={enroll} disabled={busy}>Set up Google Authenticator</button>}
                {mfa.qr_code && <>
                  <p>In Google Authenticator, tap +, then Scan a QR code. Scan this code and enter the six-digit code below.</p>
                  <img className="auth__qr" src={mfa.qr_code.startsWith('data:image/svg+xml;utf-8,') ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(mfa.qr_code.slice('data:image/svg+xml;utf-8,'.length))}` : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(mfa.qr_code)}`} alt="Scan to add your Hoflings account to Google Authenticator" />
                  <details><summary>Enter a setup key instead</summary><p>Choose Enter a setup key in Google Authenticator. Account: Hoflings. Key type: Time based.</p><code className="auth__secret">{mfa.secret}</code></details>
                  <p>Keep access to your authenticator. If your device is lost, account recovery requires the site owner to reset the factor securely.</p>
                </>}
                {(mfa.enrolled || mfa.factor_id) && <>
                  {mfa.factors?.length > 1 && <div className="field"><label htmlFor="a-factor">Authenticator</label><select id="a-factor" value={mfa.factor_id || mfa.factors[0].id} onChange={event => setMfa(current => ({ ...current, factor_id: event.target.value }))}>{mfa.factors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>}
                  <div className="field"><label htmlFor="a-code">Authenticator code</label><input id="a-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ''))} placeholder="000000" required /></div>
                </>}
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

            <button className="btn btn--fill btn--block" type="submit" disabled={busy || (mode === 'mfa' && !mfa?.enrolled && !mfa?.factor_id)}>
              {busy ? 'Working…' : mode === 'mfa' ? 'Verify and sign in' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Set new password'}
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
              <button type="button" onClick={async () => { if (mode === 'mfa') { await api('/auth/logout', { method: 'POST' }); setMfa(null); setCode(''); } setMode('signin'); setError(''); }}>
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
