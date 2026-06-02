import { Component, h, Prop, State, Element } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { BundleItem, LineItem, Product, Variant } from '../../../../types';
import { state as checkoutState, onChange } from '@store/checkout';
import { getLineItemByProductId } from '@store/checkout/getters';
import { getVariantFromValues } from '../../../../functions/util';
import { updateLineItem } from '@services/session';
import { updateFormState } from '@store/form/mutations';
import { createErrorNotice } from '@store/notices/mutations';
import { isProductVariantOptionMissing, isProductVariantOptionSoldOut } from '@store/utils';

/**
 * Instant-checkout-side picker for bundle component variants.
 *
 * Mirrors the PDP's `surecart/product-bundle-items` block but writes its
 * selection straight into the existing bundle line item's
 * `bundle_component_variants`, so the buy page can keep its Stencil-only
 * checkout flow.
 */
@Component({
  tag: 'sc-checkout-product-bundle-component-variants',
  styleUrl: 'sc-checkout-product-bundle-component-variants.scss',
  shadow: false,
})
export class ScCheckoutProductBundleComponentVariants {
  @Element() el: HTMLScCheckoutProductBundleComponentVariantsElement;

  /** The bundle product (must include bundle_items.component_product variants/variant_options). */
  @Prop() product: Product;

  /**
   * Map of componentProductId -> { option_1, option_2, option_3 }.
   * Holds the customer's in-flight selection per variable bundle component.
   */
  @State() selectedValues: Record<string, Record<string, string>> = {};

  /**
   * Map of componentProductId -> variantId.
   * Derived from selectedValues; what gets posted as
   * `bundle_component_variants` on the line item.
   */
  @State() selectedVariants: Record<string, string> = {};

  private removeListener?: () => void;

  componentWillLoad() {
    this.seedFromProductDefaults();

    // Once the checkout exists, prefer the variants already on the bundle
    // line item — keeps the picker in sync with the seeded server state.
    this.removeListener = onChange('checkout', () => {
      const lineItem = this.bundleLineItem();
      if (lineItem?.bundle_component_variants) {
        this.hydrateFromLineItem(lineItem.bundle_component_variants);
      }
    });
  }

  disconnectedCallback() {
    this.removeListener?.();
  }

  /**
   * Pick a sensible default per component — first in-stock variant when
   * the component has tracked stock, else the first variant. Matches the
   * server-side ProductPageBlock::findInitialBundleComponentVariant.
   */
  private seedFromProductDefaults() {
    const variableComponents = this.variableComponents();
    if (!variableComponents.length) return;

    const values: Record<string, Record<string, string>> = {};
    const variants: Record<string, string> = {};

    variableComponents.forEach(component => {
      const variant = this.findInitialVariant(component);
      if (!variant) return;
      values[component.id] = this.variantToValues(variant);
      variants[component.id] = variant.id;
    });

    this.selectedValues = values;
    this.selectedVariants = variants;
  }

  /**
   * When the checkout's bundle line item already has a saved selection,
   * use those ids instead of the local defaults.
   */
  private hydrateFromLineItem(map: Record<string, string>) {
    const variants: Record<string, string> = {};
    const values: Record<string, Record<string, string>> = {};

    this.variableComponents().forEach(component => {
      const variantId = map[component.id];
      const variant = (component.variants?.data || []).find((v: Variant) => v.id === variantId);
      if (!variant) return;
      variants[component.id] = variant.id;
      values[component.id] = this.variantToValues(variant);
    });

    if (Object.keys(variants).length) {
      this.selectedVariants = { ...this.selectedVariants, ...variants };
      this.selectedValues = { ...this.selectedValues, ...values };
    }
  }

  /**
   * Bundle items that actually need a picker — components without variant
   * options are skipped (nothing to choose), matching the PDP block's gate.
   */
  private variableItems(): Array<{ item: BundleItem; component: Product }> {
    const items = (this.product?.bundle_items?.data || []) as BundleItem[];
    return items.map(item => ({ item, component: item.component_product as Product })).filter(({ component }) => !!component?.id && !!component?.variant_options?.data?.length);
  }

  private variableComponents(): Product[] {
    return this.variableItems().map(({ component }) => component);
  }

  private findInitialVariant(component: Product): Variant | null {
    const variants: Variant[] = component?.variants?.data || [];
    if (!variants.length) return null;
    const hasUnlimitedStock = !!(component as any)?.has_unlimited_stock;
    if (hasUnlimitedStock) return variants[0];
    // `archived` isn't on the Variant type; stock-based check is sufficient
    // since archived variants surface with 0 available_stock anyway.
    const inStock = variants.find(v => (v.available_stock ?? 0) > 0);
    return inStock || variants[0];
  }

  private variantToValues(variant: Variant): Record<string, string> {
    const values: Record<string, string> = {};
    (['option_1', 'option_2', 'option_3'] as const).forEach(key => {
      const value = (variant as any)?.[key];
      if (value !== null && value !== undefined && value !== '') {
        values[key] = value;
      }
    });
    return values;
  }

