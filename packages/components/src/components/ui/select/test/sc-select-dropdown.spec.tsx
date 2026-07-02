import { newSpecPage } from '@stencil/core/testing';
import { ScSelectDropdown } from '../sc-select';

describe('sc-select-dropdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSelectDropdown],
      html: `<sc-select-dropdown></sc-select-dropdown>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders a focusable host by default', async () => {
    const page = await newSpecPage({
      components: [ScSelectDropdown],
      html: `<sc-select></sc-select>`,
    });
    expect(page.root.getAttribute('tabindex')).toBe('0');
    expect(page.root.getAttribute('role')).toBe('button');
    expect(page.root.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('removes the host from the tab order when disabled', async () => {
    const page = await newSpecPage({
      components: [ScSelectDropdown],
      html: `<sc-select disabled></sc-select>`,
    });
    expect(page.root.getAttribute('tabindex')).toBe('-1');
  });

  it('reflects the open prop on aria-expanded', async () => {
    const page = await newSpecPage({
      components: [ScSelectDropdown],
      html: `<sc-select></sc-select>`,
    });
    expect(page.root.getAttribute('aria-expanded')).toBe('false');

    page.root.open = true;
    await page.waitForChanges();

    expect(page.root.getAttribute('aria-expanded')).toBe('true');
  });

  it('builds the host aria-label from the label and placeholder when there is no value', async () => {
    const page = await newSpecPage({
      components: [ScSelectDropdown],
      html: `<sc-select label="Country" placeholder="Choose a country"></sc-select>`,
    });
    expect(page.root.getAttribute('aria-label')).toBe('Country, Choose a country');
  });

  it('falls back to the placeholder for the host aria-label when there is no label', async () => {
    const page = await newSpecPage({
      components: [ScSelectDropdown],
      html: `<sc-select placeholder="Choose a country"></sc-select>`,
    });
    expect(page.root.getAttribute('aria-label')).toBe('Choose a country');
  });

  it('emits scFocus only once when the host gains focus', async () => {
    const page = await newSpecPage({
      components: [ScSelectDropdown],
      html: `<sc-select></sc-select>`,
    });
    const scFocus = jest.fn();
    page.root.addEventListener('scFocus', scFocus);

    // handleFocus is what the host onFocus is wired to. Calling it directly is
    // deterministic and asserts the regression: it must no longer re-focus the
    // host (which previously re-entered handleFocus and emitted scFocus twice).
    page.rootInstance.handleFocus();
    await page.waitForChanges();

    expect(scFocus).toHaveBeenCalledTimes(1);
  });

  it('does not render the invalid select role on the dropdown', async () => {
    const page = await newSpecPage({
      components: [ScSelectDropdown],
      html: `<sc-select></sc-select>`,
    });
    const dropdown = page.root.shadowRoot.querySelector('sc-dropdown');
    expect(dropdown.getAttribute('role')).toBeNull();
    expect(dropdown.hasAttribute('aria-open')).toBe(false);
  });
});
