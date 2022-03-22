import { Component, h, Prop, Element, Event, EventEmitter, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-quantity-select',
  styleUrl: 'sc-quantity-select.scss',
  shadow: true,
})
export class ScQuantitySelect {
  @Element() el: HTMLScQuantitySelectElement;

  @Prop() clickEl?: HTMLElement;

  @Prop() max: number = 100;
  @Prop() min: number = 1;
  @Prop({ mutable: true, reflect: true }) quantity: number = 0;

  @Event() scChange: EventEmitter<number>;

  @Watch('quantity')
  handleQuantityChange() {
    this.scChange.emit(this.quantity);
  }

  componentWillLoad() {
    if (!this.quantity) {
      this.quantity = this.min;
    }
  }

  render() {
    return (
      <sc-dropdown
        clickEl={this.clickEl || this.el}
        class={{
          quantity: true,
        }}
        style={{ '--panel-height': '150px' }}
      >
        <div class="quantity--trigger" slot="trigger">
          <slot name="prefix">{__('Qty', 'surecart')}</slot> <strong>{this.quantity}</strong>
          <svg viewBox="0 0 24 24" style={{ width: '10px', height: '10px' }} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <sc-menu>
          {[...Array(this.max + 1)].map((_, i) => {
            if (i < this.min) return;
            return (
              <sc-menu-item onClick={() => (this.quantity = i)} key={i}>
                {i}
              </sc-menu-item>
            );
          })}
        </sc-menu>
      </sc-dropdown>
    );
  }
}
