import { newE2EPage } from '@stencil/core/testing';

describe('ce-tax-id-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-tax-id-input></ce-tax-id-input>');

    const element = await page.find('ce-tax-id-input');
    expect(element).toHaveClass('hydrated');
  });

  it('Changes Tax Id Selection', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-tax-id-input></ce-tax-id-input>');

    // UK Vat.
    const element = await page.find('ce-tax-id-input');
    element.setProperty('draft', {
      shipping_country: 'GB',
    });
    await page.waitForChanges();
    let input = await page.find('ce-tax-id-input ce-input');
    let trigger = await page.find('ce-tax-id-input ce-input [slot="trigger"]');
    expect(trigger.textContent).toContain('UK VAT');
    let label = await input.getProperty('label');
    expect(label).toBe('VAT Number');

    // EU Vat.
    element.setProperty('draft', {
      shipping_country: 'DE',
    });
    await page.waitForChanges();
    input = await page.find('ce-tax-id-input ce-input');
    trigger = await page.find('ce-tax-id-input ce-input [slot="trigger"]');
    expect(trigger.textContent).toContain('EU VAT');
    label = await input.getProperty('label');
    expect(label).toBe('VAT Number');

    // CA GST.
    element.setProperty('draft', {
      shipping_country: 'CA',
    });
    await page.waitForChanges();
    input = await page.find('ce-tax-id-input ce-input');
    trigger = await page.find('ce-tax-id-input ce-input [slot="trigger"]');
    expect(trigger.textContent).toContain('CA GST');
    label = await input.getProperty('label');
    expect(label).toBe('GST Number');

    // AU ABN.
    element.setProperty('draft', {
      shipping_country: 'AU',
    });
    await page.waitForChanges();
    input = await page.find('ce-tax-id-input ce-input');
    trigger = await page.find('ce-tax-id-input ce-input [slot="trigger"]');
    expect(trigger.textContent).toContain('AU ABN');
    label = await input.getProperty('label');
    expect(label).toBe('ABN Number');
  });
});
