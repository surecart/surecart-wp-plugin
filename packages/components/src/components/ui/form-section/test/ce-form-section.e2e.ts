import { newE2EPage } from '@stencil/core/testing';

describe('ce-form-section', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-form-section></ce-form-section>');

    const element = await page.find('ce-form-section');
    expect(element).toHaveClass('hydrated');
  });
});
