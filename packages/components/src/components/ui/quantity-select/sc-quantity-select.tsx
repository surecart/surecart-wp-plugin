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

  @Prop() disabled: boolean;
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

  decrease() {
    if (this.disabled) return;
    this.quantity = Math.max(this.quantity - 1, this.min);
  }

  increase() {
    if (this.disabled) return;
    this.quantity = Math.min(this.quantity + 1, this.max);
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'quantity': true,
          'input--disabled': this.disabled,
        }}
      >
        <span role="button" aria-label="decrease number" class="button__decrease" onClick={() => this.decrease()}>
          <sc-icon name="minus"></sc-icon>
        </span>

        <input
          class="input__control"
          step="1"
          type="number"
          max={this.max}
          min={this.min}
          value={this.quantity}
          autocomplete="off"
          tabindex="0"
          role="spinbutton"
          aria-valuemax={this.max}
          aria-valuemin={this.min}
          aria-valuenow={this.quantity}
          aria-disabled={this.disabled}
        />

        <span role="button" aria-label="increase number" class="button__increase" onClick={() => this.increase()}>
          <sc-icon name="plus"></sc-icon>
        </span>
      </div>
    );
  }
}
