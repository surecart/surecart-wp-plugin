import { newE2EPage } from '@stencil/core/testing';

describe('ce-radio', () => {
  let page, element, label, input;

  const selector = 'ce-radio';

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<${selector}></${selector}>`);
    element = await page.find(`${selector}`);
    label = await page.find(`${selector} >>> .radio`);
    input = await page.find(`${selector} >>> input`);
  });

  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-radio></ce-radio>');

    const element = await page.find(selector);
    expect(element).toHaveClass('hydrated');
  });

  it('Should be clickable', async () => {
    const ceBlur = await page.spyOnEvent('ceBlur');
    const ceFocus = await page.spyOnEvent('ceFocus');

    expect(label).toHaveClass('radio');
    expect(label).not.toHaveClasses(['radio--checked', 'radio--focused']);

    await input.click();
    await page.waitForChanges();
    expect(label).toHaveClass('radio');
    expect(label).toHaveClasses(['radio--checked', 'radio--focused']);
    expect(ceFocus).toHaveReceivedEvent();

    await page.$eval(selector, e => e.blur());
    await page.waitForChanges();
    expect(label).not.toHaveClass('radio--focused');
    expect(ceBlur).toHaveReceivedEvent();
  });

  it('Can be disabled', async () => {
    expect(input).not.toHaveAttribute('disabled');
    element.setProperty('disabled', true);
    await page.waitForChanges();
    expect(label).toHaveClasses(['radio', 'radio--disabled']);
    expect(input).toHaveAttribute('disabled');
  });

  it('Can be required', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <ce-form>
      <ce-radio required name="test"></ce-radio>
    </ce-form>`);
    const element = await page.find(`ce-radio`);
    const form = await page.find(`ce-form`);
    form.callMethod('submit');
    await page.waitForChanges();
    expect(element).toHaveAttribute('invalid');
  });
});
