import { newE2EPage } from '@stencil/core/testing';

describe('presto-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-checkbox></presto-checkbox>');

    const element = await page.find('presto-checkbox');
    expect(element).toHaveClass('hydrated');
  });

  it('Can be required', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <presto-form>
      <presto-checkbox required name="test"></presto-checkbox>
    </presto-form>`);
    const element = await page.find(`presto-checkbox`);
    const form = await page.find(`presto-form`);
    form.callMethod('submit');
    await page.waitForChanges();
    expect(element).toHaveAttribute('invalid');
  });
});
