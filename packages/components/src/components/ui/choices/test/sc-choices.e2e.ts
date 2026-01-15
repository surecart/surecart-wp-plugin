import { newE2EPage } from '@stencil/core/testing';

describe('sc-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-choices></sc-choices>');

    const element = await page.find('sc-choices');
    expect(element).toHaveClass('hydrated');
  });

  it('It can toggle between choices', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <sc-choices>
      <sc-choice type="radio" name="test" value="test" checked></sc-choice>
      <sc-choice type="radio" name="test" value="test-2"></sc-choice>
    </sc-choices>
    `);

    let first = await page.find('sc-choice[value="test"]');
    let second = await page.find('sc-choice[value="test-2"]');

    expect(first).toHaveAttribute('checked');
    expect(second).not.toHaveAttribute('checked');

    await second.click();
    await page.waitForChanges();

    first = await page.find('sc-choice[value="test"]');
    second = await page.find('sc-choice[value="test-2"]');

    expect(first).not.toHaveAttribute('checked');
    expect(second).toHaveAttribute('checked');
  });

  it('Can select multiple choices', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <sc-choices>
      <sc-choice name="test" value="test" type="checkbox" checked></sc-choice>
      <sc-choice name="test" type="checkbox" value="test-2"></sc-choice>
    </sc-choices>
    `);

    let first = await page.find('sc-choice[value="test"]');
    let second = await page.find('sc-choice[value="test-2"]');

    expect(first).toHaveAttribute('checked');
    expect(second).not.toHaveAttribute('checked');

    await second.triggerEvent('click');
    await page.waitForChanges();

    first = await page.find('sc-choice[value="test"]');
    second = await page.find('sc-choice[value="test-2"]');

    expect(first).toHaveAttribute('checked');
    expect(second).toHaveAttribute('checked');

    await first.triggerEvent('click');
    await page.waitForChanges();
    first = await page.find('sc-choice[value="test"]');
    expect(first).not.toHaveAttribute('checked');
  });
});
