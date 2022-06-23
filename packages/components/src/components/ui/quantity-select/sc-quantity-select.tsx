import { Component, h, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-quantity-select',
  styleUrl: 'sc-quantity-select.scss',
  shadow: true,
})
export class ScQuantitySelect {
  @Element() el: HTMLScQuantitySelectElement;
  private input: HTMLInputElement;

  @Prop() clickEl?: HTMLElement;

  @Prop() disabled: boolean;
  @Prop() max: number = 100;
  @Prop() min: number = 1;
  @Prop({ mutable: true, reflect: true }) quantity: number = 0;
  /** Inputs focus */
  @Prop({ mutable: true, reflect: true }) hasFocus: boolean;

  @Event({ cancelable: true }) scChange: EventEmitter<number>;

  /** Emitted when the control receives input. */
  @Event({ cancelable: true }) scInput: EventEmitter<number>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  componentWillLoad() {
    if (!this.quantity) {
      this.quantity = this.min;
    }
  }

  decrease() {
    if (this.disabled) return;
    this.quantity = Math.max(this.quantity - 1, this.min);
    this.scChange.emit(this.quantity);
  }

  increase() {
    if (this.disabled) return;
    this.quantity = Math.min(this.quantity + 1, this.max);
    this.scChange.emit(this.quantity);
  }

  handleBlur() {
    this.hasFocus = false;
    this.scBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  handleChange() {
    this.quantity = parseInt(this.input.value);
    this.scChange.emit(this.quantity);
  }

  handleInput() {
    this.quantity = parseInt(this.input.value);
    this.scInput.emit(this.quantity);
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'quantity': true,
          // States
          'quantity--focused': this.hasFocus,
          'quantity--disabled': this.disabled,
        }}
      >
        <span
          role="button"
          aria-label={__('decrease number', 'surecart')}
          class={{ 'button__decrease': true, 'button--disabled': this.quantity <= this.min }}
          onClick={() => this.quantity > this.min && this.decrease()}
        >
          <sc-icon name="minus"></sc-icon>
        </span>

        <input
          class="input__control"
          ref={el => (this.input = el as HTMLInputElement)}
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
          onChange={() => this.handleChange()}
          onInput={() => this.handleInput()}
          onFocus={() => this.handleFocus()}
          onBlur={() => this.handleBlur()}
        />

        <span
          role="button"
          aria-label={__('increase number', 'surecart')}
          class={{ 'button__increase': true, 'button--disabled': this.quantity >= this.max }}
          onClick={() => this.quantity < this.max && this.increase()}
        >
          <sc-icon name="plus"></sc-icon>
        </span>
      </div>
    );
  }
}
