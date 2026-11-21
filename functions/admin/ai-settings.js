import { handleAdminAiSettings } from '../_shared/ai.js';
export const onRequestGet = ({ request, env }) => handleAdminAiSettings(request, env);
export const onRequestPost = ({ request, env }) => handleAdminAiSettings(request, env);
