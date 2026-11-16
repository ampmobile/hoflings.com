import { handleAuthReset } from '../_shared/core.js';

export const onRequestPost = ({ request, env }) => handleAuthReset(request, env);
