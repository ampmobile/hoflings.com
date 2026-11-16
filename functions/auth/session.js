import { handleAuthSession } from '../_shared/core.js';

export const onRequestGet = ({ request, env }) => handleAuthSession(request, env);
