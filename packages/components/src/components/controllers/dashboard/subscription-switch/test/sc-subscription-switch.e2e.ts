import { newE2EPage } from '@stencil/core/testing';

describe('sc-subscription-switch', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-subscription-switch></sc-subscription-switch>');

    const element = await page.find('sc-subscription-switch');
    expect(element).toHaveClass('hydrated');
  });
});
