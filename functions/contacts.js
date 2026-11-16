import { handleContactCreate } from './_shared/core.js';

export const onRequestPost = ({ request, env }) => handleContactCreate(request, env);
export const onRequestOptions = ({ request, env }) => handleContactCreate(request, env);
