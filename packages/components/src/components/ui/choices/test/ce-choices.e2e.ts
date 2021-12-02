import { newE2EPage } from '@stencil/core/testing';

describe('ce-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-choices></ce-choices>');

    const element = await page.find('ce-choices');
    expect(element).toHaveClass('hydrated');
  });

  it('It can toggle between choices', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <ce-choices>
      <ce-choice type="radio" name="test" value="test" checked></ce-choice>
      <ce-choice type="radio" name="test" value="test-2"></ce-choice>
    </ce-choices>
    `);

    const first = await page.find('ce-choice[value="test"]');
    const second = await page.find('ce-choice[value="test-2"]');

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
    <ce-choices>
      <ce-choice name="test" value="test" type="checkbox" checked></ce-choice>
      <ce-choice name="test" type="checkbox" value="test-2"></ce-choice>
    </ce-choices>
    `);

    const first = await page.find('ce-choice[value="test"]');
    const second = await page.find('ce-choice[value="test-2"]');

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
