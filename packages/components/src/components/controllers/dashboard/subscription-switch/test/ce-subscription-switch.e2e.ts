import { newE2EPage } from '@stencil/core/testing';

describe('ce-subscription-switch', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-subscription-switch></ce-subscription-switch>');

    const element = await page.find('ce-subscription-switch');
    expect(element).toHaveClass('hydrated');
  });
});
