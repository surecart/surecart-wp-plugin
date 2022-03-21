import { newE2EPage } from '@stencil/core/testing';

describe('sc-form-section', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-form-section></sc-form-section>');

    const element = await page.find('sc-form-section');
    expect(element).toHaveClass('hydrated');
  });
});
