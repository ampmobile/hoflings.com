import { handleAdminContacts } from '../_shared/core.js';

export const onRequestGet = ({ request, env }) => handleAdminContacts(request, env);
export const onRequestPatch = ({ request, env }) => handleAdminContacts(request, env);
export const onRequestPost = ({ request, env }) => handleAdminContacts(request, env);
export const onRequestDelete = ({ request, env }) => handleAdminContacts(request, env);
