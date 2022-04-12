import { Order } from '../../../../types';
import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-order-summary',
  styleUrl: 'sc-order-summary.scss',
  shadow: true,
})
export class ScOrderSummary {
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
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', '--border-radius': '6px' }}></sc-skeleton>
          <sc-skeleton slot="currency" style={{ width: '30px', display: 'inline-block' }}></sc-skeleton>
        </sc-line-item>
      );
    }

    return (
      <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
        <span class="collapse-link" slot="title" onClick={e => this.handleClick(e)}>
          {this.collapsed ? __('Show Summary', 'surecart') : __('Summary', 'surecart')}
          <svg xmlns="http://www.w3.org/2000/svg" class="collapse-link__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <span slot="description">
          <slot name="description" />
        </span>
        <span slot="price">
          <sc-total total={'total'} order={this.order}></sc-total>
        </span>
      </sc-line-item>
    );
  }

  render() {
    return (
      <div class={{ 'summary': true, 'summary--collapsed': !!this.collapsed, 'summary--expanded': !this.collapsed }}>
        {this.collapsible && this.renderHeader()}
        <div
          class={{
            summary__content: true,
            hidden: this.empty,
          }}
        >
          <slot />
        </div>
        {this.empty && !this.loading && <p class="empty">{__('Your cart is empty.', 'surecart')}</p>}
      </div>
    );
  }
}

openWormhole(ScOrderSummary, ['order', 'loading', 'empty'], false);
