import { getQueryArg } from '@wordpress/url';

/**
 * Attempt to get the session id
 *
 * @param formId The form id.
 * @param checkoutSession The checkoutSession
 * @param refresh Should we refresh?
 *
 * @returns string
 */
export const getSessionId = (formId, checkoutSession, refresh = false) => {
  // if we want to get a fresh session, skip
  if (refresh === true) {
    return false;
  }

  // if we already have an ID set, return that:
  if (checkoutSession?.id) {
    return checkoutSession.id;
  }

  // check the url query first
  const urlId = getQueryArg(window.location.href, 'checkout_session');
  if (urlId) {
    return urlId;
  }

  // check id in localstorage
  return window.localStorage.getItem(formId);
};
