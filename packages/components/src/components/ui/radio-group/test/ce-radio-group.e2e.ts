import { newE2EPage } from '@stencil/core/testing';

describe('ce-radio-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-radio-group></ce-radio-group>');

    const element = await page.find('ce-radio-group');
    expect(element).toHaveClass('hydrated');
  });

  it('It can toggle between choices', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <ce-radio-group>
      <ce-radio name="test" value="test" checked></ce-radio>
      <ce-radio name="test" value="test-2"></ce-radio>
    </ce-radio-group>
    `);

    const first = await page.find('ce-radio[value="test"]');
    const second = await page.find('ce-radio[value="test-2"]');

    expect(first).toHaveAttribute('checked');
    expect(second).not.toHaveAttribute('checked');

    second.click();
    await page.waitForChanges();

    expect(first).not.toHaveAttribute('checked');
    expect(second).toHaveAttribute('checked');
  });
});
