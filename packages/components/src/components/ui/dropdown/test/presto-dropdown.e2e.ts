import { newE2EPage } from '@stencil/core/testing';

describe('presto-dropdown', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-dropdown></presto-dropdown>');

    const element = await page.find('presto-dropdown');
    expect(element).toHaveClass('hydrated');
  });

  it('can open and close', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <presto-dropdown>
        <presto-button slot="trigger" caret>Click Here</presto-button>
        <div>Test</div>
    </presto-dropdown>`);

    const panel = await page.find('presto-dropdown >>> .dropdown__panel');

    let visibility = await panel.isVisible();
    expect(visibility).toBe(false);

    await page.click('presto-button');
    await page.waitForChanges();
    visibility = await panel.isVisible();
    expect(visibility).toBe(true);

    await page.click('body');
    visibility = await panel.isVisible();
    expect(visibility).toBe(false);
  });
});
