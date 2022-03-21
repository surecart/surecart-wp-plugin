import { Order } from '../../../../../types';
import { getQueryArg } from '@wordpress/url';

export const getURLLineItems = () => {
  // check the url query first
  return getQueryArg(window.location.href, 'line_items');
};

/**
 * Attempt to get the session id
 *
 * @param formId The form id.
 * @param order The order
 * @param refresh Should we refresh?
 *
 * @returns string
 */
export const getSessionId = (formId, order, modified) => {
  // if we already have an ID set, return that:
  if (order?.id) {
    return order.id;
  }

  // check the url query first
  const urlId = getQueryArg(window.location.href, 'order');
  if (urlId) {
    return urlId;
  }

  const savedModification = localStorage.getItem(`${formId}-modified`);

  // nothing saved.
  if (!savedModification) {
    return window.localStorage.getItem(formId);
  }

  // this has not been modified, so return the saved session id.
  if (modified && savedModification === modified) {
    return window.localStorage.getItem(formId);
  }

  return '';
};

export const setSessionId = (formId, sessionId, modified) => {
  window.localStorage.setItem(formId, sessionId);
  window.localStorage.setItem(`${formId}-modified`, modified);
};

export const removeSessionId = formId => {
  // check id in localstorage
  return window.localStorage.removeItem(formId);
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

export const populateInputs = (el, order: Order) => {
  // handle our own built-in inputs.
  const names = ['name', 'email'];

  // handle our our inputs.
  names.forEach(name => {
    const input = findInput(el, name) as any;
    if (!input || !order[name]) return;
    input.value = order[name];
  });

  // update metadata.
  Object.keys(order?.metadata || {}).forEach(key => {
    const input = findInput(el, key) as any;
    if (!input || !order.metadata[key]) return;
    input.value = order.metadata[key];
  });
};
