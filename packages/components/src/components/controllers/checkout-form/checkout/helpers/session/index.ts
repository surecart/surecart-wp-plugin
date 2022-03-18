import { getQueryArg } from '@wordpress/url';

/**
 * Attempt to get the session id
 *
 * @param formId The form id.
 * @param order The order
 * @param refresh Should we refresh?
 *
 * @returns string
 */
export const getSessionId = (formId, order) => {
  // if we already have an ID set, return that:
  if (order?.id) {
    return order.id;
  }

  // check the url query first
  const urlId = getQueryArg(window.location.href, 'order');
  if (urlId) {
    return urlId;
  }

  // check id in localstorage
  return window.localStorage.getItem(formId);
};
