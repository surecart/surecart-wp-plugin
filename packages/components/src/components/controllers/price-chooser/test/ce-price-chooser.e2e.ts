import { newE2EPage } from '@stencil/core/testing';
import prices from '../../checkout/test/fixtures/prices.js';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-choices></ce-price-choices>');

    const element = await page.find('ce-price-choices');
    expect(element).toHaveClass('hydrated');
  });

  it('displays prices', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-checkout><ce-price-choices></ce-price-choices></ce-checkout>');
    const checkout = await page.find('ce-checkout');
    checkout.setProperty('prices', prices);
    await page.waitForChanges();

    const choices = await page.find('ce-choices');
    expect(choices).toBeDefined();

    const choice = await page.$$('ce-choice');
    expect(choice).toHaveLength(3);
  });
});
