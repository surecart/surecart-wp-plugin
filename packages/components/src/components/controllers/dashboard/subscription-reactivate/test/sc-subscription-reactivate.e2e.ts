import { newE2EPage } from '@stencil/core/testing';

describe('sc-subscription-reactivate', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-subscription-reactivate></sc-subscription-reactivate>');

    const element = await page.find('sc-subscription-reactivate');
    expect(element).toHaveClass('hydrated');
  });
});
