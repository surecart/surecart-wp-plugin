import { newSpecPage } from '@stencil/core/testing';
import { ScProductLineItem } from '../sc-product-line-item';

const bundleComponent = (id: string, name: string, variants: string, quantity = 1) => ({
  id,
  quantity,
  variant_display_options: variants,
  price: { product: { name } },
});

describe('sc-product-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item></sc-product-line-item>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders bundle components in the details region and the note as a standalone note', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item></sc-product-line-item>`,
    });

    page.root.note = 'Please gift wrap this order.';
    page.root.bundleComponents = [bundleComponent('c1', 'Sleeping Bag', '10°C / Forest', 1), bundleComponent('c2', 'Trail Tent', '2-Person', 2)];
    await page.waitForChanges();

    const details = page.root.shadowRoot.querySelector('.line-item-details');
    expect(details).toBeTruthy();

    // Both bundle rows render.
    const rows = page.root.shadowRoot.querySelectorAll('.line-item-details__row');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Sleeping Bag - 10°C / Forest');
    expect(rows[1].textContent).toContain('Trail Tent - 2-Person');
    // Quantity multiplier only when > 1.
    expect(rows[1].textContent).toContain('× 2');

    // The note is a standalone note (not inside the collapsible details region).
    expect(page.root.shadowRoot.querySelector('.line-item-details__note')).toBeNull();
    const note = page.root.shadowRoot.querySelector('sc-product-line-item-note');
    expect(note).toBeTruthy();
    expect(note.getAttribute('note')).toContain('Please gift wrap this order.');
  });

  it('shows bundle items without a variant by default (name only)', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item></sc-product-line-item>`,
    });

    page.root.bundleComponents = [bundleComponent('c1', 'Sleeping Bag', '10°C / Forest', 1), bundleComponent('c2', 'Camp Mug', '', 1)];
    await page.waitForChanges();

    const rows = page.root.shadowRoot.querySelectorAll('.line-item-details__row');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Sleeping Bag - 10°C / Forest');
    // No variant => name only, no trailing " - ".
    expect(rows[1].textContent).toContain('Camp Mug');
    expect(rows[1].textContent).not.toContain('Camp Mug -');
  });

  it('hides bundle items without a variant when showAllBundleItems is false', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item></sc-product-line-item>`,
    });

    page.root.showAllBundleItems = false;
    page.root.bundleComponents = [bundleComponent('c1', 'Sleeping Bag', '10°C / Forest', 1), bundleComponent('c2', 'Camp Mug', '', 1)];
    await page.waitForChanges();

    const rows = page.root.shadowRoot.querySelectorAll('.line-item-details__row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Sleeping Bag - 10°C / Forest');
  });

  it('omits the details region when there is no bundle; a note alone renders standalone', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item></sc-product-line-item>`,
    });

    page.root.note = 'Please gift wrap this order.';
    await page.waitForChanges();

    // The details region is bundle-only now — a note does not create it.
    expect(page.root.shadowRoot.querySelector('.line-item-details')).toBeNull();
    // The note still renders as a standalone note.
    expect(page.root.shadowRoot.querySelector('sc-product-line-item-note')).toBeTruthy();
  });

  it('omits the meta row when there is no description or trial/fees content', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item></sc-product-line-item>`,
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('[part="description"]')).toBeNull();
    expect(page.root.shadowRoot.querySelector('[part="trial-fees"]')).toBeNull();
  });

  it('renders the meta row when variant or trial content is present', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item></sc-product-line-item>`,
    });

    page.root.variant = 'Large / Blue';
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('[part="description"]')?.textContent).toContain('Large / Blue');
    expect(page.root.shadowRoot.querySelector('[part="trial-fees"]')).toBeTruthy();

    page.root.variant = '';
    page.root.trial = '7-day free trial';
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('[part="description"]')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('[part="trial-fees"]')?.textContent).toContain('7-day free trial');
  });
});
