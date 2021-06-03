import { newE2EPage } from '@stencil/core/testing';

describe('ce-dropdown', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-dropdown></ce-dropdown>');

    const element = await page.find('ce-dropdown');
    expect(element).toHaveClass('hydrated');
  });

  it('can open and close', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <ce-dropdown>
        <ce-button slot="trigger" caret>Click Here</ce-button>
        <div>Test</div>
    </ce-dropdown>`);

    const panel = await page.find('ce-dropdown >>> .dropdown__panel');

    let visibility = await panel.isVisible();
    expect(visibility).toBe(false);

    await page.click('ce-button');
    await page.waitForChanges();
    visibility = await panel.isVisible();
    expect(visibility).toBe(true);

    await page.click('body');
    visibility = await panel.isVisible();
    expect(visibility).toBe(false);
  });
});
