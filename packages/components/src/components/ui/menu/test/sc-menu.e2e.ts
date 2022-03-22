import { newE2EPage } from '@stencil/core/testing';

describe('sc-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-menu></sc-menu>');

    const element = await page.find('sc-menu');
    expect(element).toHaveClass('hydrated');
  });
});
