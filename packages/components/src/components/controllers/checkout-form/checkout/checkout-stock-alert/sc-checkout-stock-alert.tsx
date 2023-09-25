import { Component, Host, h, Prop, State, Watch, EventEmitter, Event } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Checkout, LineItemData, Product } from 'src/types';
import { state as checkoutState } from '@store/checkout';
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

  /** Update stock error. */
  @State() error: string;

  @Watch('order')
  handleStockAlert() {
    this.stockErrors = (this.getOutOfStockLineItems() || []).map(lineItem => {
      const product = lineItem.price?.product as Product;
      const variantImage = typeof lineItem?.variant?.image !== 'string' ? lineItem?.variant?.image?.url : null;
      return {
        name: product?.name,
        image_url: variantImage || product?.image_url,
        quantity: lineItem.quantity,
        stock: lineItem?.variant?.stock || product?.stock,
      };
    });
  }

  /** Get the out of stock line items. */
  getOutOfStockLineItems() {
    return (this.order?.line_items?.data || []).filter(lineItem => {
      const product = lineItem.price?.product as Product;
      return product?.stock_enabled && !product?.allow_out_of_stock_purchases && (lineItem?.variant?.stock || product?.stock < lineItem.quantity);
    });
  }

  /**
   * Update the checkout line items stock to the max available.
   */
  async onSubmit() {
    const lineItems = this.getOutOfStockLineItems().map(lineItem => {
      const product = lineItem.price?.product as Product;
      const stockQuantity = lineItem?.variant?.stock || product?.stock || 0;
      return {
        ...lineItem,
        quantity: stockQuantity,
      };
    });

    try {
      this.busy = true;
      checkoutState.checkout = (await updateCheckout({
        id: checkoutState.checkout.id,
        data: {
          line_items: (lineItems || [])
            .filter(lineItem => !!lineItem.quantity)
            .map(lineItem => {
              return {
                id: lineItem.id,
                price_id: lineItem.price?.id,
                quantity: lineItem.quantity,
                ...(lineItem?.variant?.id ? { variant: lineItem.variant.id } : {}),
              };
            }),
        },
      })) as Checkout;
    } catch (error) {
      const additionalErrors = (error?.additional_errors || []).map(error => error?.message).filter(n => n);
      this.error = `${error?.message || __('Something went wrong.', 'surecart')} ${additionalErrors?.length && ` ${additionalErrors.join('. ')}`}`;
    } finally {
      this.busy = false;
    }
  }

  render() {
    return (
      <Host>
        <sc-dialog style={{ '--body-spacing': 'var(--sc-spacing-x-large)' }} open={!!this.stockErrors.length} noHeader={true} onScRequestClose={e => e.preventDefault()}>
          <sc-dashboard-module class="subscription-cancel" error={this.error} style={{ '--sc-dashboard-module-spacing': '1em' }}>
            <sc-flex slot="heading" align-items="center" justify-content="flex-start">
              <sc-icon name="alert-circle" style={{ color: 'var(--sc-color-primary-500' }}></sc-icon>
              {__('Out of Stock', 'surecart')}
            </sc-flex>
            <span slot="description"> {__('Some items are no longer available. Your cart has been updated.', 'surecart')}</span>
            <sc-card no-padding>
              <sc-table>
                <sc-table-cell slot="head">{__('Description', 'surecart')}</sc-table-cell>
                <sc-table-cell slot="head" style={{ width: '100px', textAlign: 'right' }}>
                  {__('Quantity', 'surecart')}
                </sc-table-cell>

                {this.stockErrors.map((item, index) => {
                  const isLastChild = index === this.stockErrors.length - 1;
                  return (
                    <sc-table-row style={{ '--columns': '2', ...(isLastChild ? { border: 'none' } : {}) }}>
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
