import { newE2EPage } from '@stencil/core/testing';

describe('sc-line-item-total', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-line-item-total></sc-line-item-total>');

    const element = await page.find('sc-line-item-total');
    expect(element).toHaveClass('hydrated');
  });
});
