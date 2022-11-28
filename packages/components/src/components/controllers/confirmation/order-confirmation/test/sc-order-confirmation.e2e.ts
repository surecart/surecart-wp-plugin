import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-confirmation', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-confirmation></sc-order-confirmation>');

    const element = await page.find('sc-order-confirmation');
    expect(element).toHaveClass('hydrated');
  });

  it('appends manual instructions if present in order', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-confirmation><sc-order-confirmation-details></sc-order-confirmation-details></sc-order-confirmation>');
    const element = await page.find('sc-order-confirmation');
    element.setProperty('order', {manual_payment: true});
    await page.waitForChanges();
    let instructions = await page.find( 'sc-order-manual-instructions');
    expect(instructions).toHaveClass('hydrated');
  });
});
