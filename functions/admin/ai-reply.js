import { handleAdminAiReply } from '../_shared/ai.js';
export const onRequestPost = ({ request, env }) => handleAdminAiReply(request, env);
