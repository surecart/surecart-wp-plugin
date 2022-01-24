import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { PaymentMethod } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-payment-methods-list',
  styleUrl: 'ce-payment-methods-list.scss',
  shadow: true,
})
export class CePaymentMethodsList {
  @Element() el: HTMLCePaymentMethodsListElement;
  /** Query to fetch paymentMethods */
  @Prop() query: object;

  @State() paymentMethods: Array<PaymentMethod> = [];

  /** Loading state */
  @State() loading: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getPaymentMethods();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  /** Get all paymentMethods */
  async getPaymentMethods() {
    try {
      this.loading = true;
      this.paymentMethods = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/payment_methods/`, {
          expand: ['card'],
          ...this.query,
        }),
      })) as PaymentMethod[];
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  renderContent() {
    if (this.loading) {
      return (
        <ce-table-row>
          {[...Array(4)].map(() => (
            <ce-table-cell>
              <ce-skeleton style={{ width: '100px', display: 'inline-block' }}></ce-skeleton>
            </ce-table-cell>
          ))}
        </ce-table-row>
      );
    }

    return (this.paymentMethods || []).map(paymentMethod => {
      const { id, card, created_at, processor_type } = paymentMethod;
      return (
        <ce-table-row>
          <ce-table-cell>{__('Card', 'checkout_engine')}</ce-table-cell>
          <ce-table-cell>
            {typeof processor_type !== 'string' && (
              <ce-flex justify-content="flex-start" style={{ '--spacing': '1em' }}>
                <ce-cc-logo style={{ fontSize: '36px' }} brand={card?.brand}></ce-cc-logo>
                **** {card?.last4}
              </ce-flex>
            )}
          </ce-table-cell>
          <ce-table-cell>
            <ce-format-date date={created_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
          </ce-table-cell>
          <ce-table-cell>
            <ce-button
              href={addQueryArgs(window.location.href, {
                paymentMethod: {
                  id,
                },
              })}
              size="small"
            >
              {__('Remove', 'checkout_engine')}
            </ce-button>
          </ce-table-cell>
        </ce-table-row>
      );
    });
  }

  render() {
    if (this.error) {
      return (
        <ce-alert open type="danger">
          <span slot="title">{__('Error', 'checkout_engine')}</span>
          {this.error}
        </ce-alert>
      );
    }

    if (!this.loading && !this?.paymentMethods?.length) {
      return (
        <ce-card borderless no-divider>
          <span slot="title">
            <slot name="title" />
          </span>
          <slot name="empty">{__('You have no payments.', 'checkout_engine')}</slot>
        </ce-card>
      );
    }

    return (
      <ce-card borderless no-divider>
        <span slot="title">
          <slot name="title" />
        </span>
        <ce-table>
          <ce-table-cell slot="head">{__('Type', 'checkout_engine')}</ce-table-cell>
          <ce-table-cell slot="head">{__('Details', 'checkout_engine')}</ce-table-cell>
          <ce-table-cell slot="head">{__('Added', 'checkout_engine')}</ce-table-cell>
          <ce-table-cell slot="head" style={{ width: '100px' }}></ce-table-cell>

          {this.renderContent()}
        </ce-table>
      </ce-card>
    );
  }
}
