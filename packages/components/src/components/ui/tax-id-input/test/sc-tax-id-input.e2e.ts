import { newE2EPage } from '@stencil/core/testing';

describe('sc-tax-id-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-tax-id-input></sc-tax-id-input>');

    const element = await page.find('sc-tax-id-input');
    expect(element).toHaveClass('hydrated');
  });
});
