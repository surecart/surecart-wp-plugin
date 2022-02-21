import { newE2EPage } from '@stencil/core/testing';

describe('ce-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-form></ce-form>');

    const element = await page.find('ce-form');
    expect(element).toHaveClass('hydrated');
  });

  it('Submits data', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <ce-form>
      <ce-input name="name" value="Tester"></ce-input>
      <button type="submit">Test</button>
      <ce-button submit>Test CE</ce-button>
    </ce-form>
    `);
    const ceSubmit = await page.spyOnEvent('ceFormSubmit');

    const button = await page.find('button');
    button.click();
    await page.waitForChanges();
    expect(ceSubmit).toHaveReceivedEventTimes(1);

    const ce_button = await page.find('ce-button');
    ce_button.click();
    await page.waitForChanges();
    expect(ceSubmit).toHaveReceivedEventTimes(2);
  });

  // we are testing this because JEST doesn't work well with FormData
  it('Serializes data', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <ce-form>
      <ce-input name="ce_input" value="CE Input"></ce-input>
      <ce-switch name="ce_switch" value="switch" checked></ce-switch>
      <ce-radio-group>
        <ce-radio value="CE Radio" name="ce_radio" checked></ce-radio>
        <ce-radio value="Invalid" name="ce_radio"></ce-radio>
      </ce-radio-group>
      <ce-checkbox value="CE Checkbox" name="ce_checkbox" checked></ce-checkbox>
      <ce-choices>
        <ce-choice value="CE Choice" name="ce_choice" checked></ce-choice>
        <ce-choice value="Invalid" name="ce_choice"></ce-choice>
      </ce-choices>
      <ce-choices>
        <ce-choice value="CE Choice Check" name="ce_check_choice" checked type="checkbox"></ce-choice>
        <ce-choice value="CE Choice Check 1" name="ce_check_choice_1" checked type="checkbox"></ce-choice>
      </ce-choices>

      <ce-select value="CE Select" name="ce_select"></ce-select>

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
    </ce-form>
    `);
    const form = await page.find('ce-form');
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
