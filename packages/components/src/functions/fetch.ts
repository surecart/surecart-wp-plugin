import apiFetch from '@wordpress/api-fetch';

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

export default apiFetch;
