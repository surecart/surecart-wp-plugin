import { newE2EPage } from '@stencil/core/testing';

describe('sc-flex', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-flex></sc-flex>');

    const element = await page.find('sc-flex');
    expect(element).toHaveClass('hydrated');
  });
});
