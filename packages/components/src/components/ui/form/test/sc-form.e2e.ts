import { newE2EPage } from '@stencil/core/testing';

describe('sc-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-form></sc-form>');

    const element = await page.find('sc-form');
    expect(element).toHaveClass('hydrated');
  });

  it('Submits data', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <sc-form>
      <sc-input name="name" value="Tester"></sc-input>
      <button type="submit">Test</button>
      <sc-button submit>Test CE</sc-button>
    </sc-form>
    `);
    const form = await page.find('sc-form');
    const scFormSubmit = await form.spyOnEvent('scFormSubmit');
    const scSubmit = await form.spyOnEvent('scSubmit');

    const scButton = await page.find('sc-button');
    await scButton.click();
    await page.waitForChanges();
    expect(scSubmit).toHaveReceivedEventTimes(1);
    expect(scFormSubmit).toHaveReceivedEventTimes(1);
  });

  // we are testing this because JEST doesn't work well with FormData
  it('Serializes data', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <sc-form>
      <sc-input name="ce_input" value="CE Input"></sc-input>
      <sc-switch name="ce_switch" value="switch" checked></sc-switch>
      <sc-radio-group>
        <sc-radio value="CE Radio" name="ce_radio" checked></sc-radio>
        <sc-radio value="Invalid" name="ce_radio"></sc-radio>
      </sc-radio-group>
      <sc-checkbox value="CE Checkbox" name="ce_checkbox" checked></sc-checkbox>
      <sc-choices>
        <sc-choice value="CE Choice" name="ce_choice" checked></sc-choice>
        <sc-choice value="Invalid" name="ce_choice"></sc-choice>
      </sc-choices>
      <sc-choices>
        <sc-choice value="CE Choice Check" name="ce_check_choice" checked type="checkbox"></sc-choice>
        <sc-choice value="CE Choice Check 1" name="ce_check_choice_1" checked type="checkbox"></sc-choice>
      </sc-choices>

      <sc-select value="CE Select" name="ce_select"></sc-select>

      <!-- Order form fields -->
      <sc-customer-name value="Testy McTesterson"></sc-customer-name>
      <sc-customer-email value="order@email.com"></sc-customer-email>
      <sc-customer-phone value="0987654321"></sc-customer-phone>
      <sc-order-shipping-address></sc-order-shipping-address>
      <sc-order-tax-id-input></sc-order-tax-id-input>
      <sc-order-password value="pass"></sc-order-password>
    </sc-form>
    `);
    const form = await page.find('sc-form');

    // set shipping value.
    const shipping = await page.find('sc-order-shipping-address');
    shipping.setProperty('shippingEnabled', true);
    await page.waitForChanges();
    shipping.setProperty('shippingAddress', { id: 'test', country: 'US', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' });

    await page.waitForChanges();

    // set tax id value.
    const taxID = await page.find('sc-order-tax-id-input');
    taxID.setProperty('order', { tax_identifier: { number: '12345', number_type: 'eu_vat' } });

    await page.waitForChanges();

    // serialize form.
    const data = await form.callMethod('getFormJson');
    expect(data).toEqual({
      'ce_input': 'CE Input',
      'ce_switch': 'switch',
      'ce_radio': 'CE Radio',
      'ce_select': 'CE Select',
      'ce_checkbox': 'CE Checkbox',
      'ce_choice': 'CE Choice',
      'ce_check_choice': 'CE Choice Check',
      'ce_check_choice_1': 'CE Choice Check 1',
      'email': 'order@email.com',
      'name': 'Testy McTesterson',
      'phone': '0987654321',
      'password': 'pass',
      'shipping_country': 'US',
      'shipping_postal_code': '12345',
      'shipping_state': 'WI',
      'shipping_line_1': '303 Park Ave',
      'shipping_city': 'Monona',
      'tax_identifier.number': '12345',
      'tax_identifier.number_type': 'eu_vat',
    });
  });
});
