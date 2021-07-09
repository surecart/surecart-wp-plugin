import { newE2EPage } from '@stencil/core/testing';

describe('ce-line-items', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-line-items></ce-line-items>');

    const element = await page.find('ce-line-items');
    expect(element).toHaveClass('hydrated');
  });
});
