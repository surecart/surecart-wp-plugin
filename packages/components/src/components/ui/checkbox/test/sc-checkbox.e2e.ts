import { newE2EPage } from '@stencil/core/testing';

describe('sc-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-checkbox></sc-checkbox>');

    const element = await page.find('sc-checkbox');
    expect(element).toHaveClass('hydrated');
  });

  // it('Can be required', async () => {
  // const page = await newE2EPage();
  // await page.setContent(`
  // <sc-form>
  //   <sc-checkbox required name="test"></sc-checkbox>
  // </sc-form>`);
  // const element = await page.find(`sc-checkbox`);
  // const form = await page.find(`sc-form`);
  // form.callMethod('submit');
  // await page.waitForChanges();
  // expect(element).toHaveAttribute('invalid');
  // });
});
