import { newE2EPage } from '@stencil/core/testing';

describe('ce-subscription-payment', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-subscription-payment></ce-subscription-payment>');

    const element = await page.find('ce-subscription-payment');
    expect(element).toHaveClass('hydrated');
  });
});
