import { newE2EPage } from '@stencil/core/testing';

describe('presto-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-form></presto-form>');

    const element = await page.find('presto-form');
    expect(element).toHaveClass('hydrated');
  });

  it('Submits data', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <presto-form>
      <presto-input name="name" value="Tester"></presto-input>
      <button type="submit">Test</button>
      <presto-button submit>Test Presto</presto-button>
    </presto-form>
    `);
    const prestoSubmit = await page.spyOnEvent('prestoSubmit');
    const form = await page.find('presto-form');
    await form.callMethod('submit');
    await page.waitForChanges();
    expect(prestoSubmit).toHaveReceivedEventTimes(1);

    const button = await page.find('button');
    button.click();
    await page.waitForChanges();
    expect(prestoSubmit).toHaveReceivedEventTimes(2);

    const presto_button = await page.find('presto-button');
    presto_button.click();
    await page.waitForChanges();
    expect(prestoSubmit).toHaveReceivedEventTimes(3);
  });

  // we are testing this because JEST doesn't work well with FormData
  it('Serializes data', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <presto-form>
      <presto-input name="presto_input" value="Presto Input"></presto-input>
      <presto-switch name="presto_switch" value="switch" checked></presto-switch>
      <presto-radio-group>
        <presto-radio value="Presto Radio" name="presto_radio" checked></presto-radio>
        <presto-radio value="Invalid" name="presto_radio"></presto-radio>
      </presto-radio-group>
      <presto-checkbox value="Presto Checkbox" name="presto_checkbox" checked></presto-checkbox>
      <presto-choices>
        <presto-choice value="Presto Choice" name="presto_choice" checked></presto-choice>
        <presto-choice value="Invalid" name="presto_choice"></presto-choice>
      </presto-choices>
      <presto-choices>
        <presto-choice value="Presto Choice Check" name="presto_check_choice" checked type="checkbox"></presto-choice>
        <presto-choice value="Presto Choice Check 1" name="presto_check_choice_1" checked type="checkbox"></presto-choice>
      </presto-choices>

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
    </presto-form>
    `);
    const form = await page.find('presto-form');
    const data = await form.callMethod('getFormJson');

    expect(data).toEqual({
      presto_input: 'Presto Input',
      presto_switch: 'switch',
      presto_radio: 'Presto Radio',
      presto_checkbox: 'Presto Checkbox',
      presto_choice: 'Presto Choice',
      presto_check_choice: 'Presto Choice Check',
      presto_check_choice_1: 'Presto Choice Check 1',

      radio: 'Radio',
      checkbox: 'Checkbox',
      input: 'Input',
      select: 'select',
      textarea: 'Text Area',
    });
  });
});
