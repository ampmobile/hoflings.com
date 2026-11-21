import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function AiSettings() {
  const [config, setConfig] = useState(null);
  const [key, setKey] = useState('');
  const [model, setModel] = useState('gpt-5-mini');
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    api('/admin/ai-settings').then(({ ok, data }) => {
      if (!active) return;
      if (!ok) { setError(data?.error || 'Could not load AI settings.'); return; }
      setConfig(data);setModel(data.model || 'gpt-5-mini');setEnabled(data.enabled !== false);
    });
    return () => { active = false; };
  }, []);

  const save = async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);setError('');setNotice('');
    const { ok, data } = await api('/admin/ai-settings', {
      method: 'POST', body: { api_key: key, model, enabled },
    });
    // Never retain the submitted credential in component state after a request.
    setKey('');setBusy(false);
    if (!ok || !data?.ok) { setError(data?.error || 'Could not save settings. Paste the key again if needed.'); return; }
    setConfig(data);
    setNotice(data.configured ? 'AI settings saved. The key is encrypted in Supabase Vault and is not returned to this page.' : 'Settings saved. Add an API key to enable reply generation.');
  };

  return (
    <section className="admin__settings" aria-labelledby="ai-settings-title">
      <h2 id="ai-settings-title">OpenAI reply drafting</h2>
      <p>Paste your OpenAI API key here. It is sent over HTTPS to the admin backend, encrypted in Supabase Vault, and used only server-side.</p>
      <p className="admin__key-status"><b>API key:</b> {config ? config.configured ? 'Configured (hidden)' : 'Not configured' : error ? 'Unavailable' : 'Loading…'}</p>
      <form onSubmit={save} autoComplete="off">
        <label htmlFor="openai-api-key">{config?.configured ? 'Replace API key' : 'OpenAI API key'}</label>
        <input id="openai-api-key" name="openai_api_key" type="password" autoComplete="off" spellCheck="false"
          placeholder={config?.configured ? 'Leave blank to keep the saved key' : 'sk-…'}
          value={key} onChange={event => setKey(event.target.value)} maxLength={512} disabled={busy} />
        <p className="admin__settings-help">The saved key cannot be viewed or copied back from this screen. Leave blank to keep it.</p>
        <label htmlFor="openai-model">Model ID</label>
        <input id="openai-model" required maxLength={100} value={model} onChange={event => setModel(event.target.value)} disabled={busy} />
        <p className="admin__settings-help">Default: gpt-5-mini. Use an OpenAI model available to your API project that supports the Responses API.</p>
        <label className="admin__settings-check"><input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} disabled={busy} /> Enable AI reply drafting</label>
        {error && <p className="auth__msg auth__msg--bad" role="alert">{error}</p>}
        {notice && <p className="admin__replynotice" role="status">{notice}</p>}
        <button className="btn btn--fill" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save AI settings'}</button>
      </form>
      <p className="admin__settings-help">Generate with AI sends the inquiry, recent sent replies and your instructions to OpenAI. It replaces the reply text with a draft; it does not send email. OpenAI API usage is billed to your API account.</p>
    </section>
  );
}
