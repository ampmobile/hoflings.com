import { handleAuthLogin } from '../_shared/core.js';

export const onRequestPost = ({ request, env }) => handleAuthLogin(request, env);
