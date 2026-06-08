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

  it('renders bundle components and the note inside a single details region', async () => {
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

    // The note lives in the same region (no separate sc-product-line-item-note).
    const note = page.root.shadowRoot.querySelector('.line-item-details__note');
    expect(note).toBeTruthy();
    expect(note.textContent).toContain('Please gift wrap this order.');
    expect(page.root.shadowRoot.querySelector('sc-product-line-item-note')).toBeNull();
  });

  it('omits the details region when there is no note or bundle', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item></sc-product-line-item>`,
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('.line-item-details')).toBeNull();
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
