import { newE2EPage } from '@stencil/core/testing';

describe('ce-subscription-details', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-subscription-details></ce-subscription-details>');

    const element = await page.find('ce-subscription-details');
    expect(element).toHaveClass('hydrated');
  });
});
