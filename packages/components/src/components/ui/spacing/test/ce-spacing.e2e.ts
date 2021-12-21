import { newE2EPage } from '@stencil/core/testing';

describe('ce-spacing', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-spacing></ce-spacing>');

    const element = await page.find('ce-spacing');
    expect(element).toHaveClass('hydrated');
  });
});
