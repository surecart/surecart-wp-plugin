import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Invoice } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-invoices-list',
  styleUrl: 'ce-invoices-list.scss',
  shadow: true,
})
export class CeInvoicesList {
  @Element() el: HTMLCeInvoicesListElement;
  /** Query to fetch invoices */
  @Prop() query: object;
  @Prop() header: string;

  @State() invoices: Array<Invoice> = [];

  /** Loading state */
  @State() loading: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getItems();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  /** Get all invoices */
  async getItems() {
    if (!this.query) return;
    try {
      this.loading = true;
      this.invoices = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/invoices/`, {
          expand: ['invoice_items', 'charge'],
          ...this.query,
        }),
      })) as Invoice[];
    } catch (e) {
      console.error(this.error);
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
    } finally {
      this.loading = false;
    }
  }

  renderStatusBadge(invoice: Invoice) {
    const { status, charge } = invoice;
    if (typeof charge === 'object') {
      if (charge.fully_refunded) {
        return <ce-tag type="danger">{__('Refunded', 'checkout_engine')}</ce-tag>;
      }
      if (charge?.refunded_amount) {
        return <ce-tag type="info">{__('Partially Refunded', 'checkout_engine')}</ce-tag>;
      }
    }

    return <ce-order-status-badge status={status}></ce-order-status-badge>;
  }

  renderContent() {
    if (this.loading) {
      return (
        <ce-stacked-list>
          <ce-stacked-list-row style={{ '--columns': '4' }} mobile-size={500}>
            {[...Array(4)].map(() => (
              <ce-skeleton style={{ width: '100px', display: 'inline-block' }}></ce-skeleton>
            ))}
          </ce-stacked-list-row>
        </ce-stacked-list>
      );
    }

    return (
      <ce-stacked-list>
        {this.invoices.map(invoice => {
          const { invoice_items, total_amount, currency, created_at, url } = invoice;
          return (
            <ce-stacked-list-row href={url} style={{ '--columns': '4' }} mobile-size={500}>
              <div>
                <ce-format-date class="order__date" date={created_at} type="timestamp" month="short" day="numeric" year="numeric"></ce-format-date>
              </div>
              <div>
                <ce-text
                  truncate
                  style={{
                    '--color': 'var(--ce-color-gray-500)',
                  }}
                >
                  {sprintf(_n('%s item', '%s items', invoice_items?.pagination?.count || 0, 'checkout_engine'), invoice_items?.pagination?.count || 0)}
                </ce-text>
              </div>
              <div>{this.renderStatusBadge(invoice)}</div>
              <div>
                <ce-format-number type="currency" currency={currency} value={total_amount}></ce-format-number>
              </div>
            </ce-stacked-list-row>
          );
        })}
      </ce-stacked-list>
    );
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

    return (
      <div
        class={{
          'invoices-list': true,
        }}
      >
        <ce-heading>
          {this.header || __('Invoice History', 'checkout_engine')}
          <ce-button type="link" slot="end">
            {__('View all', 'checkout_engine')}
            <ce-icon name="chevron-right" slot="suffix"></ce-icon>
          </ce-button>
        </ce-heading>

        <ce-card no-padding>{this.renderContent()}</ce-card>
      </div>
    );
  }
}
