import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-manual-instructions', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-manual-instructions></sc-order-manual-instructions>');

    const element = await page.find('sc-order-manual-instructions');
    expect(element).toHaveClass('hydrated');
  });
});
