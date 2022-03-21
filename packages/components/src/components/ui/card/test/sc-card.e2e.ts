import { newE2EPage } from '@stencil/core/testing';

describe('sc-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-card></sc-card>');

    const element = await page.find('sc-card');
    expect(element).toHaveClass('hydrated');
  });
});
