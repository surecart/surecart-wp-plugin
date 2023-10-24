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
      // no stock handling.
      if (!product?.stock_enabled || product?.allow_out_of_stock_purchases) return;

      // check the variant stock.
      if (lineItem?.variant?.id) {
        return lineItem?.variant?.available_stock < lineItem.quantity;
      }

      return product?.available_stock < lineItem.quantity;
    });
  }

  /**
   * Update the checkout line items stock to the max available.
   */
  async onSubmit() {
    const lineItems = this.getOutOfStockLineItems().map(lineItem => {
      const product = lineItem.price?.product as Product;

      if (lineItem?.variant?.id) {
        return {
          ...lineItem,
          quantity: Math.max(lineItem?.variant?.available_stock || 0, 0),
        };
      }

      return {
        ...lineItem,
        quantity: Math.max(product?.available_stock || 0, 0),
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
    // stock errors.
    const stockErrors = (this.getOutOfStockLineItems() || []).map(lineItem => {
      const product = lineItem.price?.product as Product;
      const variantImage = typeof lineItem?.variant?.image !== 'string' ? lineItem?.variant?.image?.url : null;

      const available_stock = lineItem?.variant?.id ? lineItem?.variant?.available_stock : product?.available_stock;

      return {
        name: product?.name,
        image_url: variantImage || product?.image_url,
        quantity: lineItem.quantity,
        available_stock,
      };
    });

    return (
      <Host>
        <sc-dialog
          style={{ '--body-spacing': 'var(--sc-spacing-x-large)' }}
          open={!!stockErrors.length && currentFormState() === 'draft'}
          noHeader={true}
          onScRequestClose={e => e.preventDefault()}
        >
          <sc-dashboard-module class="subscription-cancel" error={this.error} style={{ '--sc-dashboard-module-spacing': '1em' }}>
            <sc-flex slot="heading" align-items="center" justify-content="flex-start">
              <sc-icon name="alert-circle" style={{ color: 'var(--sc-color-primary-500' }}></sc-icon>
              {__('Out of Stock', 'surecart')}
            </sc-flex>

            <span slot="description"> {__('Some items are no longer available. Your cart will be updated.', 'surecart')}</span>

            <sc-card no-padding>
              <sc-table>
                <sc-table-cell slot="head">{__('Description', 'surecart')}</sc-table-cell>
                <sc-table-cell slot="head" style={{ width: '100px', textAlign: 'right' }}>
                  {__('Quantity', 'surecart')}
                </sc-table-cell>

                {stockErrors.map((item, index) => {
                  const isLastChild = index === stockErrors.length - 1;
                  return (
                    <sc-table-row style={{ '--columns': '2', ...(isLastChild ? { border: 'none' } : {}) }}>
                      <sc-table-cell>
                        <sc-flex justifyContent="flex-start" alignItems="center">
                          <img class="stock-alert__image" src={`https://surecart.com/cdn-cgi/image/fit=scale-down,format=auto,width=100/${item?.image_url}`} />
                          <h4>{item.name}</h4>
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
