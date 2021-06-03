import { newSpecPage } from '@stencil/core/testing';
import { CEDropdown } from '../dropdown';

describe('ce-dropdown', () => {
  function withPanelClass(name) {
    return `
    <ce-dropdown close-on-select="">
      <mock:shadow-root>
      <div class="dropdown">
        <span aria-expanded="true" aria-haspopup="true" class="dropdown__trigger" part="trigger">
          <slot name="trigger"></slot>
        </span>
        <div aria-labelledby="menu-button" aria-orientation="vertical" class="dropdown__panel ${name}" part="panel" role="menu" tabindex="-1">
          <slot></slot>
        </div>
      </mock:shadow-root>
    </ce-dropdown>
  `;
  }
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEDropdown],
      html: `<ce-dropdown></ce-dropdown>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-dropdown close-on-select="">
        <mock:shadow-root>
        <div class="dropdown">
          <span aria-expanded="true" aria-haspopup="true" class="dropdown__trigger" part="trigger">
            <slot name="trigger"></slot>
          </span>
          <div aria-labelledby="menu-button" aria-orientation="vertical" class="dropdown__panel" part="panel" role="menu" tabindex="-1">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </ce-dropdown>
    `);
  });

  it('can be positioned', async () => {
    const page = await newSpecPage({
      components: [CEDropdown],
      html: `<ce-dropdown></ce-dropdown>`,
    });
    const element = await page.doc.querySelector('ce-dropdown');

    element.position = 'top-left';
    await page.waitForChanges();
    expect(page.root).toEqualHtml(withPanelClass('position--top-left'));

    element.position = 'top-right';
    await page.waitForChanges();
    expect(page.root).toEqualHtml(withPanelClass('position--top-right'));

    element.position = 'bottom-left';
    await page.waitForChanges();
    expect(page.root).toEqualHtml(withPanelClass('position--bottom-left'));

    element.position = 'bottom-right';
    await page.waitForChanges();
    expect(page.root).toEqualHtml(withPanelClass('position--bottom-right'));
  });
});
