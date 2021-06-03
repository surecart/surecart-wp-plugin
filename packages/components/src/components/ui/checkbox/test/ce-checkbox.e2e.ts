import { newE2EPage } from '@stencil/core/testing';

describe('ce-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-checkbox></ce-checkbox>');

    const element = await page.find('ce-checkbox');
    expect(element).toHaveClass('hydrated');
  });

  it('Can be required', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <ce-form>
      <ce-checkbox required name="test"></ce-checkbox>
    </ce-form>`);
    const element = await page.find(`ce-checkbox`);
    const form = await page.find(`ce-form`);
    form.callMethod('submit');
    await page.waitForChanges();
    expect(element).toHaveAttribute('invalid');
  });
});
