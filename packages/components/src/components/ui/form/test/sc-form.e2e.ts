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
    const ceSubmit = await page.spyOnEvent('scSubmit');

    const button = await page.find('button');
    button.click();
    await page.waitForChanges();
    expect(ceSubmit).toHaveReceivedEventTimes(1);

    const ce_button = await page.find('sc-button');
    ce_button.click();
    await page.waitForChanges();
    expect(ceSubmit).toHaveReceivedEventTimes(2);
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

      <!-- Default form fields -->
      <input name="input" value="Input"></input>
      <select name="select">
        <option value="volvo">Volvo</option>
        <option value="select" selected="selected">Working</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
      <input type="radio" name="radio" value="Radio" checked>
      <input type="checkbox" name="checkbox" value="Checkbox" checked>
      <textarea name="textarea">Text Area</textarea>
    </sc-form>
    `);
    const form = await page.find('sc-form');
    const data = await form.callMethod('getFormJson');

    expect(data).toEqual({
      ce_input: 'CE Input',
      ce_switch: 'switch',
      ce_radio: 'CE Radio',
      ce_select: 'CE Select',
      ce_checkbox: 'CE Checkbox',
      ce_choice: 'CE Choice',
      ce_check_choice: 'CE Choice Check',
      ce_check_choice_1: 'CE Choice Check 1',

      radio: 'Radio',
      checkbox: 'Checkbox',
      input: 'Input',
      select: 'select',
      textarea: 'Text Area',
    });
  });
});
