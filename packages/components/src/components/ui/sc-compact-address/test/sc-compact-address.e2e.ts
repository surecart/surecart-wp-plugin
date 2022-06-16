import { newE2EPage } from '@stencil/core/testing';

describe('sc-compact-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-compact-address></sc-compact-address>');

    const element = await page.find('sc-compact-address');
    expect(element).toHaveClass('hydrated');
  });

  it('Emits a change event when the address is changed', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-compact-address></sc-compact-address><button></button>');
    const address = await page.find('sc-compact-address');

    // set U.S. Country.
    await page.$eval('sc-compact-address', (elm: any) => {
      elm.address = { country: 'US', city: null, line_1: null, line_2: null, postal_code: null, state: null };
    });
    await page.waitForChanges();

    // test zip change.
    const changeEvent = await address.spyOnEvent('scChangeAddress');
    const postal = await page.find('sc-compact-address >>> [name="shipping_postal_code"]');
    await postal.triggerEvent('scChange', { detail: '12345' });
    await page.waitForChanges();
    expect(changeEvent).toHaveReceivedEventTimes(1);

    // set set full address.
    await page.$eval('sc-compact-address', (elm: any) => {
      elm.address = { country: 'UK', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' };
    });
    const initialAddress = await address.getProperty('address');
    expect(initialAddress).toEqual({ country: 'UK', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' });

    // change country should clear everything else out.
    const event = await address.spyOnEvent('scChangeAddress');
    const elm = await page.find(`sc-compact-address >>> [name="shipping_country"]`);
    await elm.triggerEvent('scChange', { detail: '12345' });
    await page.waitForChanges();
    expect(event).toHaveReceivedEventTimes(1);
  });
});
