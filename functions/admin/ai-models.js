import { handleAdminAiModels } from '../_shared/ai.js';
export const onRequestGet = ({ request, env }) => handleAdminAiModels(request, env);
