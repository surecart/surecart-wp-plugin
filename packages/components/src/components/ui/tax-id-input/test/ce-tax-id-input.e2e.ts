import { newE2EPage } from '@stencil/core/testing';

describe('ce-tax-id-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-tax-id-input></ce-tax-id-input>');

    const element = await page.find('ce-tax-id-input');
    expect(element).toHaveClass('hydrated');
  });
});
