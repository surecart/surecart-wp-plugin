import { newE2EPage } from '@stencil/core/testing';

describe('sc-radio-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-radio-group></sc-radio-group>');

    const element = await page.find('sc-radio-group');
    expect(element).toHaveClass('hydrated');
  });

  it('It can toggle between choices', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <sc-radio-group>
      <sc-radio name="test" value="test" checked></sc-radio>
      <sc-radio name="test" value="test-2"></sc-radio>
    </sc-radio-group>
    `);

    const first = await page.find('sc-radio[value="test"]');
    const second = await page.find('sc-radio[value="test-2"]');

    expect(first).toHaveAttribute('checked');
    expect(second).not.toHaveAttribute('checked');

    second.click();
    await page.waitForChanges();

    expect(first).not.toHaveAttribute('checked');
    expect(second).toHaveAttribute('checked');
  });
});
