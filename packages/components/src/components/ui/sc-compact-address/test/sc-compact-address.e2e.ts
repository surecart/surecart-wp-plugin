import { newE2EPage } from '@stencil/core/testing';

describe('sc-compact-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-compact-address></sc-compact-address>');

    const element = await page.find('sc-compact-address');
    expect(element).toHaveClass('hydrated');
  });
});
