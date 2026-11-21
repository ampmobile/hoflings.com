import { handleRentalQuoteCreate } from './_shared/core.js';

export const onRequestPost = ({ request, env }) => handleRentalQuoteCreate(request, env);
export const onRequestOptions = ({ request, env }) => handleRentalQuoteCreate(request, env);
