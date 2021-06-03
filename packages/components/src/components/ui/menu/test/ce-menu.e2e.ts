import { newE2EPage } from '@stencil/core/testing';

describe('ce-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-menu></ce-menu>');

    const element = await page.find('ce-menu');
    expect(element).toHaveClass('hydrated');
  });
});
