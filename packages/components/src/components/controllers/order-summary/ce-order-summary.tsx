import { Order } from '../../../types';
import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-order-summary',
  styleUrl: 'ce-order-summary.scss',
  shadow: true,
})
export class CEOrderSummary {
  @Prop() busy: boolean;
  @Prop() order: Order;
  @Prop() loading: boolean;
  @Prop() empty: boolean;
  @Prop() collapsible: boolean = false;
  @Prop({ mutable: true }) collapsed: boolean;

  handleClick(e) {
    e.preventDefault();
    this.collapsed = !this.collapsed;
  }

  renderHeader() {
    // loading state
    if (this.loading) {
      return (
        <ce-line-item>
          <ce-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', '--border-radius': '6px' }}></ce-skeleton>
          <ce-skeleton slot="currency" style={{ width: '30px', display: 'inline-block' }}></ce-skeleton>
        </ce-line-item>
      );
    }

    return (
      <ce-line-item style={{ '--price-size': 'var(--ce-font-size-x-large)' }}>
        <span class="collapse-link" slot="title" onClick={e => this.handleClick(e)}>
          {this.collapsed ? __('Show Order Summary', 'checkout_engine') : __('Hide Order Summary', 'checkout_engine')}
          <svg xmlns="http://www.w3.org/2000/svg" class="collapse-link__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <span slot="description">
          <slot name="description" />
        </span>
        <span slot="price">
          <ce-total total={'total'}></ce-total>
        </span>
        <span slot="currency">{this.order?.currency}</span>
      </ce-line-item>
    );
  }

  render() {
    return (
      <div class={{ 'summary': true, 'summary--collapsed': !!this.collapsed }}>
        {this.collapsible && this.renderHeader()}
        <div
          class={{
            summary__content: true,
            hidden: this.empty,
          }}
        >
          <slot />
        </div>
        {this.empty && !this.loading && <p class="empty">{__('Your cart is empty.', 'checkout_engine')}</p>}
        {this.busy && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CEOrderSummary, ['order', 'busy', 'loading', 'empty'], false);
