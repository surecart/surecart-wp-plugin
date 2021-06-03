import { newE2EPage } from '@stencil/core/testing';

describe('ce-switch', () => {
  let page, element, input, switchEl;

  const selector = 'ce-switch';

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<${selector}></${selector}>`);
    element = await page.find(`${selector}`);
    switchEl = await page.find(`${selector} >>> .switch`);
    input = await page.find(`${selector} >>> input`);
  });

  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-switch></ce-switch>');

    const element = await page.find('ce-switch');
    expect(element).toHaveClass('hydrated');
  });

  it('Can be checked', async () => {
    expect(switchEl).not.toHaveClass('switch--checked');
    expect(switchEl).not.toHaveProperty('checked');
    expect(await input.getProperty('checked')).toBeFalsy();
    await page.$eval(selector, (elm: any) => {
      elm.checked = true;
    });
    await page.waitForChanges();
    expect(switchEl).toHaveClass('switch--checked');
    expect(await input.getProperty('checked')).toBeTruthy();
  });

  it('Can be required', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <ce-form>
      <ce-switch required name="test"></ce-radio>
    </ce-form>`);
    const element = await page.find(`ce-switch`);
    const form = await page.find(`ce-form`);
    form.callMethod('submit');
    await page.waitForChanges();
    expect(element).toHaveAttribute('invalid');
  });
});
