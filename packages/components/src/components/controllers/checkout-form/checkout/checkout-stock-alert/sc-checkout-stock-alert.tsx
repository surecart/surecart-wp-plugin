import { Component, Host, h, Prop, State, Watch, EventEmitter, Event } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Checkout, LineItemData, Product } from 'src/types';
import { state as checkoutState } from '@store/checkout';
import { openWormhole } from 'stencil-wormhole';
import { updateCheckout } from '@services/session';

/**
 * This component listens for stock requirements and displays a dialog to the user.
 */
@Component({
  tag: 'sc-checkout-stock-alert',
  styleUrl: 'sc-checkout-stock-alert.scss',
  shadow: true,
})
export class ScCheckoutStockAlert {
  /** The current order. */
  @Prop() order: Checkout;

  /** Stock errors */
  @State() stockErrors: Array<any> = [];

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  /** Is it busy */
  @State() busy: boolean;

  @Watch('order')
  handleStockAlert() {
    const { line_items: lineItems } = this.order;
    const stockErrors = [];

    (lineItems?.data || []).forEach(lineItem => {
      const product = lineItem.price?.product as Product;

      const stockEnabled = product?.stock_enabled || false;
      const allowOutOfStockPurchases = product?.allow_out_of_stock_purchases || false;
      const stockQuantity = product?.stock || 0;

      // if stock is enabled and out of stock purchases are not allowed.
      if (stockEnabled && !allowOutOfStockPurchases && stockQuantity < lineItem.quantity) {
        stockErrors.push({
          name: product?.name,
          image_url: product?.image_url,
          quantity: lineItem.quantity,
          stock: stockQuantity,
        });
      }
    });

    this.stockErrors = stockErrors;
  }

  /**
   * Update the checkout line items stock to the max available.
   */
  async updateCheckoutLineItemsStock() {
    const { line_items: lineItems } = this.order;

    (lineItems?.data || []).forEach(lineItem => {
      const product = lineItem.price?.product as Product;

      const stockEnabled = product?.stock_enabled || false;
      const allowOutOfStockPurchases = product?.allow_out_of_stock_purchases || false;
      const stockQuantity = product?.stock || 0;

      // if stock is enabled and out of stock purchases are not allowed.
      if (stockEnabled && !allowOutOfStockPurchases && stockQuantity < lineItem.quantity) {
        lineItem.quantity = stockQuantity;
      }
    });

    this.busy = true;
    checkoutState.checkout = (await updateCheckout({
      id: checkoutState.checkout.id,
      data: {
        line_items: (lineItems?.data || []).map(lineItem => {
          return {
            price_id: lineItem.price?.id,
            quantity: lineItem.quantity,
          };
        }),
      },
    })) as Checkout;
    this.busy = false;
  }

  render() {
    return (
      <Host>
        <sc-dialog open={!!this.stockErrors.length} noHeader={true} onScRequestClose={e => e.preventDefault()}>
          <sc-flex justifyContent="flex-start" alignItems="center" style={{ marginBottom: '30px' }}>
            <div>
              <sc-icon style={{ fontSize: '50px', color: 'var(--sc-color-gray-300)' }} name="alert-circle"></sc-icon>
            </div>
            <div>
              <sc-text style={{ '--font-size': 'var(--sc-font-size-large)', '--font-weight': 'var(--sc-font-weight-bold)', '--line-height': '2' }}>
                {__('Out of Stock', 'surecart')}
              </sc-text>
              <sc-text style={{ marginBottom: '1em', lineHeight: '1.5', color: 'var(--sc-color-gray-500)' }}>
                {__('Some items are no longer available. Your cart has been updated.', 'surecart')}
              </sc-text>
            </div>
          </sc-flex>

          <div style={{ marginLeft: '60px' }}>
            <sc-table>
              <sc-table-cell slot="head">{__('Description', 'surecart')}</sc-table-cell>
              <sc-table-cell slot="head" style={{ width: '100px', textAlign: 'right' }}>
                {__('Quantity', 'surecart')}
              </sc-table-cell>

              {this.stockErrors.map(item => {
                return (
                  <sc-table-row style={{ '--columns': '2' }}>
                    <sc-table-cell>
                      <sc-flex justifyContent="flex-start" alignItems="center">
                        <img src={item?.image_url} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                        <h4>{item.name}</h4>
                      </sc-flex>
                    </sc-table-cell>
                    <sc-table-cell style={{ width: '100px', textAlign: 'right' }}>
                      <span style={{ '--color': 'var(--sc-color-gray-500)' }}>{item?.quantity}</span> → <span>{item?.stock}</span>
                    </sc-table-cell>
                  </sc-table-row>
                );
              })}
            </sc-table>
            <div slot="footer" style={{ marginTop: '50px' }}>
              <sc-button type="primary" loading={this.busy} onClick={() => this.updateCheckoutLineItemsStock()}>
                {__('Continue', 'surecart')}
                <sc-icon name="arrow-right" slot="suffix" />
              </sc-button>
            </div>
          </div>
          {this.busy && <sc-block-ui spinner></sc-block-ui>}
        </sc-dialog>
      </Host>
    );
  }
}

openWormhole(ScCheckoutStockAlert, ['checkoutState'], false);
