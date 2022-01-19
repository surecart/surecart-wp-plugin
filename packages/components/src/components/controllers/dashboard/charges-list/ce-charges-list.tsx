import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Charge } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-charges-list',
  styleUrl: 'ce-charges-list.scss',
  shadow: true,
})
export class CeChargesList {
  @Element() el: HTMLCeChargesListElement;
  /** Query to fetch charges */
  @Prop() query: object;

  @State() charges: Array<Charge> = [];

  /** Loading state */
  @State() loading: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getCharges();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  /** Get all charges */
  async getCharges() {
    if (!this.query) return;
    try {
      this.loading = true;
      this.charges = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/charges/`, {
          expand: ['payment_method', 'payment_method.card'],
          ...this.query,
        }),
      })) as Charge[];
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

  renderRefundStatus(charge: Charge) {
    if (charge?.fully_refunded) {
      return <ce-tag type="danger">{__('Refunded', 'checkout_engine')}</ce-tag>;
    }

    if (charge?.refunded_amount) {
      return <ce-tag>{__('Partially Refunded', 'checkout_engine')}</ce-tag>;
    }

    return <ce-tag type="success">{__('Paid', 'checkout_engine')}</ce-tag>;
  }

  render() {
    if (this.loading) {
      return (
        <ce-card>
          <ce-flex>
            <ce-flex flex-direction="column" style={{ flex: '1' }}>
              <ce-skeleton style={{ width: '30%', display: 'inline-block' }}></ce-skeleton>
              <ce-skeleton style={{ width: '20%', display: 'inline-block' }}></ce-skeleton>
              <ce-skeleton style={{ width: '40%', display: 'inline-block' }}></ce-skeleton>
            </ce-flex>
            <ce-flex flex-direction="column">
              <ce-skeleton style={{ width: '200px' }}></ce-skeleton>
              <ce-skeleton style={{ width: '200px' }}></ce-skeleton>
            </ce-flex>
          </ce-flex>
        </ce-card>
      );
    }

    if (this.error) {
      return (
        <ce-alert open type="danger">
          <span slot="title">{__('Error', 'checkout_engine')}</span>
          {this.error}
        </ce-alert>
      );
    }

    if (!this?.charges?.length) {
      return (
        <ce-card borderless no-divider>
          <span slot="title">
            <slot name="title" />
          </span>
          <slot name="empty">{__('You have no charges.', 'checkout_engine')}</slot>
        </ce-card>
      );
    }

    return (
      <ce-card borderless no-divider>
        <span slot="title">
          <slot name="title" />
        </span>
        <ce-table>
          <ce-table-cell slot="head">{__('Amount', 'checkout_engine')}</ce-table-cell>
          <ce-table-cell slot="head">{__('Date', 'checkout_engine')}</ce-table-cell>
          <ce-table-cell slot="head">{__('Method', 'checkout_engine')}</ce-table-cell>
          <ce-table-cell slot="head" style={{ width: '100px' }}>
            {__('Status', 'checkout_engine')}
          </ce-table-cell>
          {(this.charges || []).map(charge => (
            <ce-table-row>
              <ce-table-cell>
                <ce-format-number type="currency" currency={charge?.currency} value={charge?.amount}></ce-format-number>
              </ce-table-cell>
              <ce-table-cell>
                <ce-format-date date={charge?.created_at * 1000} month="long" day="numeric" year="numeric" hour="numeric" minute="numeric"></ce-format-date>
              </ce-table-cell>
              <ce-table-cell>
                {typeof charge?.payment_method !== 'string' && (
                  <ce-flex justify-content="flex-start" style={{ '--spacing': '1em' }}>
                    <ce-cc-logo style={{ fontSize: '36px' }} brand={charge?.payment_method?.card?.brand}></ce-cc-logo>
                    **** {charge?.payment_method?.card?.last4}
                  </ce-flex>
                )}
              </ce-table-cell>
              <ce-table-cell>{this.renderRefundStatus(charge)}</ce-table-cell>
            </ce-table-row>
          ))}
        </ce-table>
      </ce-card>
    );
  }
}
