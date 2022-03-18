import { newE2EPage } from '@stencil/core/testing';

describe('ce-line-item-total', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-line-item-total></ce-line-item-total>');

    const element = await page.find('ce-line-item-total');
    expect(element).toHaveClass('hydrated');
  });
});
