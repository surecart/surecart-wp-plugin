import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

apiFetch.fetchAllMiddleware = null;

if (window?.scData?.root_url) {
  apiFetch.use(apiFetch.createRootURLMiddleware(window?.scData?.root_url));
}

if (window?.scData?.nonce) {
  // @ts-ignore
  apiFetch.nonceMiddleware = apiFetch.createNonceMiddleware(window?.scData?.nonce);
  // @ts-ignore
  apiFetch.use(apiFetch.nonceMiddleware);
}

if (window?.scData?.nonce_endpoint) {
  // @ts-ignore
  apiFetch.nonceEndpoint = window?.scData?.nonce_endpoint;
}

// Add a timestamp so it can bypass cache rest api
apiFetch.use((options, next) => {
  options.path = addQueryArgs(options.path, { t: Date.now() });
  return next(options);
});

export default apiFetch;
