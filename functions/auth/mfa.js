import { handleAuthMfa } from '../_shared/mfa.js';
export const onRequestGet = ({ request, env }) => handleAuthMfa(request, env);
export const onRequestPost = ({ request, env }) => handleAuthMfa(request, env);
