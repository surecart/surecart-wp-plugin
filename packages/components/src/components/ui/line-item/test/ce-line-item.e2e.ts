import { newE2EPage } from '@stencil/core/testing';

describe('ce-line-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-line-item></ce-line-item>');

    const element = await page.find('ce-line-item');
    expect(element).toHaveClass('hydrated');
  });
});
