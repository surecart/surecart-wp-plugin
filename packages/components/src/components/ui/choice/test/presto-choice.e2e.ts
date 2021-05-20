import { newE2EPage } from '@stencil/core/testing';

describe('presto-choice', () => {
  let page, element, label, input;

  const selector = 'presto-choice';

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<${selector}></${selector}>`);
    element = await page.find(`${selector}`);
    label = await page.find(`${selector} >>> .choice`);
    input = await page.find(`${selector} >>> input`);
  });

  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-choice></presto-choice>');

    const element = await page.find(selector);
    expect(element).toHaveClass('hydrated');
  });

  it('Can report validity', async () => {
    let page = await newE2EPage();
    await page.setContent(`<${selector} required name="test" type="checkbox"></${selector}>`);
    element = await page.find(`${selector}`);

    let result = await element.callMethod('reportValidity');
    expect(result).toBeFalsy();

    result = await element.callMethod('setCustomValidity', 'message');
    expect(result).toBeFalsy();
    expect(label).not.toHaveClasses(['choice--checked', 'choice--focused']);

    page = await newE2EPage();
    await page.setContent(`<${selector} required name="test" type="checkbox" checked></${selector}>`);
    element = await page.find(`${selector}`);

    result = await element.callMethod('reportValidity');
    expect(result).toBeTruthy();
  });

  it('Should be clickable', async () => {
    const prestoBlur = await page.spyOnEvent('prestoBlur');
    const prestoFocus = await page.spyOnEvent('prestoFocus');

    expect(label).toHaveClass('choice');
    expect(label).not.toHaveClasses(['choice--checked', 'choice--focused']);

    await input.click();
    await page.waitForChanges();
    expect(label).toHaveClass('choice');
    expect(label).toHaveClasses(['choice--checked', 'choice--focused']);
    expect(prestoFocus).toHaveReceivedEvent();

    await page.$eval(selector, e => e.blur());
    await page.waitForChanges();
    expect(label).not.toHaveClass('choice--focused');
    expect(prestoBlur).toHaveReceivedEvent();
  });

  it('Can be disabled', async () => {
    expect(input).not.toHaveAttribute('disabled');
    element.setProperty('disabled', true);
    await page.waitForChanges();
    expect(label).toHaveClasses(['choice', 'choice--disabled']);
    expect(input).toHaveAttribute('disabled');
  });

  it('Can be radio or checkbox', async () => {
    expect(input).toEqualAttribute('type', 'radio');
    element.setProperty('type', 'checkbox');
    await page.waitForChanges();
    expect(input).toEqualAttribute('type', 'checkbox');
  });

  it('Can be required', async () => {
    page = await newE2EPage();
    await page.setContent(`
    <presto-form>
      <presto-choice required name="test"></presto-choice>
    </presto-form>`);
    element = await page.find(`presto-choice`);
    const form = await page.find(`presto-form`);
    form.callMethod('submit');
    await page.waitForChanges();
    expect(element).toHaveAttribute('invalid');
  });
});
