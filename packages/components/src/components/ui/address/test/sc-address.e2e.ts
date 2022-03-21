import { newE2EPage } from '@stencil/core/testing';

describe('sc-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-address></sc-address>');

    const element = await page.find('sc-address');
    expect(element).toHaveClass('hydrated');
  });
});
