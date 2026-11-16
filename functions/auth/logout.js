import { handleAuthLogout } from '../_shared/core.js';

export const onRequestPost = ({ request, env }) => handleAuthLogout(request, env);
