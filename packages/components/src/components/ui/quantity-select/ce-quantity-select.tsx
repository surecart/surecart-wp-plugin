import { Component, h, Prop, Element, Event, EventEmitter, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'ce-quantity-select',
  styleUrl: 'ce-quantity-select.scss',
  shadow: true,
})
export class CeQuantitySelect {
  @Element() el: HTMLCeQuantitySelectElement;

  @Prop() clickEl?: HTMLElement;

  @Prop() max: number = 100;
  @Prop() min: number = 1;
  @Prop({ mutable: true, reflect: true }) quantity: number = 0;

  @Event() ceChange: EventEmitter<number>;

  @Watch('quantity')
  handleQuantityChange() {
    this.ceChange.emit(this.quantity);
  }

  componentWillLoad() {
    if (!this.quantity) {
      this.quantity = this.min;
    }
  }

  render() {
    return (
      <ce-dropdown
        clickEl={this.clickEl || this.el}
        class={{
          quantity: true,
        }}
        style={{ '--panel-height': '150px' }}
      >
        <div class="quantity--trigger" slot="trigger">
          <slot name="prefix">{__('Qty', 'checkout_engine')}</slot> <strong>{this.quantity}</strong>
          <svg viewBox="0 0 24 24" style={{ width: '10px', height: '10px' }} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <ce-menu>
          {[...Array(this.max + 1)].map((_, i) => {
            if (i < this.min) return;
            return (
              <ce-menu-item onClick={() => (this.quantity = i)} key={i}>
                {i}
              </ce-menu-item>
            );
          })}
        </ce-menu>
      </ce-dropdown>
    );
  }
}
