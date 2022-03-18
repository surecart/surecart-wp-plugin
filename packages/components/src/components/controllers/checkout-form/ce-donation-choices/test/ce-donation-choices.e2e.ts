import { newE2EPage } from '@stencil/core/testing';

describe('ce-donation-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-donation-choices></ce-donation-choices>');

    const element = await page.find('ce-donation-choices');
    expect(element).toHaveClass('hydrated');
  });
});
