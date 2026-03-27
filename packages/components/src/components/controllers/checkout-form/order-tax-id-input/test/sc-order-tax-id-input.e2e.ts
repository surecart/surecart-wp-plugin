import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-tax-id-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-tax-id-input></sc-order-tax-id-input>');

    const element = await page.find('sc-order-tax-id-input');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with specific taxIdTypes', async () => {
    const page = await newE2EPage();
    const taxIdTypes = ['ca_gst', 'au_abn'];
    const taxIdTypesString = JSON.stringify(taxIdTypes);
    await page.setContent(`<sc-order-tax-id-input taxIdTypes=${taxIdTypesString}></sc-order-tax-id-input>`);

    const element = await page.find('sc-order-tax-id-input');
    expect(element.getAttribute('taxIdTypes')).toEqual(taxIdTypesString);
  });
});
