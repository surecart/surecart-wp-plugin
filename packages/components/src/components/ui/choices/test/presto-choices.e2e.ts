import { newE2EPage } from '@stencil/core/testing';

describe('presto-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-choices></presto-choices>');

    const element = await page.find('presto-choices');
    expect(element).toHaveClass('hydrated');
  });

  it('It can toggle between choices', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <presto-choices>
      <presto-choice name="test" value="test" checked></presto-choice>
      <presto-choice name="test" value="test-2"></presto-choice>
    </presto-choices>
    `);

    const first = await page.find('presto-choice[value="test"]');
    const second = await page.find('presto-choice[value="test-2"]');

    expect(first).toHaveAttribute('checked');
    expect(second).not.toHaveAttribute('checked');

    second.click();
    await page.waitForChanges();

    expect(first).not.toHaveAttribute('checked');
    expect(second).toHaveAttribute('checked');
  });

  it('Can select multiple choices', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <presto-choices>
      <presto-choice name="test" value="test" type="checkbox" checked></presto-choice>
      <presto-choice name="test" type="checkbox" value="test-2"></presto-choice>
    </presto-choices>
    `);

    const first = await page.find('presto-choice[value="test"]');
    const second = await page.find('presto-choice[value="test-2"]');

    expect(first).toHaveAttribute('checked');
    expect(second).not.toHaveAttribute('checked');

    second.click();
    await page.waitForChanges();

    expect(first).toHaveAttribute('checked');
    expect(second).toHaveAttribute('checked');

    first.click();
    await page.waitForChanges();
    expect(first).not.toHaveAttribute('checked');
  });
});
