import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Bump } from '../../../../../types';
import { ScOrderBump } from '../sc-order-bump';

describe('sc-order-bump', () => {
  it('renders empty', async () => {
    const page = await newSpecPage({
      components: [ScOrderBump],
      html: `<sc-order-bump></sc-order-bump>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders bump with name', async () => {
    const page = await newSpecPage({
      components: [ScOrderBump],
      template: () => <sc-order-bump bump={{ name: 'Test' } as Bump}></sc-order-bump>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders bump with description, cta and image', async () => {
    const page = await newSpecPage({
      components: [ScOrderBump],
      template: () => (
        <sc-order-bump
          bump={{ metadata: { description: 'Description', cta: 'CTA test' }, price: { product: { image_url: 'https://test.com/image.jpg' } } } as Bump}
        ></sc-order-bump>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders bump does not render an image without a description', async () => {
    const page = await newSpecPage({
      components: [ScOrderBump],
      template: () => <sc-order-bump bump={{ metadata: { cta: 'CTA test' }, price: { product: { image_url: 'https://test.com/image.jpg' } } } as Bump}></sc-order-bump>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders bump with percent off', async () => {
    const page = await newSpecPage({
      components: [ScOrderBump],
      template: () => <sc-order-bump bump={{ percent_off: 50, price: { amount: 1000, currency: 'usd' } } as Bump}></sc-order-bump>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders bump with amount off', async () => {
    const page = await newSpecPage({
      components: [ScOrderBump],
      template: () => <sc-order-bump bump={{ amount_off: -500, price: { amount: 1000, currency: 'usd' } } as Bump}></sc-order-bump>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
