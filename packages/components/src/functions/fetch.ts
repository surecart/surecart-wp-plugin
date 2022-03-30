import apiFetch from '@wordpress/api-fetch';

apiFetch.use(apiFetch.createRootURLMiddleware(window?.scData?.root_url));
// @ts-ignore
apiFetch.nonceMiddleware = apiFetch.createNonceMiddleware(window?.scData?.nonce);
// @ts-ignore
apiFetch.use(apiFetch.nonceMiddleware);
// @ts-ignore
apiFetch.nonceEndpoint = window?.scData?.nonce_endpoint;

export default apiFetch;
// let nonceRefreshCount = 0;

// console.log(window?.scData?.root_url);
// fetchImplementation.use(fetchImplementation.createRootURLMiddleware(window?.scData?.root_url));

// fetchImplementation.use((options, next) => {
//   const result = next(options);
//   result.catch(e => {
//     if (e?.code === 'rest_cookie_invalid_nonce') {
//       nonceRefreshCount++;
//       if (nonceRefreshCount === 3) {
//         alert('Your session expired. Please reload the page and try again.');
//         throw {
//           code: 'refresh_page',
//           message: 'Your session expired. Please reload the page.',
//         };
//       }
//     }
//     throw e;
//   });
//   return result;
// });

// export default fetchImplementation;
