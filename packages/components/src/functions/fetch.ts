import apiFetch from '@wordpress/api-fetch';

const fetchImplementation = window?.wp?.apiFetch ? window.wp.apiFetch : apiFetch;
let nonceRefreshCount = 0;

fetchImplementation.use((options, next) => {
  const result = next(options);
  result.catch(e => {
    if (e?.code === 'rest_cookie_invalid_nonce') {
      nonceRefreshCount++;
      if (nonceRefreshCount > 3) {
        throw {
          code: 'refresh_page',
          message: 'Your session expired. Please reload the page.',
        };
      }
    }
  });
  return result;
});

export default fetchImplementation;
