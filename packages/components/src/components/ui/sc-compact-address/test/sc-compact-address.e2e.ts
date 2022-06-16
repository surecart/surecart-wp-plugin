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
    await page.setContent('<sc-compact-address></sc-compact-address>');
    const address = await page.find('sc-compact-address');

    // set U.S. Country.
    await page.$eval('sc-compact-address', (elm: any) => {
      elm.address = { country: 'US', city: null, line_1: null, line_2: null, postal_code: null, state: null };
    });
    await page.waitForChanges();

    // test zip change.
    const changeEvent = await address.spyOnEvent('scChangeAddress');
    const postal = await page.find('sc-compact-address >>> [name="shipping_postal_code"] >>> input');
    await postal.press('1');
    await postal.press('2');
    await postal.press('3');
    await postal.press('4');
    await postal.press('5');
    await page.keyboard.up('Shift');
    // await postal.triggerEvent('scChange', { detail: { postal_code: '12345' } });
    // const country = await page.find('sc-compact-address >>> [name="shipping_country"]');
    // await country.triggerEvent('click');
    // await page.click('sc-compact-address >>> [name="shipping_country"]');
    await page.waitForChanges();
    expect(changeEvent).toHaveReceivedEventDetail({ country: 'US', postal_code: '12345', state: null, line_1: null, line_2: null, city: null });

    // set set full address.
    await page.$eval('sc-compact-address', (elm: any) => {
      elm.address = { country: 'UK', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' };
    });
    const initialAddress = await address.getProperty('address');
    expect(initialAddress).toEqual({ country: 'UK', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' });

    // change country should clear everything else out.
    const event = await address.spyOnEvent('scChangeAddress');
    const elm = await page.find(`sc-compact-address >>> [name="shipping_country"] >>> sc-menu-item[value="AF"]`);
    await elm.triggerEvent('click');
    await page.waitForChanges();
    expect(event).toHaveReceivedEventDetail({ country: 'AF', postal_code: null, state: null, city: null, line_1: null, line_2: null });
  });
});
