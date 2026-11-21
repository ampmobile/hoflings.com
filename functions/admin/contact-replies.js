import { handleAdminContactReply } from '../_shared/core.js';

export const onRequestPost = ({ request, env }) => handleAdminContactReply(request, env);
