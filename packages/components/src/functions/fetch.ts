import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

apiFetch.fetchAllMiddleware = null;

apiFetch.use(apiFetch.createRootURLMiddleware(window?.parent?.scData?.root_url || window?.scData?.root_url));

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

apiFetch.use((options, next) => {
  const result = next(options);
  result.catch(response => {
    if (response.code === 'invalid_json') {
      response.message = __('The response is not a valid JSON response.', 'surecart');
      response.additional_errors = [
        {
          code: 'invalid_json',
          message: __(
            'If you are using debug logging, please ensure that WP_DEBUG_LOG, WP_DEBUG_DISPLAY, or other debug settings are disabled from the wp-config.php file. This may interfere with API responses. For more details, please check the WordPress debug settings or contact support.',
            'surecart',
          ),
        },
      ];
    }
    return Promise.reject(response);
  });

  return result;
});

export default apiFetch;

/**
 * Calls the `json` function on the Response, throwing an error if the response
 * doesn't have a json function or if parsing the json itself fails.
 *
 * @param {Response} response
 * @return {Promise<any>} Parsed response.
 */
export const parseJsonAndNormalizeError = response => {
  const invalidJsonError = {
    code: 'invalid_json',
    message: __('The response is not a valid JSON response.', 'surecart'),
  };

  if (response?.code && response?.message) {
    throw response;
  }

  if (!response || !response.json) {
    throw invalidJsonError;
  }

  return response.json().catch(() => {
    throw invalidJsonError;
  });
};

export const handleNonceError = async response => {
  // need to parse the error response since we are bypassing the apiFetch middleware.
  const error = await parseJsonAndNormalizeError(response);

  if (error.code !== 'rest_cookie_invalid_nonce') {
    // console.error(error);
    throw error;
  }

  // If the nonce is invalid, refresh it and try again.
  return (
    window
      // @ts-ignore
      .fetch(apiFetch.nonceEndpoint)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        throw response;
      })
      .then(data => data.text())
      .then(text => {
        // @ts-ignore
        apiFetch.nonceMiddleware.nonce = text;
      })
  );
};
