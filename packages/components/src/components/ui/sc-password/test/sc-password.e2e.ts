import { newE2EPage } from '@stencil/core/testing';

describe('sc-password', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-password></sc-password>');

    const element = await page.find('sc-password');
    expect(element).toHaveClass('hydrated');
  });
});
