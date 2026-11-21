-- Keys are encrypted by Supabase Vault; neither a public table nor a client API exposes them.
create schema if not exists hoflings_private;
revoke all on schema hoflings_private from public, anon, authenticated;
grant usage on schema hoflings_private to service_role;

create table hoflings_private.ai_reply_settings (
  id text primary key check (id = 'openai_reply'),
  vault_secret_id uuid,
  model text not null default 'gpt-5-mini' check (char_length(model) between 1 and 100),
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table hoflings_private.ai_reply_settings enable row level security;
revoke all on hoflings_private.ai_reply_settings from public, anon, authenticated;

create function hoflings_private.get_openai_reply_config() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  cfg hoflings_private.ai_reply_settings%rowtype;
  secret_value text;
begin
  select * into cfg from hoflings_private.ai_reply_settings where id = 'openai_reply';
  if not found then
    return jsonb_build_object('api_key', null, 'model', 'gpt-5-mini', 'enabled', true, 'updated_at', null);
  end if;
  if cfg.vault_secret_id is not null then
    select decrypted_secret into secret_value from vault.decrypted_secrets where id = cfg.vault_secret_id;
  end if;
  return jsonb_build_object('api_key', secret_value, 'model', cfg.model, 'enabled', cfg.enabled, 'updated_at', cfg.updated_at);
end;
$$;

create function hoflings_private.save_openai_reply_config(p_api_key text, p_model text, p_enabled boolean, p_actor text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  secret_id uuid;
begin
  if p_model is null or p_model !~ '^[A-Za-z0-9._:-]{1,100}$' then raise exception 'Invalid model ID'; end if;
  if p_api_key is not null and p_api_key <> '' and (left(p_api_key, 3) <> 'sk-' or char_length(p_api_key) > 512) then
    raise exception 'Invalid API key format';
  end if;
  insert into hoflings_private.ai_reply_settings(id) values ('openai_reply') on conflict do nothing;
  select vault_secret_id into secret_id from hoflings_private.ai_reply_settings where id = 'openai_reply' for update;
  if p_api_key is not null and p_api_key <> '' then
    if secret_id is null then
      select vault.create_secret(p_api_key, 'hoflings_openai_reply_key', 'OpenAI API key for admin reply drafting') into secret_id;
    else
      perform vault.update_secret(secret_id, p_api_key);
    end if;
  end if;
  update hoflings_private.ai_reply_settings
    set vault_secret_id = secret_id, model = p_model, enabled = coalesce(p_enabled, true), updated_at = now(), updated_by = left(p_actor, 200)
    where id = 'openai_reply';
  return jsonb_build_object('configured', secret_id is not null, 'model', p_model, 'enabled', coalesce(p_enabled, true), 'updated_at', now());
end;
$$;

-- REST-visible wrappers are SECURITY INVOKER and callable only by the backend service role.
create function public.get_openai_reply_config() returns jsonb
language sql security invoker set search_path = '' as $$ select hoflings_private.get_openai_reply_config(); $$;
create function public.save_openai_reply_config(p_api_key text, p_model text, p_enabled boolean, p_actor text) returns jsonb
language sql security invoker set search_path = '' as $$ select hoflings_private.save_openai_reply_config(p_api_key, p_model, p_enabled, p_actor); $$;

revoke all on function hoflings_private.get_openai_reply_config() from public, anon, authenticated;
revoke all on function hoflings_private.save_openai_reply_config(text,text,boolean,text) from public, anon, authenticated;
revoke all on function public.get_openai_reply_config() from public, anon, authenticated;
revoke all on function public.save_openai_reply_config(text,text,boolean,text) from public, anon, authenticated;
grant execute on function hoflings_private.get_openai_reply_config() to service_role;
grant execute on function hoflings_private.save_openai_reply_config(text,text,boolean,text) to service_role;
grant execute on function public.get_openai_reply_config() to service_role;
grant execute on function public.save_openai_reply_config(text,text,boolean,text) to service_role;
notify pgrst, 'reload schema';
