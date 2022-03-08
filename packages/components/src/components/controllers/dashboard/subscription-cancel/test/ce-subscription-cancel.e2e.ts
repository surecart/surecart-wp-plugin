import { newE2EPage } from '@stencil/core/testing';

describe('ce-subscription-cancel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-subscription-cancel></ce-subscription-cancel>');

    const element = await page.find('ce-subscription-cancel');
    expect(element).toHaveClass('hydrated');
  });
});
