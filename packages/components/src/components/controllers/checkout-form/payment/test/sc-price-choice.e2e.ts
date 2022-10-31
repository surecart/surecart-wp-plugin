import { newE2EPage } from '@stencil/core/testing';
import { h} from '@stencil/core';

describe('sc-payment', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-payment></sc-payment>');

    const element = await page.find('sc-payment');
    expect(element).toHaveClass('hydrated');
  });
  it('Selects the first payment method as the default', async () => {
    const page = await newE2EPage();
    await page.setContent(`<sc-payment>
    <sc-payment-method-choice processor-id="stripe">Stripe</sc-payment-method-choice>
    <sc-payment-method-choice processor-id="not1">Manual</sc-payment-method-choice>
    <sc-payment-method-choice processor-id="not2">Manual 2</sc-payment-method-choice>
  </sc-payment>`);
    await page.waitForChanges();
    const selected = await page.find('[processor-id="stripe"] >>> sc-toggle');
    const not1 = await page.find('[processor-id="not1"] >>> sc-toggle');
    const not2 = await page.find('[processor-id="not2"] >>> sc-toggle');

    expect(selected.getProperty('open')).toBeTruthy();
    expect(not1.getProperty('open')).toBeFalsy();
    expect(not2.getProperty('open')).toBeFalsy();
  });
});
