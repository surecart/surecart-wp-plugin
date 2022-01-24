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

  // const address_fields = ['line_1', 'line_2', 'city', 'state', 'postal_code', 'country'];
  // address_fields.forEach(name => {
  //   const shipping_input = findInput(el, `shipping_${name}`) as any;
  //   console.log({ shipping_input });
  //   if (shipping_input && typeof order?.shipping_address === 'object') {
  //     shipping_input.value = order?.shipping_address?.[name];
  //   }
  //   const billing_input = findInput(el, `billing_${name}`) as any;
  //   if (billing_input && typeof order?.billing_address === 'object') {
  //     billing_input.value = order?.billing_address?.[name];
  //   }
  // });

  // update metadata.
  Object.keys(order.metadata).forEach(key => {
    const input = findInput(el, key) as any;
    if (!input || !order.metadata[key]) return;
    input.value = order.metadata[key];
  });
};
