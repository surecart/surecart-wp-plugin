import { newSpecPage } from '@stencil/core/testing';
import { ScCartIcon } from '../sc-cart-icon';
import { dispose as disposeCheckout, state as checkoutState } from '@store/checkout';
import { Checkout } from '../../../../types';

describe('sc-cart-icon', () => {
  beforeEach(() => {
    disposeCheckout();
  });

  it('renders', async () => {
    checkoutState.checkout = {
      id: 'test',
    } as Checkout;
    const page = await newSpecPage({
      components: [ScCartIcon],
      html: `<sc-cart-icon></sc-cart-icon>`,
    });

    expect(page.root).toMatchSnapshot();
  });
});
