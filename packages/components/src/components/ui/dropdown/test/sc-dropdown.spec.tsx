import { newSpecPage } from '@stencil/core/testing';
import { ScDropdown } from '../dropdown';

describe('sc-dropdown', () => {
  function withPanelClass(name) {
    return `
    <sc-dropdown close-on-select="">
      <mock:shadow-root>
      <div class="dropdown">
        <span aria-expanded="true" aria-haspopup="true" class="dropdown__trigger" part="trigger">
          <slot name="trigger"></slot>
        </span>
        <div aria-labelledby="menu-button" aria-orientation="vertical" class="dropdown__panel ${name}" part="panel" role="menu" tabindex="-1">
          <slot></slot>
        </div>
      </mock:shadow-root>
    </sc-dropdown>
  `;
  }
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDropdown],
      html: `<sc-dropdown></sc-dropdown>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-dropdown close-on-select="">
        <mock:shadow-root>
        <div class="dropdown">
          <span aria-expanded="true" aria-haspopup="true" class="dropdown__trigger" part="trigger">
            <slot name="trigger"></slot>
          </span>
          <div aria-labelledby="menu-button" aria-orientation="vertical" class="dropdown__panel" part="panel" role="menu" tabindex="-1">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </sc-dropdown>
    `);
  });

  it('can be positioned', async () => {
    const page = await newSpecPage({
      components: [ScDropdown],
      html: `<sc-dropdown></sc-dropdown>`,
    });
    const element = await page.doc.querySelector('sc-dropdown');

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
