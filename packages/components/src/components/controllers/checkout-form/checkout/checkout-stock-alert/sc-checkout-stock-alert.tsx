import { Component, Host, h, State, EventEmitter, Event } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Checkout, LineItemData, Product } from 'src/types';
import { state as checkoutState } from '@store/checkout';
import { updateCheckout } from '@services/session';
import { currentFormState } from '@store/form/getters';

/**
 * This component listens for stock requirements and displays a dialog to the user.
 */
@Component({
  tag: 'sc-checkout-stock-alert',
  styleUrl: 'sc-checkout-stock-alert.scss',
  shadow: true,
})
export class ScCheckoutStockAlert {
  /** Stock errors */
  @State() stockErrors: Array<any> = [];

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  /** Is it busy */
  @State() busy: boolean;

  /** Update stock error. */
  @State() error: string;

  /** Get the out of stock line items. */
  getOutOfStockLineItems() {
    return (checkoutState.checkout?.line_items?.data || []).filter(lineItem => {
      const product = lineItem.price?.product as Product;

      // this item is not out of stock, don't include it.
      if (lineItem?.purchasable_status !== 'out_of_stock') return false;

      // check the variant stock.
      if (lineItem?.variant?.id) {
        return lineItem?.variant?.available_stock < lineItem.quantity;
      }

      return product?.available_stock < lineItem.quantity;
    });
  }

  /**
   * Build line items with adjusted quantities for out-of-stock items.
   *
   * Returns all line items, with out-of-stock items adjusted to max available stock.
   */
  getStockAdjustedLineItems() {
    // Get the IDs of out-of-stock line items and their adjusted quantities.
    const outOfStockItemsMap = new Map<string, number>();
    this.getOutOfStockLineItems().forEach(lineItem => {
      const product = lineItem.price?.product as Product;
      const adjustedQuantity = lineItem?.variant?.id ? Math.max(lineItem?.variant?.available_stock || 0, 0) : Math.max(product?.available_stock || 0, 0);
      outOfStockItemsMap.set(lineItem.id, adjustedQuantity);
    });

    // Build the complete line items array with all items, adjusting only the out-of-stock ones.
    return (checkoutState.checkout?.line_items?.data || []).map(lineItem => {
      const adjustedQuantity = outOfStockItemsMap.get(lineItem.id);
      return {
        id: lineItem.id,
        price_id: lineItem.price?.id,
        quantity: adjustedQuantity !== undefined ? adjustedQuantity : lineItem.quantity,
        ...(lineItem?.variant?.id ? { variant: lineItem.variant.id } : {}),
      };
    });
  }

  /**
   * Update the checkout line items stock to the max available.
   *
   * Bundle component OOS items can't be removed directly — they're
   * synthesized server-side from the parent's bundle_component_variants.
   * For each OOS component, find an in-stock variant of the same component
   * product and swap via the parent, otherwise the dialog loops (the
   * regenerated component reappears OOS on the next state read).
   */
  async onSubmit() {
    // Tracks whether we re-posted a bundle component swap, so the catch can
    // show an actionable message if the platform rejects the substitute.
    let attemptedBundleSwap = false;
    try {
      this.busy = true;
      this.error = null;

      const items = checkoutState.checkout?.line_items?.data || [];
      const parentOverrides = new Map<string, Record<string, string>>();
      // Track bundle parents whose OOS component has no in-stock swap —
      // we cannot recover those silently, so we surface a message instead
      // of letting the platform 500 on a re-posted OOS bundle.
      const unrecoverableBundleParents = new Set<string>();
      this.getOutOfStockLineItems().forEach(oos => {
        if (!oos.component_line_item || !oos.bundle_line_item) return;
        const parent = items.find(li => li.id === oos.bundle_line_item);
        const product = oos.price?.product as Product;
        const swap = (product?.variants?.data || []).find(v => v.id !== oos.variant?.id && (v.available_stock ?? 0) > 0 && !v?.archived);
        if (!parent?.id || !product?.id) return;
        if (!swap?.id) {
          unrecoverableBundleParents.add(parent.id);
          return;
        }
        const map = parentOverrides.get(parent.id) || { ...(parent.bundle_component_variants || {}) };
        map[product.id] = swap.id;
        parentOverrides.set(parent.id, map);
      });

      attemptedBundleSwap = parentOverrides.size > 0;

      // If any bundle has an OOS component with no swap, don't pretend the
      // update will succeed — bail with a clear message so the dialog
      // doesn't loop into an "internal server error" from the platform.
      const stillUnrecoverable = Array.from(unrecoverableBundleParents).filter(id => !parentOverrides.has(id));
      if (stillUnrecoverable.length) {
        this.error = __('One or more bundle items are out of stock and cannot be substituted. Please remove the item or choose a different bundle.', 'surecart');
        return;
      }

      const lineItems = this.getStockAdjustedLineItems()
        .filter(lineItem => !!lineItem.quantity)
        .map(lineItem =>
          lineItem.id && parentOverrides.has(lineItem.id)
            ? { ...lineItem, bundle_component_variants: parentOverrides.get(lineItem.id) }
            : lineItem,
        );

      checkoutState.checkout = (await updateCheckout({
        id: checkoutState.checkout.id,
        data: { line_items: lineItems },
      })) as Checkout;
    } catch (error) {
      // A rejected bundle swap surfaces as a generic 500 — show an actionable
      // message so the shopper can remove the item or pick another bundle.
      if (attemptedBundleSwap) {
        this.error = __('We could not automatically update an out-of-stock bundle item. Please remove it or choose a different bundle.', 'surecart');
      } else {
        // Build the message defensively — `additionalErrors?.length && ...`
        // used to evaluate to the literal `0` when there were no additional
        // errors, which then got stringified into the displayed error.
        const additionalErrors = (error?.additional_errors || []).map(e => e?.message).filter(Boolean);
        const parts = [error?.message || __('Something went wrong.', 'surecart')];
        if (additionalErrors.length) parts.push(additionalErrors.join('. '));
        this.error = parts.join(' ');
      }
    } finally {
      this.busy = false;
    }
  }

