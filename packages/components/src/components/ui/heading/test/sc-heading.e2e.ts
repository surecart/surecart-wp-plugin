import { newE2EPage } from '@stencil/core/testing';

describe('sc-heading', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-heading></sc-heading>');

    const element = await page.find('sc-heading');
    expect(element).toHaveClass('hydrated');
  });
});
