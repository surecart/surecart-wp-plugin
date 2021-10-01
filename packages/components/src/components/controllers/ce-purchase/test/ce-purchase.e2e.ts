import { newE2EPage } from '@stencil/core/testing';

describe('ce-purchase', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-purchase></ce-purchase>');

    const element = await page.find('ce-purchase');
    expect(element).toHaveClass('hydrated');
  });
});
