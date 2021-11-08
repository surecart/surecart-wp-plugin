import { getQueryArg } from '@wordpress/url';
import { CheckoutSession } from '../../../../../types';

/**
 * Attempt to get the session id
 *
 * @param formId The form id.
 * @param checkoutSession The checkoutSession
 * @param refresh Should we refresh?
 *
 * @returns string
 */
export const getSessionId = (formId, checkoutSession) => {
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

// find the input based on the unique name.
export const findInput = (el, name) => {
  const slot = el.querySelector('ce-form')?.shadowRoot?.querySelector('slot') as HTMLSlotElement;
  if (!slot) return;
  return slot
    .assignedElements({ flatten: true })
    .reduce((all: HTMLElement[], el: HTMLElement) => all.concat(el, [...el.querySelectorAll('*')] as HTMLElement[]), [])
    .find((el: HTMLInputElement) => el.name === name) as HTMLElement;
};

export const populateInputs = (el, session: CheckoutSession) => {
  // handle our own built-in inputs.
  const names = ['name', 'email'];

  // handle our our inputs.
  names.forEach(name => {
    const input = findInput(el, name) as any;
    if (!input) return;
    input.value = session[name];
  });

  // update metadata.
  Object.keys(session.metadata).forEach(key => {
    const input = findInput(el, key) as any;
    if (!input) return;
    input.value = session.metadata[key];
  });
};
