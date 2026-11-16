import { handleAuthForgot } from '../_shared/core.js';

export const onRequestPost = ({ request, env }) => handleAuthForgot(request, env);
