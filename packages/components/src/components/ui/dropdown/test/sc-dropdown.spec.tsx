import { newSpecPage } from '@stencil/core/testing';
import { ScDropdown } from '../dropdown';

describe('sc-dropdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDropdown],
      html: `<sc-dropdown></sc-dropdown>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('can be positioned', async () => {
    const page = await newSpecPage({
      components: [ScDropdown],
      html: `<sc-dropdown></sc-dropdown>`,
    });
    const element = await page.doc.querySelector('sc-dropdown');

    element.position = 'top-left';
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();

    element.position = 'top-right';
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();

    element.position = 'bottom-left';
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();

    element.position = 'bottom-right';
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
