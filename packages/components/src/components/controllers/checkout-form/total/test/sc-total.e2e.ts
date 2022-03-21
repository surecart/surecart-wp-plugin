import { newE2EPage } from '@stencil/core/testing';

describe('sc-total', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-total></sc-total>');

    const element = await page.find('sc-total');
    expect(element).toHaveClass('hydrated');
  });
});