  render() {
    // stock errors.
    const stockErrors = (this.getOutOfStockLineItems() || []).map(lineItem => {
      const product = lineItem.price?.product as Product;
      const available_stock = lineItem?.variant?.id ? lineItem?.variant?.available_stock : product?.available_stock;

      return {
        name: product?.name,
        variant: lineItem?.variant_display_options,
        image: lineItem?.image,
        quantity: lineItem.quantity,
        available_stock,
      };
    });

    // we have at least one quantity change.
    const hasOutOfStockItems = stockErrors?.some(item => item?.available_stock < 1);

    return (
      <Host>
        <sc-dialog open={!!stockErrors.length && currentFormState() === 'draft'} noHeader={true} onScRequestClose={e => e.preventDefault()} class="stock-alert">
          <sc-dashboard-module class="subscription-cancel" error={this.error} style={{ '--sc-dashboard-module-spacing': '1em' }}>
            <sc-flex slot="heading" align-items="center" justify-content="flex-start">
              <sc-icon name="alert-circle" style={{ color: 'var(--sc-color-primary-500' }}></sc-icon>
              {hasOutOfStockItems ? __('Out of Stock', 'surecart') : __('Quantity Update', 'surecart')}
            </sc-flex>
            <span slot="description">
              {hasOutOfStockItems
                ? __('Some items are no longer available. Your cart will be updated.', 'surecart')
                : __('Available quantities for these items have changed. Your cart will be updated.', 'surecart')}
            </span>

            <sc-card no-padding>
              <sc-table>
                <sc-table-cell slot="head">{__('Description', 'surecart')}</sc-table-cell>
                <sc-table-cell slot="head" style={{ width: '100px', textAlign: 'right' }}>
                  {__('Quantity', 'surecart')}
                </sc-table-cell>

                {stockErrors.map((item, index) => {
                  const isLastChild = index === stockErrors.length - 1;
                  return (
                    <sc-table-row
                      style={{
                        '--columns': '2',
                        ...(isLastChild ? { border: 'none' } : {}),
                      }}
                    >
                      <sc-table-cell>
                        <sc-flex justifyContent="flex-start" alignItems="center">
                          {item?.image && <img {...(item.image as any)} class="stock-alert__image" />}
                          <div class="stock-alert__product-info">
                            <h4>{item.name}</h4>
                            {item?.variant && <span class="stock-alert__variant">{item.variant}</span>}
                          </div>
                        </sc-flex>
                      </sc-table-cell>
                      <sc-table-cell style={{ width: '100px', textAlign: 'right' }}>
                        <span class="stock-alert__quantity">
                          <span>{item?.quantity}</span> <sc-icon name="arrow-right" /> <span>{Math.max(item?.available_stock, 0)}</span>
                        </span>
                      </sc-table-cell>
                    </sc-table-row>
                  );
                })}
              </sc-table>
            </sc-card>
          </sc-dashboard-module>

          <sc-button slot="footer" type="primary" loading={this.busy} onClick={() => this.onSubmit()}>
            {__('Continue', 'surecart')}
            <sc-icon name="arrow-right" slot="suffix" />
          </sc-button>

          {this.busy && <sc-block-ui spinner></sc-block-ui>}
        </sc-dialog>
      </Host>
    );
  }
}
