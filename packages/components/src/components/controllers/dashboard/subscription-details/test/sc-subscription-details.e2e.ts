import { newE2EPage } from '@stencil/core/testing';

describe('sc-subscription-details', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-subscription-details></sc-subscription-details>');

    const element = await page.find('sc-subscription-details');
    expect(element).toHaveClass('hydrated');
  });
});
