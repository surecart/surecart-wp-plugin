import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

if (window?.scData) {
  apiFetch.use(apiFetch.createRootURLMiddleware(window?.scData?.root_url));
  // @ts-ignore
  apiFetch.nonceMiddleware = apiFetch.createNonceMiddleware(window?.scData?.nonce);
  // @ts-ignore
  apiFetch.use(apiFetch.nonceMiddleware);
  // @ts-ignore
  apiFetch.nonceEndpoint = window?.scData?.nonce_endpoint;
}

export default apiFetch;
