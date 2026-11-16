import { handleAuthSignup } from '../_shared/core.js';

export const onRequestPost = ({ request, env }) => handleAuthSignup(request, env);
