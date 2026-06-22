import { Component, Host, h, State, EventEmitter, Event } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Checkout, LineItemData, Product } from 'src/types';
import { state as checkoutState } from '@store/checkout';
import { updateCheckout } from '@services/session';
import { currentFormState } from '@store/form/getters';
import { buildStockAdjustedLineItems, buildStockAlertRows, getBundleComponentVariants, getBundleQuantityReductions, getOutOfStockLineItems } from '../../../../../functions/stock';

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

  /** Current checkout line items. */
  get lineItems() {
    return checkoutState.checkout?.line_items?.data || [];
  }

  /**
   * Update the checkout to the max available stock.
   *
   * Bundle shortages reduce the whole bundle quantity (a bundle is atomic). A
   * bundle that can't make even one unit (reduced to 0) is first rescued by
   * swapping a gone variant to an in-stock sibling when one exists; otherwise
   * the unfulfillable bundle is dropped from the cart, matching the "→ 0" the
   * dialog already shows.
   */
  async onSubmit() {
    let attemptedBundleSwap = false;
    try {
      this.busy = true;
      this.error = null;

      const items = this.lineItems;
      const reductions = getBundleQuantityReductions(items);

      // Only bundles reduced to 0 need rescuing — try swapping the gone
      // variant to an in-stock sibling so we don't drop a recoverable bundle.
      // If no swap exists the bundle stays at 0 and is removed below.
      const parentOverrides = new Map<string, Record<string, string>>();
      getOutOfStockLineItems(items).forEach(oos => {
        if (!oos.component_line_item || !oos.bundle_line_item) return;
        const parent = items.find(li => li.id === oos.bundle_line_item);
        if (!parent?.id || (reductions.get(parent.id) ?? 0) >= 1) return;

        const product = oos.price?.product as Product;
        if (!product?.id) return;
        const swap = (product?.variants?.data || []).find(v => v.id !== oos.variant?.id && (v.available_stock ?? 0) > 0);
        if (!swap?.id) return;

        // Rebuild the full selection from the component line items (the parent
        // field reads back empty), then swap the gone variant — posting only the
        // swapped component would fail the platform's per-component requirement.
        const map = parentOverrides.get(parent.id) || getBundleComponentVariants(parent.id, items);
        map[product.id] = swap.id;
        parentOverrides.set(parent.id, map);
      });

      attemptedBundleSwap = parentOverrides.size > 0;

      // Bundles still capped at 0 (no in-stock swap) fall to quantity 0 and are
      // filtered out here — the unfulfillable bundle is simply removed.
      const lineItems = buildStockAdjustedLineItems(items, parentOverrides).filter(lineItem => !!lineItem.quantity);

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
    const stockErrors = buildStockAlertRows(this.lineItems);

    // we have at least one fully out-of-stock item.
    const hasOutOfStockItems = stockErrors?.some(item => item?.to < 1);

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
                          <span>{item?.from}</span> <sc-icon name="arrow-right" /> <span>{Math.max(item?.to, 0)}</span>
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