  /**
   * Compute whether a given option_value should render as disabled —
   * either no variant carries the combination (missing) or every variant
   * matching it is out of stock. Mirrors the PDP pill logic in
   * `sc-product-pills-variant-option` so checkout stays in step with PDP.
   */
  private isOptionUnavailable(component: Product, optionIndex: number, value: string): boolean {
    const componentValues = this.selectedValues[component.id] || {};
    const optionNumber = optionIndex + 1;
    return isProductVariantOptionSoldOut(optionNumber, value, componentValues, component) || isProductVariantOptionMissing(optionNumber, value, componentValues, component);
  }

  /** Update one option for a single component, then resolve the variant. */
  private setOption(component: Product, optionIndex: number, value: string) {
    // Don't let an unavailable pill commit a selection — visual disabled
    // alone isn't enough since sc-pill-option only sets aria-disabled.
    if (this.isOptionUnavailable(component, optionIndex, value)) return;

    const optionKey = `option_${optionIndex + 1}`;
    const next = {
      ...(this.selectedValues[component.id] || {}),
      [optionKey]: value,
    };
    this.selectedValues = { ...this.selectedValues, [component.id]: next };

    const variant = getVariantFromValues({
      variants: component?.variants?.data || [],
      values: next,
    });
    if (!variant?.id) {
      if (this.selectedVariants[component.id]) {
        const next = { ...this.selectedVariants };
        delete next[component.id];
        this.selectedVariants = next;
      }
      return;
    }
    if (this.selectedVariants[component.id] === variant.id) return;

    this.selectedVariants = { ...this.selectedVariants, [component.id]: variant.id };
    this.persistSelection();
  }

  private bundleLineItem(): LineItem | undefined {
    return getLineItemByProductId(this.product?.id);
  }

  /**
   * Push the current selection map to the API. We only update the existing
   * bundle line item — the buy page seeds it on first load via
   * BuyPageController, so by the time the user clicks a pill it exists.
   */
  private async persistSelection() {
    const lineItem = this.bundleLineItem();
    if (!lineItem?.id) return;

    // Nothing to send if the selection is identical to what's stored.
    const current = lineItem.bundle_component_variants || {};
    const next = this.selectedVariants;
    const same = Object.keys(next).length === Object.keys(current).length && Object.entries(next).every(([k, v]) => current[k] === v);
    if (same) return;

    try {
      updateFormState('FETCH');
      checkoutState.checkout = await updateLineItem({
        id: lineItem.id,
        data: { bundle_component_variants: next },
      });
      updateFormState('RESOLVE');
    } catch (e) {
      console.error(e);
      createErrorNotice(e);
      updateFormState('REJECT');
    }
  }

  /**
   * Render one row per variant option per variable bundle item — matches
   * the PDP's `surecart/bundle-item-template` structure so the buy page
   * reads identically.
   */
  private renderItemRows({ item, component }: { item: BundleItem; component: Product }) {
    const options = component?.variant_options?.data || [];
    const selected = this.selectedValues[component.id] || {};
    const componentName = (component as any)?.name || '';
    const quantity = Math.max(1, Number(item?.quantity) || 1);
    const showQuantity = quantity > 1;

    return options.map(({ name, values }: { name: string; values: string[] }, index: number) => {
      const optionKey = `option_${index + 1}`;
      return (
        <div class="sc-bundle-item__row" key={`${component.id}-${optionKey}`}>
          <div class="sc-bundle-item__row-header">
            <span class="sc-bundle-item__product-name">{componentName}</span>
            <span class="sc-bundle-item__variant-name"> &ndash; {name}</span>
            {showQuantity && <span class="sc-bundle-item__qty">&times; {quantity}</span>}
          </div>
          <div class="sc-bundle-item__pills">
            {(values || []).map(value => {
              const isSelected = selected[optionKey] === value;
              const isUnavailable = this.isOptionUnavailable(component, index, value);
              return (
                <sc-pill-option isSelected={isSelected} isUnavailable={isUnavailable} onClick={() => this.setOption(component, index, value)}>
                  <span aria-hidden="true">{value}</span>
                  <sc-visually-hidden>
                    {/* translators: %1$s option name, %2$s value, %3$s component product name */}
                    {sprintf(__('Select %1$s: %2$s for %3$s', 'surecart'), name, value, componentName)}
                    {isUnavailable && <span> {__('(option unavailable)', 'surecart')}</span>}
                  </sc-visually-hidden>
                </sc-pill-option>
              );
            })}
          </div>
        </div>
      );
    });
  }

  render() {
    if (!this.product?.bundle) return null;
    const items = this.variableItems();
    if (!items.length) return null;

    return <div class="sc-bundle-items">{items.map(entry => this.renderItemRows(entry))}</div>;
  }
}
