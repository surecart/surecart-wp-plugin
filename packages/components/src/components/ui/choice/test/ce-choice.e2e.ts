import { newE2EPage } from '@stencil/core/testing';

describe('ce-choice', () => {
  let page, element, label, input;

  const selector = 'ce-choice';

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<${selector}></${selector}>`);
    element = await page.find(`${selector}`);
    label = await page.find(`${selector} >>> .choice`);
    input = await page.find(`${selector} >>> input`);
  });

  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-choice></ce-choice>');

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
    const ceBlur = await page.spyOnEvent('ceBlur');
    const ceFocus = await page.spyOnEvent('ceFocus');

    expect(label).toHaveClass('choice');
    expect(label).not.toHaveClasses(['choice--checked', 'choice--focused']);

    await input.click();
    await page.waitForChanges();
    expect(label).toHaveClass('choice');
    expect(label).toHaveClasses(['choice--checked', 'choice--focused']);
    expect(ceFocus).toHaveReceivedEvent();

    await page.$eval(selector, e => e.blur());
    await page.waitForChanges();
    expect(label).not.toHaveClass('choice--focused');
    expect(ceBlur).toHaveReceivedEvent();
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
    <ce-form>
      <ce-choice required name="test"></ce-choice>
    </ce-form>`);
    element = await page.find(`ce-choice`);
    const form = await page.find(`ce-form`);
    form.callMethod('submit');
    await page.waitForChanges();
    expect(element).toHaveAttribute('invalid');
  });
});
