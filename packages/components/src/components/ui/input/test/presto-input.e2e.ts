import { newE2EPage } from '@stencil/core/testing';

describe('presto-input', () => {
  let page, element, wrapper, input;

  const selector = 'presto-input';

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<${selector}></${selector}>`);
    element = await page.find(`${selector}`);
    wrapper = await page.find(`${selector} >>> .input`);
    input = await page.find(`${selector} >>> .input__control`);
  });

  it('renders', async () => {
    expect(element).toHaveClass('hydrated');
  });

  it('Has sizes', async () => {
    expect(wrapper).toHaveClass('input--medium');

    await page.$eval(selector, (elm: any) => {
      elm.size = 'small';
    });
    await page.waitForChanges();
    expect(wrapper).toHaveClass('input--small');

    await page.$eval(selector, (elm: any) => {
      elm.size = 'large';
    });
    await page.waitForChanges();
    expect(wrapper).toHaveClass('input--large');
  });

  // checks clicks, public methods, and hasFocus prop changes
  it('Can be focused and blurred', async () => {
    const prestoBlur = await page.spyOnEvent('prestoBlur');
    const prestoFocus = await page.spyOnEvent('prestoFocus');

    expect(wrapper).not.toHaveClass('input--focused');

    // clicking
    await input.click();
    await page.waitForChanges();
    expect(wrapper).toHaveClass('input--focused');
    expect(prestoFocus).toHaveReceivedEvent();

    // methods
    await element.callMethod('triggerBlur');
    await page.waitForChanges();
    expect(wrapper).not.toHaveClass('input--focused');
    expect(prestoBlur).toHaveReceivedEvent();

    await element.callMethod('triggerFocus');
    await page.waitForChanges();
    expect(wrapper).toHaveClass('input--focused');
    expect(prestoFocus).toHaveReceivedEvent();

    // prop
    await page.$eval(selector, (elm: any) => {
      elm.hasFocus = false;
    });
    await page.waitForChanges();
    expect(wrapper).not.toHaveClass('input--focused');
    expect(prestoBlur).toHaveReceivedEvent();

    await page.$eval(selector, (elm: any) => {
      elm.hasFocus = true;
    });
    await page.waitForChanges();
    expect(wrapper).toHaveClass('input--focused');
    expect(prestoFocus).toHaveReceivedEvent();
  });

  it('Changes value', async () => {
    const prestoChange = await page.spyOnEvent('prestoChange');
    let value = await input.getProperty('value');
    expect(value).toBe('');

    await input.press('8');
    await input.press('8');
    await page.waitForChanges();

    value = await input.getProperty('value');
    expect(value).toBe('88');

    await element.callMethod('triggerBlur');
    await page.waitForChanges();
    expect(prestoChange).toHaveReceivedEvent();
  });

  it('Has a name', async () => {
    let prop = await input.getAttribute('name');
    expect(prop).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.name = 'Test Name';
    });
    await page.waitForChanges();
    expect(input).toHaveAttribute('name');
    const name = await input.getAttribute('name');
    expect(name).toBe('Test Name');
  });

  it('Can be disabled', async () => {
    let prop = await input.getAttribute('disabled');
    expect(prop).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.disabled = true;
    });
    await page.waitForChanges();
    expect(input).toHaveAttribute('disabled');
  });

  it('Can be readonly', async () => {
    let prop = await input.getAttribute('readonly');
    expect(prop).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.readonly = true;
    });
    await page.waitForChanges();
    expect(input).toHaveAttribute('readonly');
  });

  it('Can be required', async () => {
    let prop = await input.getAttribute('required');
    expect(prop).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.required = true;
    });
    await page.waitForChanges();
    expect(input).toHaveAttribute('required');
  });

  it('Has a placeholder', async () => {
    let prop = await input.getAttribute('placeholder');
    expect(prop).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.placeholder = 'Test placeholder';
    });
    await page.waitForChanges();
    expect(input).toHaveAttribute('placeholder');
    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder).toBe('Test placeholder');
  });

  it('Can set min and max length', async () => {
    let minProp = await input.getAttribute('minlength');
    let maxProp = await input.getAttribute('maxlength');
    expect(minProp).toBe(null);
    expect(maxProp).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.minlength = 10;
      elm.maxlength = 20;
    });
    await page.waitForChanges();
    expect(input).toHaveAttribute('minlength');
    expect(input).toHaveAttribute('maxlength');
    const minlength = await input.getAttribute('minlength');
    const maxlength = await input.getAttribute('maxlength');
    expect(minlength).toBe('10');
    expect(maxlength).toBe('20');
  });

  it('Can set min and max and step', async () => {
    let minProp = await input.getAttribute('min');
    let maxProp = await input.getAttribute('max');
    let stepProp = await input.getAttribute('step');
    expect(minProp).toBe(null);
    expect(maxProp).toBe(null);
    expect(stepProp).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.min = 10;
      elm.max = 20;
      elm.step = 2;
    });
    await page.waitForChanges();
    expect(input).toHaveAttribute('min');
    expect(input).toHaveAttribute('max');
    const min = await input.getAttribute('min');
    const max = await input.getAttribute('max');
    const step = await input.getAttribute('step');
    expect(min).toBe('10');
    expect(max).toBe('20');
    expect(step).toBe('2');
  });
});
