import { newE2EPage } from '@stencil/core/testing';

describe('ce-line-item-tax', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-line-item-tax></ce-line-item-tax>');

    const element = await page.find('ce-line-item-tax');
    expect(element).toHaveClass('hydrated');
  });
});
