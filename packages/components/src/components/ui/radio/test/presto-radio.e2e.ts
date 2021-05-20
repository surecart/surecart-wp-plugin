import { newE2EPage } from '@stencil/core/testing';

describe('presto-radio', () => {
  let page, element, label, input;

  const selector = 'presto-radio';

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<${selector}></${selector}>`);
    element = await page.find(`${selector}`);
    label = await page.find(`${selector} >>> .radio`);
    input = await page.find(`${selector} >>> input`);
  });

  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-radio></presto-radio>');

    const element = await page.find(selector);
    expect(element).toHaveClass('hydrated');
  });

  it('Should be clickable', async () => {
    const prestoBlur = await page.spyOnEvent('prestoBlur');
    const prestoFocus = await page.spyOnEvent('prestoFocus');

    expect(label).toHaveClass('radio');
    expect(label).not.toHaveClasses(['radio--checked', 'radio--focused']);

    await input.click();
    await page.waitForChanges();
    expect(label).toHaveClass('radio');
    expect(label).toHaveClasses(['radio--checked', 'radio--focused']);
    expect(prestoFocus).toHaveReceivedEvent();

    await page.$eval(selector, e => e.blur());
    await page.waitForChanges();
    expect(label).not.toHaveClass('radio--focused');
    expect(prestoBlur).toHaveReceivedEvent();
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
    <presto-form>
      <presto-radio required name="test"></presto-radio>
    </presto-form>`);
    const element = await page.find(`presto-radio`);
    const form = await page.find(`presto-form`);
    form.callMethod('submit');
    await page.waitForChanges();
    expect(element).toHaveAttribute('invalid');
  });
});
