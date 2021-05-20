import { newE2EPage } from '@stencil/core/testing';

describe('presto-radio-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-radio-group></presto-radio-group>');

    const element = await page.find('presto-radio-group');
    expect(element).toHaveClass('hydrated');
  });

  it('It can toggle between choices', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <presto-radio-group>
      <presto-radio name="test" value="test" checked></presto-radio>
      <presto-radio name="test" value="test-2"></presto-radio>
    </presto-radio-group>
    `);

    const first = await page.find('presto-radio[value="test"]');
    const second = await page.find('presto-radio[value="test-2"]');

    expect(first).toHaveAttribute('checked');
    expect(second).not.toHaveAttribute('checked');

    second.click();
    await page.waitForChanges();

    expect(first).not.toHaveAttribute('checked');
    expect(second).toHaveAttribute('checked');
  });
});
