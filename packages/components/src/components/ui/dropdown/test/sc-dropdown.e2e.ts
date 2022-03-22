import { newE2EPage } from '@stencil/core/testing';

describe('sc-dropdown', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-dropdown></sc-dropdown>');

    const element = await page.find('sc-dropdown');
    expect(element).toHaveClass('hydrated');
  });

  it('can open and close', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <sc-dropdown>
        <sc-button slot="trigger" caret>Click Here</sc-button>
        <div>Test</div>
    </sc-dropdown>`);

    const panel = await page.find('sc-dropdown >>> .dropdown__panel');

    let visibility = await panel.isVisible();
    expect(visibility).toBe(false);

    await page.click('sc-button');
    await page.waitForChanges();
    visibility = await panel.isVisible();
    expect(visibility).toBe(true);

    await page.click('body');
    visibility = await panel.isVisible();
    expect(visibility).toBe(false);
  });
});
