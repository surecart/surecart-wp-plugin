import { newE2EPage } from '@stencil/core/testing';

describe('presto-form-control', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-form-control></presto-form-control>');

    const element = await page.find('presto-form-control');
    expect(element).toHaveClass('hydrated');
  });

  it('Can have sizes', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-form-control></presto-form-control>');

    // we'll check class here
    const input = await page.find('presto-form-control >>> .form-control');

    await page.$eval('presto-form-control', (elm: any) => {
      elm.size = 'large';
    });
    await page.waitForChanges();
    expect(input).toHaveClass('form-control--large');

    await page.$eval('presto-form-control', (elm: any) => {
      elm.size = 'small';
    });
    await page.waitForChanges();
    expect(input).toHaveClass('form-control--small');
  });

  it('Can have a label', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-form-control></presto-form-control>');
    const input = await page.find('presto-form-control >>> .form-control');

    // classes
    expect(input).not.toHaveClass('form-control--has-label');

    // update label
    await page.$eval('presto-form-control', (elm: any) => {
      elm.label = 'Test Label Text';
    });
    await page.waitForChanges();
    expect(input).toHaveClass('form-control--has-label');

    // content
    const label = await page.find('presto-form-control >>> .form-control__label');
    expect(label).toEqualText('Test Label Text');

    // can hide label
    await page.$eval('presto-form-control', (elm: any) => {
      elm.showLabel = false;
    });
    await page.waitForChanges();
    expect(input).not.toHaveClass('form-control--has-label');
    expect(label).toHaveAttribute('aria-hidden');
  });

  it('Can have help text', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-form-control></presto-form-control>');
    const input = await page.find('presto-form-control >>> .form-control');

    await page.$eval('presto-form-control', (elm: any) => {
      elm.help = 'Help Text Test';
    });
    await page.waitForChanges();
    expect(input).toHaveClass('form-control--has-help-text');
    const help = await page.find('presto-form-control >>> .form-control__help-text');
    let visibility = await help.isVisible();
    expect(visibility).toBe(true);
    expect(help).toEqualText('Help Text Test');
  });
});
