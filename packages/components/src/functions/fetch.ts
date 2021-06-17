import apiFetch from '@wordpress/api-fetch';

// do any middlewares here
const rootURL = 'https://checkout-engine.local/wp-json/checkout-engine/v1/';
apiFetch.use(apiFetch.createRootURLMiddleware(rootURL));

export default apiFetch;
