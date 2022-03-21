import { Order } from '../../../../types';

// find the input based on the unique name.
export const findInput = (el, name) => {
  const slot = el.querySelector('sc-form')?.shadowRoot?.querySelector('slot') as HTMLSlotElement;
  if (!slot) return;
  return slot
    .assignedElements({ flatten: true })
    .reduce((all: HTMLElement[], el: HTMLElement) => all.concat(el, [...el.querySelectorAll('*')] as HTMLElement[]), [])
    .find((el: HTMLInputElement) => el.name === name) as HTMLElement;
};

export const handleInputs = (el, order: Order) => {
  // handle our own built-in inputs.
  const names = ['name', 'email'];

  // handle our our inputs.
  names.forEach(name => {
    const input = findInput(el, name) as any;
    if (!input) return;
    input.value = order[name];
  });

  // update metadata.
  Object.keys(order?.metadata || {}).forEach(key => {
    const input = findInput(el, key) as any;
    input.value = order.metadata[key];
  });
};
