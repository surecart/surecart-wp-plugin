import { newE2EPage } from '@stencil/core/testing';

describe('sc-line-item-tax', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-line-item-tax></sc-line-item-tax>');

    const element = await page.find('sc-line-item-tax');
    expect(element).toHaveClass('hydrated');
  });
});
