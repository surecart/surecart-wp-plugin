import { newE2EPage } from '@stencil/core/testing';

describe('presto-button', () => {
  let page, element, label, button, prefix, suffix;

  const selector = 'presto-button';

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<${selector}></${selector}>`);
    element = await page.find(`${selector}`);
    button = await page.find(`${selector} >>> .button`);
    label = await page.find(`${selector} >>> .button__label`);
    prefix = await page.find(`${selector} >>> .button__prefix`);
    suffix = await page.find(`${selector} >>> .button__suffix`);
  });

  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-button></presto-button>');

    const element = await page.find('presto-button');
    expect(element).toHaveClass('hydrated');
  });

  it('Has types', async () => {
    expect(button).toHaveClass('button--default');

    await page.$eval(selector, (elm: any) => {
      elm.type = 'primary';
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--primary');

    await page.$eval(selector, (elm: any) => {
      elm.type = 'success';
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--success');

    await page.$eval(selector, (elm: any) => {
      elm.type = 'info';
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--info');

    await page.$eval(selector, (elm: any) => {
      elm.type = 'warning';
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--warning');

    await page.$eval(selector, (elm: any) => {
      elm.type = 'danger';
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--danger');

    await page.$eval(selector, (elm: any) => {
      elm.type = 'text';
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--text');
  });

  it('Has sizes', async () => {
    expect(button).toHaveClass('button--medium');

    await page.$eval(selector, (elm: any) => {
      elm.size = 'large';
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--large');

    await page.$eval(selector, (elm: any) => {
      elm.size = 'small';
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--small');
  });

  it('Can be full', async () => {
    await page.$eval(selector, (elm: any) => {
      elm.full = true;
    });
    await page.waitForChanges();
    expect(element.hasAttribute('full'));
  });

  it('Can be disabled', async () => {
    expect(button).not.toHaveClass('button--disabled');
    await page.$eval(selector, (elm: any) => {
      elm.disabled = true;
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--disabled');
    expect(button).toHaveAttribute('disabled');
  });

  it('Can be loading', async () => {
    expect(button).not.toHaveClass('button--loading');
    await page.$eval(selector, (elm: any) => {
      elm.loading = true;
    });

    await page.waitForChanges();
    const spinner = await page.find(`${selector} >>> presto-spinner`);
    let visibility = await spinner.isVisible();
    expect(visibility).toBe(true);
    expect(button).toHaveClass('button--loading');
  });

  it('Can be pill', async () => {
    expect(button).not.toHaveClass('button--pill');
    await page.$eval(selector, (elm: any) => {
      elm.pill = true;
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--pill');
  });

  it('Can be circle', async () => {
    expect(button).not.toHaveClass('button--circle');
    await page.$eval(selector, (elm: any) => {
      elm.circle = true;
    });
    await page.waitForChanges();
    expect(button).toHaveClass('button--circle');
  });

  it('Can be type submit', async () => {
    expect(button.getAttribute('type')).toBe('button');
    await page.$eval(selector, (elm: any) => {
      elm.submit = true;
    });
    await page.waitForChanges();
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('Can have a name', async () => {
    expect(button.getAttribute('name')).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.name = 'Test';
    });
    await page.waitForChanges();
    expect(button.getAttribute('name')).toBe('Test');
  });

  it('Can have a value', async () => {
    expect(button.getAttribute('value')).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.value = 'Test';
    });
    await page.waitForChanges();
    expect(button.getAttribute('value')).toBe('Test');
  });

  it('Can be a link', async () => {
    expect(button.getAttribute('href')).toBe(null);
    await page.$eval(selector, (elm: any) => {
      elm.href = 'https://google.com';
      elm.target = '_blank';
      elm.download = 'test';
    });
    await page.waitForChanges();
    const button_link = await page.find(`${selector} >>> a.button`);
    let visibility = await button_link.isVisible();
    expect(visibility).toBe(true);
    expect(button_link.getAttribute('href')).toBe('https://google.com');
    expect(button_link.getAttribute('target')).toBe('_blank');
    expect(button_link.getAttribute('download')).toBe('test');
  });

  // checks clicks, public methods, and hasFocus prop changes
  it('Can be focused and blurred', async () => {
    const prestoBlur = await page.spyOnEvent('prestoBlur');
    const prestoFocus = await page.spyOnEvent('prestoFocus');

    expect(button).not.toHaveClass('button--focused');

    // blur
    await button.focus();
    await page.waitForChanges();
    expect(button).toHaveClass('button--focused');
    expect(prestoFocus).toHaveReceivedEvent();

    // blur
    await page.$eval(selector, e => e.blur());
    await page.waitForChanges();
    expect(button).not.toHaveClass('button--focused');
    expect(prestoBlur).toHaveReceivedEvent();
  });
});
