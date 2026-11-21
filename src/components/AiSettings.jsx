import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function AiSettings() {
  const [models, setModels] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState('');
  const loadModels = async () => {
    setLoadingModels(true); setModelError('');
    const { ok, data } = await api('/admin/ai-models');
    setLoadingModels(false);
    if (!ok || !Array.isArray(data?.models)) { setModelError(data?.error || 'Could not load models.'); return; }
    setModels(data.models); setModelsLoaded(true);
  };
  const [config, setConfig] = useState(null);
  const [key, setKey] = useState('');
  const [model, setModel] = useState('gpt-5-mini');
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [checking, setChecking] = useState(false);

  const recheck = async () => {
    setChecking(true);setError('');setNotice('');
    const { ok, data } = await api('/admin/ai-settings');
    setChecking(false);
    if (!ok) { setError(data?.error || 'Could not recheck saved status. Your saved key has not been changed.'); return; }
    setConfig(data);
    setNotice(data.configured ? 'Confirmed: your key is still saved securely. The empty input does not mean it was removed.' : 'No saved key was found. Paste an OpenAI key and save it.');
  };

  const savedTime = config?.updated_at && !Number.isNaN(Date.parse(config.updated_at))
    ? new Date(config.updated_at).toLocaleString() : null;

  useEffect(() => {
    let active = true;
    api('/admin/ai-settings').then(({ ok, data }) => {
      if (!active) return;
      if (!ok) { setError(data?.error || 'Could not load AI settings.'); return; }
      if (data?.configured) loadModels();
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
    if (data?.configured) loadModels();
    if (!ok || !data?.ok) { setError(data?.error || 'Could not save settings. Paste the key again if needed.'); return; }
    setConfig(data);
    setNotice(data.configured ? 'Saved and verified in encrypted storage. The input is intentionally cleared; your saved key remains available to the backend.' : 'Settings saved. Add an API key to enable reply generation.');
  };

  return (
    <section className="admin__settings" aria-labelledby="ai-settings-title">
      <h2 id="ai-settings-title">OpenAI reply drafting</h2>
      <p>Paste your OpenAI API key here. It is sent over HTTPS to the admin backend, encrypted in Supabase Vault, and used only server-side.</p>
      <div className={`admin__keycard${config?.configured ? ' is-saved' : ''}`} role="status">
        <strong>{config ? config.configured ? 'API key saved securely' : 'No API key saved' : error ? 'Saved status unavailable' : 'Checking saved key…'}</strong>
        <p>{config?.configured ? 'Your key is encrypted in Supabase Vault. The blank field below is only for entering a replacement—it does not show or delete the saved key.' : 'Paste your OpenAI secret key below and save it. The saved secret will never be shown back on this page.'}</p>
        {savedTime && <small>Last settings save: {savedTime} · Model: {config.model}</small>}
        <button className="btn btn--line btn--sm" type="button" onClick={recheck} disabled={checking || busy}>{checking ? 'Checking…' : 'Recheck saved status'}</button>
      </div>
      <form onSubmit={save} autoComplete="off">
        <label htmlFor="openai-api-key">{config?.configured ? 'Replace API key (optional)' : 'OpenAI API key'}</label>
        <input id="openai-api-key" name="openai_api_key" type="password" autoComplete="off" spellCheck="false"
          placeholder={config?.configured ? 'Saved key on file — leave blank unless replacing it' : 'sk-…'}
          value={key} onChange={event => setKey(event.target.value)} maxLength={512} disabled={busy} />
        <p className="admin__settings-help">An empty field keeps the saved key unchanged. It is cleared after saving for security.</p>
        <label htmlFor="openai-model">Model</label>
        <select id="openai-model" required value={model} onChange={event => setModel(event.target.value)} disabled={busy}>
          {!models.includes(model) && <option value={model}>{model}{modelsLoaded ? ' — not listed for this API key' : ' — saved selection'}</option>}
          {models.map(id => <option key={id} value={id}>{id}</option>)}
        </select>
        <button className="btn btn--line btn--sm" type="button" onClick={loadModels} disabled={loadingModels || busy || !config?.configured}>{loadingModels ? 'Loading models…' : 'Refresh available models'}</button>
        <p className="admin__settings-help">All model IDs returned by OpenAI for your saved API key. Choose a text model that supports the Responses API; image, audio and embedding models cannot draft these replies. Save settings after selecting a model.</p>
        {modelError && <p className="auth__msg auth__msg--bad" role="alert">{modelError}</p>}
        <label className="admin__settings-check"><input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} disabled={busy} /> Enable AI reply drafting</label>
        {error && <p className="auth__msg auth__msg--bad" role="alert">{error}</p>}
        {notice && <p className="admin__replynotice" role="status">{notice}</p>}
        <button className="btn btn--fill" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save AI settings'}</button>
      </form>
      <p className="admin__settings-help">Generate with AI sends the inquiry, recent sent replies and your instructions to OpenAI. It replaces the reply text with a draft; it does not send email. OpenAI API usage is billed to your API account.</p>
    </section>
  );
}
